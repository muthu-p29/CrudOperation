import { useState } from 'react'
import GetUser from './components/GetUser'
import GetUserById from './components/GetUserById'
import PostUser from './components/PostUser'
import './App.css'
import Home from './components/Home.jsx';

import { BrowserRouter,Routes,Route } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/postUser" element={<PostUser />} />
        <Route path="/getuserById" element={<GetUserById />} />
         <Route path="/getuser" element={<GetUser />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App
