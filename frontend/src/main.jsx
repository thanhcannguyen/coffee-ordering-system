
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* AuthProvider bọc toàn app để mọi component dùng được useAuth() */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)