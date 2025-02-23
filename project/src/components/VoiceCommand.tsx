import React, { useState } from 'react';
import { Mic, X } from 'lucide-react';

interface VoiceCommandProps {
  onClose: () => void;
  onCommand: (text: string) => void;
}

export function VoiceCommand({ onClose, onCommand }: VoiceCommandProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  const startListening = () => {
    setIsListening(true);
    // In a real implementation, we would use the Web Speech API
    // For now, we'll simulate voice input
    setTimeout(() => {
      setTranscript('Add expense of $50 for lunch');
      setIsListening(false);
    }, 2000);
  };

  const handleSubmit = () => {
    onCommand(transcript);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 mx-4 animate-slide-up">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Voice Command</h2>
          <button onClick={onClose} className="p-2">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="text-center">
          <button
            onClick={startListening}
            className={`w-24 h-24 rounded-full ${
              isListening ? 'bg-red-500' : 'bg-indigo-600'
            } text-white flex items-center justify-center mx-auto mb-6 transition-colors`}
          >
            <Mic className={`w-8 h-8 ${isListening ? 'animate-pulse' : ''}`} />
          </button>

          <p className="text-gray-600 mb-4">
            {isListening
              ? 'Listening...'
              : 'Tap the microphone and speak your command'}
          </p>

          {transcript && (
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <p className="text-gray-800">{transcript}</p>
            </div>
          )}

          {transcript && (
            <button
              onClick={handleSubmit}
              className="w-full bg-indigo-600 text-white rounded-xl py-4 font-semibold"
            >
              Confirm
            </button>
          )}
        </div>
      </div>
    </div>
  );
}