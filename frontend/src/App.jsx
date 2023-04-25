import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import LogInPage from './login/LogInPage';
import HomePage from './home/HomePage';
import PageLayout from './PageLayout';
import ProfilePage from './profile/ProfilePage';
import StudioPage from './studio/StudioPage';

const code = new URLSearchParams(window.location.search).get("code")

document.body.style.overflow = "hidden";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* check if user is already logged in, if not redirect to login page */}
        <Route path='login' element={<LogInPage />} />
        <Route path='/' element={<PageLayout />}>
          <Route index element={<HomePage />} />
          <Route path='profile' element={<ProfilePage />} />
          <Route path='studio' element={<StudioPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
