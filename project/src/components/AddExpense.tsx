import React, { useState, useRef } from 'react';
import { X, Camera, Mic, ChevronDown, Upload, Loader } from 'lucide-react';
import { createWorker } from 'tesseract.js';

interface AddExpenseProps {
  onClose: () => void;
  currency: { code: string; symbol: string; name: string };
}

const categories = [
  { id: '1', name: 'Food & Drinks', icon: '🍔' },
  { id: '2', name: 'Shopping', icon: '🛍️' },
  { id: '3', name: 'Transport', icon: '🚗' },
  { id: '4', name: 'Bills', icon: '📃' },
  { id: '5', name: 'Entertainment', icon: '🎮' },
  { id: '6', name: 'Healthcare', icon: '🏥' },
];

export function AddExpense({ onClose, currency }: AddExpenseProps) {
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [note, setNote] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [receipt, setReceipt] = useState<string | null>(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [extractedText, setExtractedText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setNote(transcript);
        setIsRecording(false);
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
    } else {
      alert('Voice input is not supported in your browser');
    }
  };

  const processImage = async (imageData: string) => {
    setIsProcessingImage(true);
    try {
      const worker = await createWorker();
      await worker.loadLanguage('eng');
      await worker.initialize('eng');
      const { data: { text } } = await worker.recognize(imageData);
      await worker.terminate();

      // Try to extract amount from the text
      const amountMatch = text.match(/\$?\d+\.\d{2}/);
      if (amountMatch) {
        const extractedAmount = amountMatch[0].replace('$', '');
        setAmount(extractedAmount);
      }

      setExtractedText(text);
      setNote(text.split('\n').slice(0, 2).join(' ')); // Use first two lines as note
    } catch (error) {
      console.error('OCR Error:', error);
      alert('Error processing image. Please try again.');
    }
    setIsProcessingImage(false);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result as string;
        setReceipt(imageData);
        processImage(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = async () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end animate-fade-in">
      <div className="bg-white rounded-t-3xl w-full max-w-md mx-auto p-6 animate-slide-up">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Add Expense</h2>
          <button onClick={onClose} className="p-2">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Amount Input */}
        <div className="mb-6">
          <label className="block text-sm text-gray-600 mb-2">Amount</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-semibold">
              {currency.symbol}
            </span>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
              className="w-full bg-gray-50 rounded-xl py-4 px-12 text-2xl font-bold"
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Category Selector */}
        <div className="mb-6">
          <label className="block text-sm text-gray-600 mb-2">Category</label>
          <div className="grid grid-cols-3 gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category)}
                className={`p-4 rounded-xl flex flex-col items-center ${
                  selectedCategory.id === category.id
                    ? 'bg-indigo-100 text-indigo-600'
                    : 'bg-gray-50'
                }`}
              >
                <span className="text-2xl mb-1">{category.icon}</span>
                <span className="text-xs font-medium">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Note Input with Voice */}
        <div className="mb-6">
          <label className="block text-sm text-gray-600 mb-2">Note</label>
          <div className="relative">
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-gray-50 rounded-xl py-3 px-4 pr-12"
              placeholder="Add note"
            />
            <button
              onClick={handleVoiceInput}
              className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg ${
                isRecording ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
              }`}
            >
              <Mic className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Receipt Upload */}
        <div className="mb-6">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />
          <input
            type="file"
            ref={cameraInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            capture="environment"
            className="hidden"
          />
          
          {receipt ? (
            <div className="relative">
              <img
                src={receipt}
                alt="Receipt"
                className="w-full h-48 object-cover rounded-xl"
              />
              <button
                onClick={() => {
                  setReceipt(null);
                  setExtractedText('');
                }}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
              {isProcessingImage && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-xl flex items-center justify-center">
                  <div className="text-white text-center">
                    <Loader className="w-8 h-8 animate-spin mx-auto mb-2" />
                    <p>Processing Receipt...</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleCameraCapture}
                className="bg-gray-50 rounded-xl py-3 flex items-center justify-center space-x-2"
              >
                <Camera className="w-5 h-5" />
                <span>Take Photo</span>
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-gray-50 rounded-xl py-3 flex items-center justify-center space-x-2"
              >
                <Upload className="w-5 h-5" />
                <span>Upload File</span>
              </button>
            </div>
          )}

          {extractedText && !isProcessingImage && (
            <div className="mt-4 p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-600 font-medium mb-2">Extracted Information:</p>
              <p className="text-sm text-gray-800 whitespace-pre-line">
                {extractedText.split('\n').slice(0, 3).join('\n')}...
              </p>
            </div>
          )}
        </div>

        {/* Save Button */}
        <button
          onClick={onClose}
          className="w-full bg-indigo-600 text-white rounded-xl py-4 font-semibold"
        >
          Save Expense
        </button>
      </div>
    </div>
  );
}