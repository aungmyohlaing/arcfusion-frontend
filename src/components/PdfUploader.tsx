import React, { useState, useRef, useEffect } from 'react';
import { apiClient } from '../api'
import { useNavigate } from 'react-router-dom';
import UploadedFileList from './UploadedFileList';
import { File, MessageCircle, Trash2 } from 'lucide-react';
import { setChatId, setIsLoading } from '../store/chatSession';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store/store';

interface PdfUploaderProps {
  onFileUpload?: (files: File[]) => void;
  maxSizeMB?: number;
  uploadingFiles?: Set<string>;
  onUploadComplete?: () => void;
}

interface ChatSessionInfo {
  hasMessages: boolean;
  lastMessageTime: Date | null;
  messageCount: number;
}

const PdfUploader: React.FC<PdfUploaderProps> = ({ 
  onFileUpload, 
  maxSizeMB = 2,
  uploadingFiles = new Set(),
  onUploadComplete
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [chatSessionInfo, setChatSessionInfo] = useState<ChatSessionInfo>({
    hasMessages: false,
    lastMessageTime: null,
    messageCount: 0
  });
  const navigate = useNavigate();

  // Redux state
  const dispatch = useDispatch();
  const chatId = useSelector((state: RootState) => state.chatSession.chatId);
  const isLoading = useSelector((state: RootState) => state.chatSession.isLoading);

  const formatLastMessageTime = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) {
      return 'Just now';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} min ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };

  const checkExistingChatSession = async () => {
    if (!chatId) {
      setChatSessionInfo({
        hasMessages: false,
        lastMessageTime: null,
        messageCount: 0
      });
      return;
    }

    try {
      const response = await apiClient.getChatHistory(chatId);
      const messages = response.messages || [];
      const hasMessages = messages.length > 0;
      
      let lastMessageTime: Date | null = null;
      if (hasMessages && messages.length > 0) {
        // Get the last message timestamp
        const lastMessage = messages[messages.length - 1];
        if (lastMessage.timestamp) {
          const timestampStr = lastMessage.timestamp.toString();
          const timestampWithZ = timestampStr.endsWith('Z') ? timestampStr : timestampStr + 'Z';
          lastMessageTime = new Date(timestampWithZ);
        }
      }

      setChatSessionInfo({
        hasMessages,
        lastMessageTime,
        messageCount: messages.length
      });
    } catch (error) {
      console.error('Error checking chat session:', error);
      setChatSessionInfo({
        hasMessages: false,
        lastMessageTime: null,
        messageCount: 0
      });
    }
  };

  const fetchUploadedFiles = async () => {
    try {
      dispatch(setIsLoading(true));
      const response = await apiClient.getUploadedFiles();
      setUploadedFiles(response.files);
    } catch (error) {
      console.error('Failed to fetch uploaded files:', error);
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  useEffect(() => {
    fetchUploadedFiles();
    checkExistingChatSession();
  }, []);

  // Check chat session when chatSessionId changes
  useEffect(() => {
    checkExistingChatSession();
  }, [chatId]);

  // Refresh uploaded files when upload completes
  useEffect(() => {
    if (uploadingFiles.size === 0 && onUploadComplete) {
      fetchUploadedFiles();
    }
  }, [uploadingFiles.size, onUploadComplete]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set dragging to false if we're leaving the drop zone entirely
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  };

  const validateFile = (file: File): boolean => {
    if (file.type !== 'application/pdf') {
      setError('Please upload PDF files only');
      return false;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size should be less than ${maxSizeMB}MB`);
      return false;
    }

    setError('');
    return true;
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const validFiles = files.filter(file => validateFile(file));    
    if (validFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...validFiles]);
      onFileUpload?.(validFiles);
    } else {
      setError('No valid PDF files found');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => validateFile(file));
    
    if (validFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...validFiles]);
      onFileUpload?.(validFiles);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setError('');
  };

  const removeAllFiles = () => {
    setSelectedFiles([]);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleStartChat = async () => {
    if (selectedFiles.length > 0 || uploadedFiles.length > 0) {
      let response;      
      if (!chatId) {        
        response = await apiClient.startChat();              
      } else {
        response = {chat_id: chatId};
      }      
      dispatch(setChatId(response.chat_id));
      navigate('/chat');
    } else {
      setError('Please upload at least one PDF file');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto shadow-lg dark:shadow-gray-800 rounded-lg p-8" role="region" aria-label="Upload form">
      <h1 className="text-xl font-semibold mb-4" id="upload-title">PDF Upload</h1>
      <div className="w-full max-w-xl mx-auto" role="region" aria-label="PDF file upload">
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
            isDragging ? 'border-blue-500 bg-blue-50 scale-105' : 'border-gray-300 hover:border-gray-400'
          } ${error ? 'border-red-500' : ''}`}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          role="button"
          tabIndex={0}
          aria-label="Drop zone for PDF files"
          aria-describedby="drop-instructions"
          aria-invalid={error ? "true" : "false"}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleButtonClick();
            }
          }}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept=".pdf"
            multiple
            className="hidden"
            aria-label="Select PDF files"
            aria-describedby="file-input-description"
          />

          {selectedFiles.length === 0 ? (
            <div className="space-y-4">
              <div className="flex flex-col items-center">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <p className="mt-2 text-sm text-gray-600" id="drop-instructions">
                  Drag and drop your PDF files here (multiple files supported), or{' '}
                  <button
                    type="button"
                    onClick={handleButtonClick}
                    className="text-blue-500 hover:text-blue-600 font-medium"
                    aria-label="Browse for PDF files"
                  >
                    browse
                  </button>
                </p>
                <p className="text-xs text-gray-500 mt-1" id="file-input-description">
                  Maximum file size: {maxSizeMB}MB per file • Multiple files allowed
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Selected Files</h3>
                <button
                  onClick={removeAllFiles}
                  className="text-sm text-red-500 hover:text-red-600"
                  aria-label="Remove all selected files"
                >
                  Remove All
                </button>
              </div>
              <div className="space-y-2" role="list" aria-label="Selected files">
                {selectedFiles.map((file, index) => {
                  const isUploading = uploadingFiles.has(file.name);
                  return (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg" role="listitem">
                      <div className="flex items-center space-x-3">
                        <File className="w-8 h-8 text-red-500" aria-hidden="true" />
                        <div className="text-left">
                          <p className="text-sm font-medium text-gray-900">{file.name}</p>
                          <p className="text-xs text-gray-500">
                            {(file.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                          {isUploading && (
                            <div className="mt-1" role="status" aria-live="polite" aria-label={`Uploading ${file.name}`}>
                              <div className="flex items-center space-x-2">
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-500" aria-hidden="true"></div>
                                <span className="text-xs text-blue-500">Uploading...</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1 mt-1" role="progressbar" aria-valuenow={60} aria-valuemin={0} aria-valuemax={100}>
                                <div className="bg-blue-500 h-1 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      {!isUploading && (
                        <button
                          onClick={() => removeFile(index)}
                          className="text-gray-400 hover:text-gray-500"
                          aria-label={`Remove ${file.name}`}
                        >
                          <Trash2 className="w-4 h-4" aria-hidden="true" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
              <button
                type="button"
                onClick={handleButtonClick}
                className="mt-4 text-sm text-blue-500 hover:text-blue-600 font-medium"
                aria-label="Add more PDF files"
              >
                Add More Files
              </button>
            </div>
          )}

          {error && (
            <p className="mt-2 text-sm text-red-500" role="alert" aria-live="assertive">{error}</p>
          )}
        </div>
        <div className="mt-4" style={{ display: uploadedFiles.length > 0 ? 'block' : 'none' }} role="region" aria-label="Previously uploaded files">        
          <div className="space-y-2 max-h-72 overflow-y-auto pr-2 mt-10">
            <UploadedFileList uploadedFiles={uploadedFiles} isLoading={isLoading} />
          </div>
        </div>
        <div className="w-full max-w-md mx-auto mt-10" style={{ display: uploadedFiles.length > 0 ? 'block' : 'none' }} role="region" aria-label="Chat session controls">
          {chatSessionInfo.hasMessages && (
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-800 rounded-lg" role="status" aria-live="polite">
              <div className="flex items-center justify-between text-sm">
                <span className="text-blue-700 dark:text-blue-300 font-medium">
                  Existing chat session found
                </span>
                <span className="text-blue-600 dark:text-blue-400">
                  {chatSessionInfo.messageCount} message{chatSessionInfo.messageCount !== 1 ? 's' : ''}
                </span>
              </div>
              {chatSessionInfo.lastMessageTime && (
                <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  Last message: {formatLastMessageTime(chatSessionInfo.lastMessageTime)}
                </div>
              )}
            </div>
          )}
          <button 
              className="bg-primary text-white dark:bg-primary-dark px-4 py-2 rounded-md w-full flex flex-row gap-2 items-center justify-center hover:bg-primary-600 dark:hover:bg-primary-500 transition-colors" 
              onClick={handleStartChat}
              aria-label={chatSessionInfo.hasMessages ? 'Continue existing chat session' : 'Start new chat session'}
          >
              <MessageCircle className="w-4 h-4" aria-hidden="true" />
              {chatSessionInfo.hasMessages ? 'Continue Chat' : 'Start Chat'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PdfUploader; 