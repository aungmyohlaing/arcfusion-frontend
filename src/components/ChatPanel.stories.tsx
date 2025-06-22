import { Provider } from 'react-redux';
import { store } from '../store/store';
import ChatPanel from './ChatPanel';

export default {
  title: 'Demo/ChatPanel',
  component: ChatPanel,
};

export const Default = () => (
    <Provider store={store}>
        <ChatPanel />
    </Provider>
);
