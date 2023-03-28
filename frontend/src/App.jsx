import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LogInPage from './LogInPage';
import HomePage from './HomePage';
import './App.css'

const code = new URLSearchParams(window.location.search).get("code")

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {console.log(code)}
        <Route path="/" element={ code ? <HomePage code={code}/> : <LogInPage/> } />
        {/* <Route path="/" element={<LogInPage/>}/>
        <Route path="/home" element={<HomePage code={code}/>}/> */}
      </Routes>
    </BrowserRouter>
  )
}

export default App
