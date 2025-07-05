import React, { useState } from 'react';
import { Mic, MicOff, Play, Pause, Volume2 } from 'lucide-react';
import Logo from './Logo';
import { SearchRecord } from '../types';

interface VoiceNotesProps {
  onSearchComplete: (search: Omit<SearchRecord, 'id' | 'timestamp'>) => void;
}

const VoiceNotes: React.FC<VoiceNotesProps> = ({ onSearchComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasRecording, setHasRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsRecording(true);
      setRecordingTime(0);
      setHasRecording(false);
    } catch (error) {
      alert('Microphone access denied. Please allow microphone access to use voice notes.');
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    setHasRecording(true);
  };

  const playRecording = () => {
    setIsPlaying(true);
    // Simulate playback
    setTimeout(() => setIsPlaying(false), 3000);
  };

  const processVoiceNote = async () => {
    setIsProcessing(true);
    
    // Simulate voice processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock processed search data
    const mockSearchData: Omit<SearchRecord, 'id' | 'timestamp'> = {
      destinations: ['Kerala', 'Goa'],
      startDate: '15-12-2024',
      endDate: '20-12-2024',
      activities: {
        'Kerala': ['Backwater cruise', 'Spice plantation tour', 'Kathakali performance'],
        'Goa': ['Beach hopping', 'Water sports', 'Portuguese architecture tour']
      },
      status: 'active'
    };

    onSearchComplete(mockSearchData);
    setIsProcessing(false);
    setHasRecording(false);
    setRecordingTime(0);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl shadow-2xl p-6 border border-gray-700/50">
        <h2 className="text-2xl font-bold text-gray-100 mb-6 flex items-center">
          <Mic className="h-6 w-6 text-orange-400 mr-2" />
          Voice Search
        </h2>

        <div className="text-center space-y-6">
          {/* Recording Area */}
          <div className="bg-gradient-to-br from-gray-700/30 to-gray-600/30 rounded-2xl p-8 border border-gray-600/50 backdrop-blur-sm">
            <div className="flex flex-col items-center space-y-4">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
                isRecording 
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 animate-pulse shadow-2xl' 
                  : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-xl'
              }`}>
                {isRecording ? (
                  <MicOff className="h-10 w-10 text-white" />
                ) : (
                  <Mic className="h-10 w-10 text-white" />
                )}
              </div>

              <div className="text-center">
                {isRecording ? (
                  <div>
                    <p className="text-lg font-medium text-gray-100">Recording...</p>
                    <p className="text-3xl font-bold text-red-400 mt-2">
                      {formatTime(recordingTime)}
                    </p>
                  </div>
                ) : hasRecording ? (
                  <div>
                    <p className="text-lg font-medium text-gray-100">Recording Ready</p>
                    <p className="text-sm text-gray-300">
                      Duration: {formatTime(recordingTime)}
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-lg font-medium text-gray-100">Ready to Record</p>
                    <p className="text-sm text-gray-300">
                      Tap to start voice search
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center space-x-4">
            {!isRecording && !hasRecording && (
              <button
                onClick={startRecording}
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-6 py-3 rounded-lg font-medium transition-all flex items-center space-x-2 shadow-lg"
              >
                <Mic className="h-5 w-5" />
                <span>Start Recording</span>
              </button>
            )}

            {isRecording && (
              <button
                onClick={stopRecording}
                className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-medium transition-all flex items-center space-x-2 shadow-lg"
              >
                <MicOff className="h-5 w-5" />
                <span>Stop Recording</span>
              </button>
            )}

            {hasRecording && !isProcessing && (
              <div className="flex space-x-3">
                <button
                  onClick={playRecording}
                  disabled={isPlaying}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-4 py-3 rounded-lg font-medium transition-all flex items-center space-x-2 disabled:opacity-50 shadow-lg"
                >
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  <span>{isPlaying ? 'Playing...' : 'Play'}</span>
                </button>
                
                <button
                  onClick={processVoiceNote}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-lg font-medium transition-all flex items-center space-x-2 shadow-lg"
                >
                  <Volume2 className="h-5 w-5" />
                  <span>Process & Search</span>
                </button>
                
                <button
                  onClick={() => {
                    setHasRecording(false);
                    setRecordingTime(0);
                  }}
                  className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-4 py-3 rounded-lg font-medium transition-all shadow-lg"
                >
                  Clear
                </button>
              </div>
            )}
          </div>

          {isProcessing && (
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-400"></div>
              <p className="text-gray-300">Processing your voice note...</p>
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-gradient-to-br from-orange-500/10 to-amber-500/10 rounded-2xl p-6 border border-orange-500/30 backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-orange-300 mb-3">
          How to use Voice Search
        </h3>
        <ul className="text-sm text-orange-200/90 space-y-2">
          <li>• Speak naturally about your travel plans</li>
          <li>• Mention destinations, dates, and preferences</li>
          <li>• Example: "I want to visit Kerala and Goa from December 15th to 20th"</li>
          <li>• Our AI will understand and create your search automatically</li>
        </ul>
      </div>
    </div>
  );
};

export default VoiceNotes;