import React from 'react'
import Google from './Components/Google/index.jsx'
import AuthSuccess from './Components/Auth/Success.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
const App = () => {
  return (
    <div>
      <BrowserRouter>
      <Routes>
        {/* other routes */}
        <Route path="/" element={ <Google />} />
        <Route path="auth/success" element={<AuthSuccess />} />
      </Routes>
    </BrowserRouter>
    </div>
  )
}

export default App
