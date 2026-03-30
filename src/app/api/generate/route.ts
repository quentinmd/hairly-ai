import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateHairstyle, type HairstyleKey } from '@/lib/gemini';
import { decrypt } from '@/lib/encryption';

export const maxDuration = 60; // Allow up to 60s for AI generation

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // 1. Authenticate user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse request
    const body = await request.json();
    const { imageBase64, mimeType, style } = body as {
      imageBase64: string;
      mimeType: string;
      style: HairstyleKey;
    };

    if (!imageBase64 || !mimeType || !style) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 3. Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_status, credits, encrypted_api_key')
      .eq('id', user.id)
      .single();

    if (!profile) {
      // Auto-create profile
      await supabase.from('profiles').insert({
        id: user.id,
        email: user.email!,
        credits: 1,
      });
    }

    const subscriptionActive = profile?.subscription_status === 'active';
    const hasApiKey = !!profile?.encrypted_api_key;
    const hasCredits = (profile?.credits ?? 1) > 0;

    // 4. Determine if user can generate
    if (!subscriptionActive && !hasApiKey && !hasCredits) {
      return NextResponse.json({
        error: 'No credits remaining. Subscribe or add your API key.',
        needsUpgrade: true,
      }, { status: 403 });
    }

    // 5. Determine which API key to use
    let userApiKey: string | undefined;
    if (hasApiKey && profile?.encrypted_api_key) {
      try {
        userApiKey = decrypt(profile.encrypted_api_key);
      } catch {
        return NextResponse.json({ error: 'Failed to decrypt API key. Please re-enter it in settings.' }, { status: 500 });
      }
    }

    // 6. Generate with AI
    const result = await generateHairstyle(imageBase64, mimeType, style, userApiKey);

    if (!result) {
      return NextResponse.json({ error: 'AI generation failed. Please try again.' }, { status: 500 });
    }

    // 7. Upload result to Supabase Storage
    const fileName = `${user.id}/${Date.now()}-${style}.png`;
    const imageBuffer = Buffer.from(result.imageBase64, 'base64');

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('generations')
      .upload(fileName, imageBuffer, {
        contentType: result.mimeType,
        upsert: false,
      });

    if (uploadError) {
      // If storage isn't set up, return base64 directly
      console.error('Storage upload error:', uploadError);

      // Determine if result should be blurred
      const shouldBlur = !subscriptionActive && !hasApiKey;

      // Deduct credit if free user (no API key)
      if (!subscriptionActive && !hasApiKey && hasCredits) {
        await supabase
          .from('profiles')
          .update({ credits: (profile?.credits ?? 1) - 1 })
          .eq('id', user.id);
      }

      return NextResponse.json({
        imageUrl: `data:${result.mimeType};base64,${result.imageBase64}`,
        blurred: shouldBlur,
        creditsRemaining: !subscriptionActive && !hasApiKey ? Math.max(0, (profile?.credits ?? 1) - 1) : undefined,
        usedOwnKey: !!userApiKey,
      });
    }

    // Get public URL
    const { data: publicUrl } = supabase.storage
      .from('generations')
      .getPublicUrl(uploadData.path);

    // 8. Save generation record
    await supabase.from('generations').insert({
      user_id: user.id,
      style,
      original_image_url: '',
      generated_image_url: publicUrl.publicUrl,
      status: 'completed',
      used_own_key: !!userApiKey,
    });

    // 9. Deduct credit if free user
    const shouldBlur = !subscriptionActive && !hasApiKey;
    if (!subscriptionActive && !hasApiKey && hasCredits) {
      await supabase
        .from('profiles')
        .update({ credits: (profile?.credits ?? 1) - 1 })
        .eq('id', user.id);
    }

    return NextResponse.json({
      imageUrl: publicUrl.publicUrl,
      blurred: shouldBlur,
      creditsRemaining: !subscriptionActive && !hasApiKey ? Math.max(0, (profile?.credits ?? 1) - 1) : undefined,
      usedOwnKey: !!userApiKey,
    });
  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Internal server error',
    }, { status: 500 });
  }
}
