import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX,
  Phone,
  Loader2,
  MessageSquare
} from 'lucide-react';

interface VoiceResponse {
  transcription: string;
  aiResponse: string;
  action: string;
}

export const VoiceAssistant: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [lastResponse, setLastResponse] = useState<VoiceResponse | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 44100,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processAudio(audioBlob);
        
        // Clean up
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      
      toast({
        title: 'Recording Started',
        description: 'Speak now... Click stop when finished.',
      });
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: 'Error',
        description: 'Failed to access microphone. Please check permissions.',
        variant: 'destructive'
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsProcessing(true);
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    try {
      // Convert blob to base64
      const arrayBuffer = await audioBlob.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      let binaryString = '';
      for (let i = 0; i < uint8Array.length; i++) {
        binaryString += String.fromCharCode(uint8Array[i]);
      }
      const base64Audio = btoa(binaryString);

      console.log('Processing audio with AI...');

      const { data, error } = await supabase.functions.invoke('ai-voice-assistant', {
        body: {
          audio: base64Audio,
          action: 'transcribe'
        }
      });

      if (error) throw error;

      setLastResponse(data);

      // If audio is enabled, convert AI response to speech
      if (audioEnabled && data.aiResponse) {
        await playAIResponse(data.aiResponse);
      }

      toast({
        title: 'Voice Processed',
        description: 'AI assistant has responded to your message.',
      });
    } catch (error) {
      console.error('Error processing audio:', error);
      toast({
        title: 'Error',
        description: 'Failed to process voice message. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const playAIResponse = async (text: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('ai-voice-assistant', {
        body: {
          text,
          action: 'text_to_speech'
        }
      });

      if (error) throw error;

      // Convert base64 audio to blob and play
      const binaryString = atob(data.audio);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      const audioBlob = new Blob([bytes], { type: 'audio/mp3' });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
      };
      
      await audio.play();
    } catch (error) {
      console.error('Error playing AI response:', error);
      // Don't show error toast for audio playback, fallback to text only
    }
  };

  const simulatePhoneCall = () => {
    toast({
      title: 'Phone Integration',
      description: 'Phone system integration would be configured here.',
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-primary" />
            AI Voice Assistant
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              {isRecording ? (
                <div className="relative">
                  <Button
                    size="lg"
                    onClick={stopRecording}
                    className="h-24 w-24 rounded-full bg-red-500 hover:bg-red-600 animate-pulse"
                  >
                    <MicOff className="h-8 w-8" />
                  </Button>
                  <div className="absolute -top-2 -right-2 h-6 w-6 bg-red-500 rounded-full animate-ping"></div>
                </div>
              ) : isProcessing ? (
                <Button
                  size="lg"
                  disabled
                  className="h-24 w-24 rounded-full"
                >
                  <Loader2 className="h-8 w-8 animate-spin" />
                </Button>
              ) : (
                <Button
                  size="lg"
                  onClick={startRecording}
                  className="h-24 w-24 rounded-full bg-primary hover:bg-primary/90"
                >
                  <Mic className="h-8 w-8" />
                </Button>
              )}
            </div>

            <div>
              {isRecording && (
                <p className="text-red-600 font-medium">Recording... Click to stop</p>
              )}
              {isProcessing && (
                <p className="text-blue-600 font-medium">Processing voice message...</p>
              )}
              {!isRecording && !isProcessing && (
                <p className="text-muted-foreground">Click to start voice conversation</p>
              )}
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              onClick={() => setAudioEnabled(!audioEnabled)}
              className="flex items-center gap-2"
            >
              {audioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              {audioEnabled ? 'Audio On' : 'Audio Off'}
            </Button>
            
            <Button
              variant="outline"
              onClick={simulatePhoneCall}
              className="flex items-center gap-2"
            >
              <Phone className="h-4 w-4" />
              Phone Integration
            </Button>
          </div>

          <div className="text-sm text-muted-foreground text-center">
            <p>AI Voice Assistant can help with:</p>
            <ul className="mt-2 space-y-1">
              <li>• Schedule service appointments</li>
              <li>• Provide service estimates</li>
              <li>• Handle emergency requests</li>
              <li>• Answer service questions</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {lastResponse && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Last Conversation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">What you said:</h4>
              <p className="bg-muted p-3 rounded-lg text-sm">
                "{lastResponse.transcription}"
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">AI Response:</h4>
              <p className="bg-blue-50 p-3 rounded-lg text-sm">
                {lastResponse.aiResponse}
              </p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Create Appointment
              </Button>
              <Button variant="outline" size="sm">
                Generate Estimate
              </Button>
              <Button variant="outline" size="sm">
                Emergency Dispatch
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};