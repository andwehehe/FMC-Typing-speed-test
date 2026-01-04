import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './global-styles/variables.css'
import './global-styles/global.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.jsx'
import ErrorPage from './Pages/ErrorPage/ErrorPage.jsx';
import StatsContextProvider from './Features/TextField/StatsContext.jsx'

const router = createBrowserRouter([
  {
    path: '/FMC-Typing-speed-test/',
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: '*',
    element: <ErrorPage />
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StatsContextProvider>
      <RouterProvider router={router} />
    </StatsContextProvider>
  </StrictMode>,
)
