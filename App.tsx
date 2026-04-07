import React, { useState, useRef, useCallback, useEffect } from 'react';
import { PlayerSide, AppState } from './types';
import { getBestChessMove } from './services/geminiService';
import { CameraIcon, WhitePawnIcon, BlackPawnIcon, ArrowLeftIcon, SparklesIcon } from './components/icons';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.SelectingSide);
  const [selectedSide, setSelectedSide] = useState<PlayerSide | null>(null);
  const [bestMove, setBestMove] = useState<{ move: string; explanation: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastCapture, setLastCapture] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  useEffect(() => {
    // Cleanup camera on component unmount
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  const handleSideSelect = (side: PlayerSide) => {
    setSelectedSide(side);
    setAppState(AppState.Camera);
  };

  const handleCapture = useCallback(async () => {
    if (videoRef.current && canvasRef.current && selectedSide) {
      setAppState(AppState.Loading);
      setError(null);

      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setLastCapture(dataUrl); // Save blurred background
        
        try {
          const base64Image = dataUrl.split(',')[1];
          const result = await getBestChessMove(base64Image, 'image/jpeg', selectedSide);
          setBestMove(result);
          setAppState(AppState.Result);
        } catch (e) {
          const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
          setError(errorMessage);
          setAppState(AppState.Error);
        } finally {
            stopCamera();
        }
      }
    }
  }, [selectedSide, stopCamera]);
  
  const handleResetToCamera = () => {
      setBestMove(null);
      setError(null);
      setAppState(AppState.Camera);
  };

  const handleResetToSideSelection = () => {
      handleResetToCamera();
      setAppState(AppState.SelectingSide);
  };

  const renderContent = () => {
    switch (appState) {
      case AppState.SelectingSide:
        return <SideSelector onSelect={handleSideSelect} />;
      case AppState.Camera:
      case AppState.Loading:
        return (
          <CameraView
            videoRef={videoRef}
            canvasRef={canvasRef}
            isLoading={appState === AppState.Loading}
            onCapture={handleCapture}
            onBack={handleResetToSideSelection}
            stopCamera={stopCamera}
          />
        );
      case AppState.Result:
        return bestMove ? (
          <ResultView 
            move={bestMove.move} 
            explanation={bestMove.explanation}
            backgroundImage={lastCapture}
            onScanAgain={handleResetToCamera}
            onChangeSide={handleResetToSideSelection}
          />
        ) : null;
       case AppState.Error:
        return (
          <ErrorView
            error={error}
            backgroundImage={lastCapture}
            onTryAgain={handleResetToCamera}
            onChangeSide={handleResetToSideSelection}
          />
        );
      default:
        return <SideSelector onSelect={handleSideSelect} />;
    }
  };

  return (
    <main className="h-screen w-screen bg-gray-900 text-white font-sans overflow-hidden">
      <div className="relative h-full w-full">
          {renderContent()}
      </div>
    </main>
  );
};

// --- Child Components ---

interface SideSelectorProps {
  onSelect: (side: PlayerSide) => void;
}

const SideSelector: React.FC<SideSelectorProps> = ({ onSelect }) => (
    <div className="flex flex-col items-center justify-center h-full bg-gray-800 p-4">
        <SparklesIcon className="w-16 h-16 text-yellow-400 mb-4"/>
        <h1 className="text-4xl font-bold text-center mb-2">Chess Vision AI</h1>
        <p className="text-lg text-gray-300 mb-12 text-center">Get the best move, powered by Gemini.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
            <button onClick={() => onSelect(PlayerSide.White)} className="group bg-gray-100 text-gray-900 p-8 rounded-lg shadow-lg hover:bg-white transition-transform transform hover:scale-105">
                <WhitePawnIcon className="w-24 h-24 mx-auto mb-4"/>
                <span className="text-2xl font-semibold">I'm Playing White</span>
            </button>
            <button onClick={() => onSelect(PlayerSide.Black)} className="group bg-gray-700 text-white p-8 rounded-lg shadow-lg hover:bg-gray-600 transition-transform transform hover:scale-105">
                <BlackPawnIcon className="w-24 h-24 mx-auto mb-4"/>
                <span className="text-2xl font-semibold">I'm Playing Black</span>
            </button>
        </div>
    </div>
);


interface CameraViewProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  isLoading: boolean;
  onCapture: () => void;
  onBack: () => void;
  stopCamera: () => void;
}

