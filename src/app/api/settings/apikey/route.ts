import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { encrypt } from '@/lib/encryption';
import { GoogleGenAI } from '@google/genai';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { apiKey } = await request.json();
    if (!apiKey || typeof apiKey !== 'string') {
      return NextResponse.json({ error: 'API key is required' }, { status: 400 });
    }

    // Validate the API key by making a simple test call
    try {
      const ai = new GoogleGenAI({ apiKey });
      await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: 'Say "ok" in one word.',
      });
    } catch {
      return NextResponse.json({ error: 'Invalid API key. Please check and try again.' }, { status: 400 });
    }

    // Encrypt and store
    const encryptedKey = encrypt(apiKey);

    const { error } = await supabase
      .from('profiles')
      .update({ encrypted_api_key: encryptedKey })
      .eq('id', user.id);

    if (error) {
      return NextResponse.json({ error: 'Failed to save API key' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API key save error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { error } = await supabase
      .from('profiles')
      .update({ encrypted_api_key: null })
      .eq('id', user.id);

    if (error) {
      return NextResponse.json({ error: 'Failed to remove API key' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API key remove error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
