// Point d'entrée de l'application React.
// BrowserRouter active la navigation par URL (React Router).
// StrictMode détecte les problèmes potentiels en développement (double rendu intentionnel).
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './assets/styles/index.css'
import App from './App.jsx'

// Monte le composant racine dans la div#root du fichier index.html
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
