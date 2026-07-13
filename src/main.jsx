// Safe DOM patches to prevent React crashing when Google Translate dynamically modifies text/HTML nodes
if (typeof window !== 'undefined') {
  const originalInsertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function(newNode, referenceNode) {
    if (referenceNode && referenceNode.parentNode !== this) {
      console.warn("insertBefore: referenceNode is not a child of this node. Skipping.");
      return newNode;
    }
    return originalInsertBefore.call(this, newNode, referenceNode);
  };

  const originalRemoveChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function(child) {
    if (child.parentNode !== this) {
      console.warn("removeChild: child is not a child of this node. Skipping.");
      return child;
    }
    return originalRemoveChild.call(this, child);
  };
}

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('SW registered:', reg.scope))
      .catch(err => console.error('SW registration failed:', err));
  });
}
