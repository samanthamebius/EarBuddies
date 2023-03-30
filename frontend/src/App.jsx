import { useState } from 'react'
import './App.css'
import PageLayout from './PageLayout';
import HomePage from './HomePage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<PageLayout/>}>
          <Route index element={<HomePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
