import { BrowserRouter, Routes, Route } from 'react-router';
import './App.module.css';
import MainLayout from '../MainLayout/MainLayout';
import LoginLayout from '../LoginLayout/LoginLayout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path='/' />
          <Route path='browse' />
        </Route>
        <Route element={<LoginLayout />}>
          <Route path='login' />
          <Route path='signup' />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
