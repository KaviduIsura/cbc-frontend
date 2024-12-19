import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ProductCard from './components/productCard'
import Testing from './components/testing'
import LoginPage from './pages/login'
import HomePage from './pages/home'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
      <Routes path ="/*">
        <Route path='/' element={<HomePage/>}></Route>
        <Route path='/login' element={<LoginPage/>}></Route>
        <Route path='/*' element={<h1>404 Error</h1>}></Route>
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
