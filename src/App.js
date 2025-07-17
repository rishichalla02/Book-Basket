import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './component/login/Login';
import Dashboard from './screen/dashboard/Dashboard';
import Home from './screen/user/Home';
import InputBook from './screen/form/InputForm';
import Cart from './screen/cart/Cart';
import Card from './component/card/Card';
import { ToastContainer } from 'react-toastify';
import History from './screen/history/History';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/bookform" element={<InputBook />} />
        <Route path="/home" element={<Home />} />
        <Route path="/card" element={<Card />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/history" element={<History />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={1000} />
    </Router>
  );
}

export default App;