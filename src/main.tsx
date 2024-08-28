import ReactDOM from 'react-dom/client'
import { WebSocketProvider } from './context/WebSocketContext';
import System from './components/System';
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <WebSocketProvider>
    <System />
  </WebSocketProvider>
)
