import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/SignUp'
import Profile from './pages/Profile'
import VerifyCode from './pages/VerifyCode'

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element = {<Landing />}/>
          <Route path="/login" element = {<Login />}/>
          <Route path="/signup" element = {<Signup />}/>
          <Route path="/profile" element={<Profile />}/>
          <Route path="/verify" element={<VerifyCode/>}/>
        </Routes>
      </Router>
    </div>
  )
}



export default App

