import { File } from 'lucide-react';

// Uploaded file list component
interface UploadedFileListProps {
    uploadedFiles: {id: string, filename: string, size: number}[];    
    isLoading: boolean;
}

// Uploaded file list component
export default function UploadedFileList(props: UploadedFileListProps) {
    
    const { uploadedFiles, isLoading } = props;

    return (
        <div role="region" aria-label="Uploaded files list" >
            <h3 className="text-lg font-medium mb-4">Uploaded Files</h3>
            <div className="space-y-2 pr-2" role="list" aria-label="List of uploaded files">        
            {isLoading ? (
                <div className="flex flex-row items-center justify-center mt-4 overflow-hidden" role="status" aria-live="polite" aria-label="Loading uploaded files">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2" aria-hidden="true"></div>
                    <span className="text-sm">Loading...</span>
                </div>
            ) : uploadedFiles.length === 0 ? (
                <div className="text-gray-400 text-center mt-4" role="status" aria-live="polite">
                    No files uploaded yet
                </div>
            ) : (
                uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-lg mb-2" role="listitem">
                    <div className="flex items-center space-x-3 space-y-2">
                        <File className="w-8 h-8 text-red-500" aria-hidden="true" />
                        <div className="text-left">
                        <p className="text-sm font-medium">{file.filename}</p>
                        <p className="text-xs text-gray-500">
                            {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                        </div>
                    </div>
                </div>            
                ))
            )}
            </div>
        </div>
    )
}