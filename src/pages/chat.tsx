import ChatPanel from '../components/ChatPanel'
import { useNavigate } from 'react-router-dom';
import UploadedFileList from '../components/UploadedFileList';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { apiClient } from '../api';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { setIsLoading } from '../store/chatSession';

export default function Chat() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [uploadedFiles, setUploadedFiles] = useState<{files: {id: string, filename: string, size: number}[], total_files: number}>({files: [], total_files: 0});
    const isLoading = useSelector((state: RootState) => state.chatSession.isLoading);
    
    useEffect(() => {
        const fetchUploadedFiles = async () => {
            try {
                dispatch(setIsLoading(true));
                const res = await apiClient.getUploadedFiles();
                setUploadedFiles(res);
            } catch (error) {
                console.error('Failed to fetch uploaded files:', error);
            } finally {
                dispatch(setIsLoading(false));
            }
        }
        fetchUploadedFiles();
    }, []);
    
    return (
        <main className="container mx-auto flex-grow py-8 flex flex-col items-center px-4" role="main" aria-label="Chat interface">
           <div className="mx-auto mb-4 text-right flex justify-start w-full">
            <button 
                className="text-primary dark:text-white dark:hover:text-secondary-500 rounded-md flex flex-row gap-2 items-center justify-center mb-10 transition-colors" 
                onClick={() => navigate('/')}
                aria-label="Navigate back to upload page"
            >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                Back to Upload
            </button>
           </div>           
           <div className="flex flex-col sm:flex-row items-start gap-4 w-full">
            <aside className="w-full sm:w-1/2" role="complementary" aria-label="Uploaded files">
                <UploadedFileList uploadedFiles={uploadedFiles} isLoading={isLoading} />           
            </aside>
            <div className="w-full h-px bg-gray-200 dark:bg-gray-800 my-4 sm:my-0 sm:hidden" role="separator" aria-hidden="true"></div>
            <section className="w-full" role="region" aria-label="Chat conversation">
                <ChatPanel />
            </section>
           </div>
        </main>
    )
}