const CameraView: React.FC<CameraViewProps> = ({ videoRef, canvasRef, isLoading, onCapture, onBack, stopCamera }) => {
    
    useEffect(() => {
        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ 
                    video: { facingMode: "environment" } 
                });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    (streamRef as React.MutableRefObject<MediaStream | null>).current = stream;
                }
            } catch (err) {
                console.error("Error accessing camera:", err);
                alert("Could not access the camera. Please check permissions.");
            }
        };
        startCamera();
        
        return () => {
            stopCamera();
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [videoRef, stopCamera]);
    
    const streamRef = useRef<MediaStream | null>(null);

    return (
        <div className="relative h-full w-full bg-black">
            <video ref={videoRef} autoPlay playsInline className="h-full w-full object-cover"></video>
            <canvas ref={canvasRef} className="hidden"></canvas>

            {/* Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-between p-6">
                <div className="w-full flex justify-start">
                    <button onClick={onBack} className="bg-black/50 p-3 rounded-full text-white hover:bg-black/75 transition">
                        <ArrowLeftIcon className="w-6 h-6"/>
                    </button>
                </div>

                <div className="flex-grow flex items-center justify-center w-full px-4">
                    <div className="w-full max-w-md aspect-square border-4 border-dashed border-white/50 rounded-lg"></div>
                </div>

                <div className="w-full flex flex-col items-center">
                    <p className="text-white text-lg font-medium bg-black/50 px-4 py-2 rounded-full mb-4">Align the board in the frame</p>
                    <button onClick={onCapture} disabled={isLoading} className="w-20 h-20 rounded-full bg-white flex items-center justify-center disabled:bg-gray-400 ring-4 ring-white/50 ring-offset-4 ring-offset-black/50 transition transform active:scale-90">
                        {isLoading ? (
                             <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-gray-900"></div>
                        ) : (
                            <CameraIcon className="w-10 h-10 text-gray-900"/>
                        )}
                    </button>
                </div>
            </div>
            {isLoading && (
                <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-10">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white mb-4"></div>
                    <p className="text-xl font-semibold">Analyzing board...</p>
                </div>
            )}
        </div>
    );
};


interface ResultViewProps {
    move: string;
    explanation: string;
    backgroundImage: string | null;
    onScanAgain: () => void;
    onChangeSide: () => void;
}

const ResultView: React.FC<ResultViewProps> = ({ move, explanation, backgroundImage, onScanAgain, onChangeSide }) => {
    const fromSquare = move.substring(0, 2).toUpperCase();
    const toSquare = move.substring(2, 4).toUpperCase();

    return (
        <div className="relative h-full w-full flex items-center justify-center p-4">
            {backgroundImage && <img src={backgroundImage} alt="Captured chessboard" className="absolute inset-0 w-full h-full object-cover filter blur-md brightness-50" />}
            <div className="relative bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-w-lg w-full text-center border border-gray-600">
                <h2 className="text-2xl font-bold text-green-400 mb-4">Best Move Found!</h2>
                <div className="bg-gray-900 rounded-lg p-6 mb-6">
                    <p className="text-xl text-gray-300 mb-2">Move from <span className="font-mono bg-gray-700 px-2 py-1 rounded">{fromSquare}</span> to <span className="font-mono bg-gray-700 px-2 py-1 rounded">{toSquare}</span></p>
                    <p className="text-6xl font-black tracking-widest text-white">{fromSquare}<span className="text-green-400 mx-2">→</span>{toSquare}</p>
                </div>
                <div className="text-left bg-gray-900/50 p-4 rounded-lg">
                    <p className="text-lg font-semibold text-gray-200 mb-2">Explanation:</p>
                    <p className="text-gray-300">{explanation}</p>
                </div>
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                    <button onClick={onScanAgain} className="bg-green-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-600 transition w-full sm:w-auto">Scan Again</button>
                    <button onClick={onChangeSide} className="bg-gray-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-700 transition w-full sm:w-auto">Change Side</button>
                </div>
            </div>
        </div>
    );
};

interface ErrorViewProps {
    error: string | null;
    backgroundImage: string | null;
    onTryAgain: () => void;
    onChangeSide: () => void;
}

const ErrorView: React.FC<ErrorViewProps> = ({ error, backgroundImage, onTryAgain, onChangeSide }) => (
    <div className="relative h-full w-full flex items-center justify-center p-4">
        {backgroundImage && <img src={backgroundImage} alt="Captured chessboard" className="absolute inset-0 w-full h-full object-cover filter blur-md brightness-50" />}
        <div className="relative bg-red-900/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-w-lg w-full text-center border border-red-700">
            <h2 className="text-2xl font-bold text-red-300 mb-4">An Error Occurred</h2>
            <p className="text-red-200 bg-red-800/50 p-4 rounded-lg mb-6">
                {error || "Could not analyze the board. Please try again."}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={onTryAgain} className="bg-yellow-500 text-black font-bold py-3 px-6 rounded-lg hover:bg-yellow-600 transition w-full sm:w-auto">Try Again</button>
                <button onClick={onChangeSide} className="bg-gray-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-700 transition w-full sm:w-auto">Change Side</button>
            </div>
        </div>
    </div>
);


export default App;