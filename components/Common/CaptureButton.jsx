import React, { useRef, useState } from 'react';

export default function CaptureButton({ onCapture }) {
  const videoRef = useRef();
  const canvasRef = useRef();
  const [stream, setStream] = useState(null);
  const [captured, setCaptured] = useState(null);

  const startCamera = async () => {
    const s = await navigator.mediaDevices.getUserMedia({ video: true });
    setStream(s);
    if (videoRef.current) videoRef.current.srcObject = s;
  };
  const capture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0);
      canvas.toBlob(blob => {
        setCaptured(blob);
        if (onCapture) onCapture(blob);
      });
    }
  };
  const stopCamera = () => {
    if (stream) stream.getTracks().forEach(t => t.stop());
    setStream(null);
  };
  return (
    <div className="mb-4">
      {!stream && <button onClick={startCamera} className="bg-blue-700 text-white px-3 py-1 rounded">📷 Start Camera</button>}
      {stream && (
        <div>
          <video ref={videoRef} autoPlay className="w-64 h-40 border my-2" />
          <button onClick={capture} className="bg-green-700 text-white px-3 py-1 rounded mr-2">Capture</button>
          <button onClick={stopCamera} className="bg-gray-700 text-white px-3 py-1 rounded">Stop</button>
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
      )}
      {captured && <div className="mt-2 text-green-700">Image captured!</div>}
    </div>
  );
}
