import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LogInPage from './LogInPage';
import HomePage from './HomePage';
import './App.css'
import PageLayout from './PageLayout';
import HomePage from './HomePage';
import ProfilePage from './ProfilePage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const code = new URLSearchParams(window.location.search).get("code")

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* check if user is already logged in, if not redirect to login page */}
        {/* <Route path="/" element={ code ? <HomePage code={code}/> : <LogInPage/> } /> */}
        <Route path='/' element={<PageLayout/>}>
          <Route index element={<HomePage />} />
          <Route path='profile' element={<ProfilePage/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
