import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './global-styles/variables.css';
import './global-styles/global.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx'
import ErrorPage from './Pages/ErrorPage/ErrorPage.jsx';
import PostTestPage from './Pages/PostTestPage/PostTestPage.jsx';
import StatsContextProvider from './Features/TextField/StatsContext.jsx';
import ModeContextProvider, { ModeContext } from './Features/StatsField/ModeContext.jsx';

const router = createBrowserRouter([
  {
    path: '/FMC-Typing-speed-test/',
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/FMC-Typing-speed-test/Score',
    element: <PostTestPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: '*',
    element: <ErrorPage />
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ModeContextProvider>
      <StatsContextProvider>
        <RouterProvider router={router} />
      </StatsContextProvider>
    </ModeContextProvider>
  </StrictMode>,
)
