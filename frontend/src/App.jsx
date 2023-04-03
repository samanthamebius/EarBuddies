import './App.css'
import PageLayout from './PageLayout';
import HomePage from './HomePage';
import ProfilePage from './ProfilePage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<PageLayout/>}>
          <Route index element={<HomePage />} />
          <Route path='profile' element={<ProfilePage/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
