import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ProductCard from './components/productCard'
import Testing from './components/testing'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Testing/>
    </>
  )
}

export default App
