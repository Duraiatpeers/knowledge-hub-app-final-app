/**
 * main.tsx - application entry point.
 *
 * Wrapping order (outside -> in):
 *   <Provider store>   makes the Redux store available to every component
 *   <BrowserRouter>    enables routing (useNavigate, <Routes>, ...)
 *   <App />
 *
 * <Provider> replaces the old <ArticlesProvider> that App used to render.
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store/store'
import './index.css'
import './app-extra.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>
)
