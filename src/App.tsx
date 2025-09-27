import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import Landing from './pages/Landing'
import Login from './pages/Login'

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element = {<Landing />}/>
          <Route path="/login" element = {<Login />}/>
        </Routes>
      </Router>
    </div>
  )
}



export default App

