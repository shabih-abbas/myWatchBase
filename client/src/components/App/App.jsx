import { BrowserRouter, Routes, Route } from 'react-router';
import './App.module.css';
import { LoadingProvider } from '../Providers/LoadingProvider';
import { AuthProvider } from '../Providers/AuthProvider';
import { ErrorProvider } from '../Providers/ErrorProvider';
import MainLayout from '../MainLayout/MainLayout';
import LoginLayout from '../LoginLayout/LoginLayout';
import Home from '../Home/Home';
import Login from '../Login/Login';
import Register from '../Register/Register';
import MoviePage from '../MoviePage/MoviePage';

function App() {
  return (
    <BrowserRouter>
      <LoadingProvider>
        <ErrorProvider>
          <AuthProvider>
            <Routes>
              <Route element={<MainLayout />}>
                <Route index element={<Home />}/>
                <Route path='/movie/:id' element={<MoviePage />}/>
                <Route path='browse' />
              </Route>
              <Route element={<LoginLayout />}>
                <Route path='/login' element={<Login />}/>
                <Route path='/register' element={<Register />}/>
              </Route>
            </Routes>
          </AuthProvider>
        </ErrorProvider>
      </LoadingProvider>
    </BrowserRouter>
  );
}

export default App;
