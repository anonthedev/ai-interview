'use client';

import { useEffect, useRef, useState } from 'react';

const SpeechToText = () => {
    const [transcription, setTranscription] = useState('');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isListening, setIsListening] = useState(false);
  const recognition = useRef<SpeechRecognition | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognitionInstance = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognitionInstance();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;

      recognitionInstance.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join('');
        setTranscription(transcript);
      };

      recognitionInstance.onspeechend = () => {
        recognitionInstance.stop();
        setIsListening(false);
      };

      recognitionInstance.onaudiostart = () => {
        navigator.mediaDevices
          .getUserMedia({ audio: true })
          .then((stream) => {
            const mediaRecorderInstance = new MediaRecorder(stream);
            mediaRecorderInstance.ondataavailable = (event) => {
              audioChunks.current.push(event.data);
            };

            mediaRecorderInstance.onstop = () => {
              const audioBlob = new Blob(audioChunks.current, { type: 'audio/ogg; codecs=opus' });
              setAudioBlob(audioBlob);
              audioChunks.current = [];
            };

            mediaRecorderInstance.start();
            mediaRecorder.current = mediaRecorderInstance;
          })
          .catch((error) => {
            console.error('Error accessing microphone:', error);
          });
      };

      recognition.current = recognitionInstance;
    } else {
      console.error('Web Speech API is not supported in this browser.');
    }
  }, []);

  const handleStartListening = () => {
    if (recognition.current) {
      recognition.current.start();
      setIsListening(true);
    }
  };

  const handleStopListening = () => {
    recognition.current?.stop();
    mediaRecorder.current?.stop();
    setIsListening(false);
  };


  return (
    <div>
    <h1>Speech Recognition</h1>
    <p>Transcription: {transcription}</p>
    {isListening ? (
      <button onClick={handleStopListening}>Stop Listening</button>
    ) : (
      <button onClick={handleStartListening}>Start Listening</button>
    )}
    {audioBlob && (
      <div>
        <h2>Recorded Audio</h2>
        <audio controls src={URL.createObjectURL(audioBlob)}>
          Your browser does not support the audio element.
        </audio>
      </div>
    )}
  </div>
  )
}

export default SpeechToText
