
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Volume2, Square } from 'lucide-react';
import { toast } from 'sonner';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  onCommand: (command: string) => void;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscript, onCommand }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Check for Web Speech API support
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognition);
    
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPart = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcriptPart;
          } else {
            interimTranscript += transcriptPart;
          }
        }

        setTranscript(finalTranscript + interimTranscript);

        if (finalTranscript) {
          onTranscript(finalTranscript);
          processVoiceCommand(finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        
        if (event.error === 'not-allowed') {
          toast.error('Microphone access denied. Please enable microphone permissions.');
        } else if (event.error === 'no-speech') {
          toast.warning('No speech detected. Please try again.');
        } else {
          toast.error(`Voice recognition error: ${event.error}`);
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onTranscript]);

  const processVoiceCommand = (text: string) => {
    const lowerText = text.toLowerCase();
    
    // Define voice commands
    const commands = {
      'create bar chart': 'bar_chart',
      'create line chart': 'line_chart',
      'create pie chart': 'pie_chart',
      'show data': 'show_data',
      'clear filters': 'clear_filters',
      'export data': 'export_data',
      'compare datasets': 'compare_datasets',
      'save dashboard': 'save_dashboard',
      'load dashboard': 'load_dashboard',
      'switch to dark mode': 'dark_mode',
      'switch to light mode': 'light_mode',
      'start analysis': 'start_analysis',
      'stop listening': 'stop_listening'
    };

    // Check for exact matches first
    for (const [phrase, command] of Object.entries(commands)) {
      if (lowerText.includes(phrase)) {
        onCommand(command);
        toast.success(`Command recognized: ${phrase}`);
        
        if (command === 'stop_listening') {
          stopListening();
        }
        
        return;
      }
    }

    // Check for data-related queries
    if (lowerText.includes('show') && lowerText.includes('chart')) {
      onCommand('show_chart');
      toast.success('Command recognized: show chart');
    } else if (lowerText.includes('filter') && lowerText.includes('by')) {
      onCommand('filter_data');
      toast.success('Command recognized: filter data');
    } else if (lowerText.includes('analyze') || lowerText.includes('analysis')) {
      onCommand('start_analysis');
      toast.success('Command recognized: start analysis');
    }
  };

  const startListening = async () => {
    if (!isSupported) {
      toast.error('Voice input not supported in this browser');
      return;
    }

    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      setTranscript('');
      recognitionRef.current.start();
      setIsListening(true);
      toast.success('Voice input started. Speak now...');
    } catch (error) {
      console.error('Error starting voice recognition:', error);
      toast.error('Failed to access microphone');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      toast.info('Voice input stopped');
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      speechSynthesis.speak(utterance);
    } else {
      toast.error('Text-to-speech not supported in this browser');
    }
  };

  if (!isSupported) {
    return (
      <Card className="bg-slate-800/50 border-red-500/20">
        <CardContent className="p-4 text-center">
          <MicOff className="h-8 w-8 mx-auto mb-2 text-red-400" />
          <p className="text-sm text-red-400">Voice input not supported in this browser</p>
          <p className="text-xs text-slate-500 mt-1">Try using Chrome, Edge, or Safari</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/50 border-purple-500/20">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Mic className="h-5 w-5 text-purple-400" />
            <span className="font-medium">Voice Input</span>
            {isListening && (
              <Badge variant="secondary" className="bg-red-500/20 text-red-400">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-1" />
                Listening
              </Badge>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => speakText('Voice assistant ready for commands')}
              className="border-purple-500/30"
            >
              <Volume2 className="h-4 w-4" />
            </Button>
            
            <Button
              variant={isListening ? "destructive" : "default"}
              size="sm"
              onClick={isListening ? stopListening : startListening}
              className={isListening ? "bg-red-600 hover:bg-red-700" : "bg-gradient-to-r from-purple-500 to-cyan-500"}
            >
              {isListening ? (
                <>
                  <Square className="h-4 w-4 mr-2" />
                  Stop
                </>
              ) : (
                <>
                  <Mic className="h-4 w-4 mr-2" />
                  Start
                </>
              )}
            </Button>
          </div>
        </div>

        {transcript && (
          <div className="bg-slate-700/50 p-3 rounded-lg mb-4">
            <p className="text-sm font-medium mb-1">Transcript:</p>
            <p className="text-sm text-slate-300">{transcript}</p>
          </div>
        )}

        <div className="space-y-2">
          <p className="text-xs font-medium text-slate-400">Voice Commands:</p>
          <div className="grid grid-cols-2 gap-1 text-xs text-slate-500">
            <span>"Create bar chart"</span>
            <span>"Show data"</span>
            <span>"Clear filters"</span>
            <span>"Export data"</span>
            <span>"Save dashboard"</span>
            <span>"Start analysis"</span>
            <span>"Compare datasets"</span>
            <span>"Stop listening"</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceInput;
