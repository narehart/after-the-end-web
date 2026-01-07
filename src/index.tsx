// Initialize ECS before any other imports to ensure world is populated before store
import './ecs/systems/initializeInventorySystem';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './ui/App';
import { setTauriWindowConstraints } from './utils/setTauriWindowConstraints';

// Set Tauri window constraints (min size) - fire and forget
void setTauriWindowConstraints();

const rootElement = document.getElementById('root');
if (rootElement === null) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
