import { apiClient } from '../api';
import PdfUploader from '../components/PdfUploader'
import { useState } from 'react';

export default function Upload() {
    const [uploadingFiles, setUploadingFiles] = useState<Set<string>>(new Set());
    const handleFileUpload = async (files: File[]) => {        
        
        // Add files to uploading state
        const fileNames = files.map(file => file.name);
        setUploadingFiles(prev => new Set([...prev, ...fileNames]));
            
        try {
            await apiClient.uploadFiles(files);            
            
            // Trigger refresh of uploaded files list
            if (onUploadComplete) {
            onUploadComplete();
            }
        } catch (error) {
            console.error('Upload failed:', error);
        } finally {
            // Remove files from uploading state
            setUploadingFiles(prev => {
            const newSet = new Set(prev);
            fileNames.forEach(name => newSet.delete(name));
            return newSet;
            });
        }
    };
    
    const onUploadComplete = () => {
        // This will be passed to PdfUploader to refresh the uploaded files list
        console.log('Upload completed, refreshing file list...');
    };
    
  return (
    <main className="flex-grow py-8 flex flex-col items-center px-4" role="main" aria-label="PDF upload interface">                    
        <PdfUploader 
            onFileUpload={handleFileUpload} 
            uploadingFiles={uploadingFiles} 
            onUploadComplete={onUploadComplete}
            aria-labelledby="upload-title"
        />        
    </main>
  )
}