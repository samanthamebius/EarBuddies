import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import LogInPage from './LogInPage';
import HomePage from './HomePage';
import PageLayout from './PageLayout';
import ProfilePage from './ProfilePage';
import StudioPage from './StudioPage';

const code = new URLSearchParams(window.location.search).get("code")

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* check if user is already logged in, if not redirect to login page */}
        <Route path='login' element={<LogInPage/>}/>
        <Route path='/' element={<PageLayout/>}>
          <Route index element={<HomePage />} />
          <Route path='profile' element={<ProfilePage/>}/>
          <Route path='studio' element={<StudioPage/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
