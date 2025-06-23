import type { Meta, StoryObj } from '@storybook/react';
import UploadedFileList from './UploadedFileList';

const meta: Meta<typeof UploadedFileList> = {
    title: 'Demo/UploadedFileList',
    component: UploadedFileList,
};

export default meta;

type Story = StoryObj<typeof UploadedFileList>;

export const Default: Story = {
    args: {
        uploadedFiles: {
            files: [
                { id: '1', filename: 'test.pdf', size: 100000 },
            ],
            total_files: 1,
        },
        isLoading: false,
    },
};