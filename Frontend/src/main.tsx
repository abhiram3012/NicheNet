import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { applyTheme } from './utils/theme';

// Apply theme before rendering
applyTheme();

createRoot(document.getElementById("root")!).render(<App />);
