import React from 'react'
import ReactDOM from 'react-dom/client'
import Navbar from './components/Navbar'
import Showcase from './components/Showcase'
import Form from './components/Form'
import './index.css' 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Navbar />
    <Showcase />
    <Form />
  </React.StrictMode>,
)

export default function App() {
  return (
    <div className="min-h-screen w-full font-sans bg-black">
      <Navbar />
      <Showcase />
      <Form />
    </div>
  );
}