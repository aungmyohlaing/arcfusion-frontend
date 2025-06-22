import PdfUploader from './PdfUploader';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import { BrowserRouter } from 'react-router-dom';

export default {
  title: 'Demo/PdfUploader',
  component: PdfUploader,
};

export const Default = () => (
    <Provider store={store}>
        <BrowserRouter>
            <PdfUploader />
        </BrowserRouter>
    </Provider>
);