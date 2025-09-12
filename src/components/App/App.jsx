import { BrowserRouter, Routes, Route } from 'react-router';
import './App.module.css';
import MainLayout from '../MainLayout/MainLayout';
import LoginLayout from '../LoginLayout/LoginLayout';
import Login from '../Login/Login';
import Register from '../Register/Register';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path='/' />
          <Route path='browse' />
        </Route>
        <Route element={<LoginLayout />}>
          <Route path='login' element={<Login />}/>
          <Route path='register' element={<Register />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
