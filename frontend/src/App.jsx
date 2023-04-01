import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LogInPage from './LogInPage';
import HomePage from './HomePage';
import './App.css'

const code = new URLSearchParams(window.location.search).get("code")

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {console.log("code" + code)}
        {/* check if user is already logged in, if not redirect to login page */}
        <Route path="/" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
