import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Process base64 in chunks to prevent memory issues
function processBase64Chunks(base64String: string, chunkSize = 32768) {
  const chunks: Uint8Array[] = [];
  let position = 0;
  
  while (position < base64String.length) {
    const chunk = base64String.slice(position, position + chunkSize);
    const binaryChunk = atob(chunk);
    const bytes = new Uint8Array(binaryChunk.length);
    
    for (let i = 0; i < binaryChunk.length; i++) {
      bytes[i] = binaryChunk.charCodeAt(i);
    }
    
    chunks.push(bytes);
    position += chunkSize;
  }

  const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;

  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }

  return result;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Authenticate the user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Get user's organization
    const { data: userData } = await supabaseClient
      .from('users')
      .select('organization_id')
      .eq('auth_user_id', user.id)
      .single();

    const { audio, action = 'transcribe', text } = await req.json();
    
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    if (action === 'transcribe') {
      if (!audio) {
        throw new Error('No audio data provided');
      }

      console.log('Processing voice transcription for user:', user.id);

      // Process audio in chunks
      const binaryAudio = processBase64Chunks(audio);
      
      // Prepare form data
      const formData = new FormData();
      const blob = new Blob([binaryAudio], { type: 'audio/webm' });
      formData.append('file', blob, 'audio.webm');
      formData.append('model', 'whisper-1');

      // Send to OpenAI
      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('OpenAI transcription error:', errorText);
        throw new Error(`OpenAI API error: ${errorText}`);
      }

      const result = await response.json();
      console.log('Transcription result:', result.text);

      // Now process the transcribed text with AI assistant
      const assistantResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4.1-2025-04-14',
          messages: [
            {
              role: 'system',
              content: `You are a voice assistant for Bravo Service Suite. Handle customer calls professionally:

              CAPABILITIES:
              - Schedule service appointments
              - Provide service quotes
              - Handle emergency requests  
              - Answer questions about services
              - Take customer information

              SERVICES:
              - Plumbing (repairs, installations, emergency)
              - HVAC (maintenance, repairs, installations)
              - Electrical (repairs, installations, safety checks)
              - General maintenance

              RESPONSE STYLE:
              - Clear and concise for voice
              - Friendly but professional
              - Ask clarifying questions if needed
              - Confirm important details
              - Provide next steps

              If customer wants to:
              1. Schedule - Get name, phone, service type, preferred date/time
              2. Emergency - Get location, contact, and nature of emergency
              3. Quote - Get service details and contact info
              4. General info - Provide helpful information about services

              Keep responses conversational and suitable for voice interaction.`
            },
            {
              role: 'user',
              content: result.text
            }
          ],
          max_tokens: 300,
          temperature: 0.7
        }),
      });

      if (!assistantResponse.ok) {
        throw new Error('Failed to process with AI assistant');
      }

      const assistantData = await assistantResponse.json();
      const aiResponseText = assistantData.choices[0]?.message?.content;

      // Log usage with service role
      if (userData?.organization_id) {
        const supabaseAdmin = createClient(
          Deno.env.get('SUPABASE_URL')!,
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
        );

        await supabaseAdmin.from('ai_usage_logs').insert({
          organization_id: userData.organization_id,
          user_id: user.id,
          feature: 'voice-assistant',
          model: 'whisper-1+gpt-4',
          tokens_used: Math.ceil((result.text.length + (aiResponseText?.length || 0)) / 4),
          cost_usd: 0.01
        });
      }

      return new Response(JSON.stringify({
        transcription: result.text,
        aiResponse: aiResponseText,
        action: 'schedule_followup'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });

    } else if (action === 'text_to_speech') {
      if (!text) {
        throw new Error('No text provided for speech synthesis');
      }

      console.log('Converting text to speech for user:', user.id);

      const response = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'tts-1',
          input: text,
          voice: 'alloy',
          response_format: 'mp3'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate speech');
      }

      const audioBuffer = await response.arrayBuffer();
      const base64Audio = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)));

      // Log usage with service role
      if (userData?.organization_id) {
        const supabaseAdmin = createClient(
          Deno.env.get('SUPABASE_URL')!,
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
        );

        await supabaseAdmin.from('ai_usage_logs').insert({
          organization_id: userData.organization_id,
          user_id: user.id,
          feature: 'text-to-speech',
          model: 'tts-1',
          tokens_used: Math.ceil(text.length / 4),
          cost_usd: 0.005
        });
      }

      return new Response(JSON.stringify({
        audio: base64Audio,
        format: 'mp3'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    throw new Error('Invalid action specified');

  } catch (error) {
    console.error('Error in ai-voice-assistant function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
