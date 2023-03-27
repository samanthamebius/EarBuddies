import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LogInPage from './LogInPage';
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LogInPage/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
