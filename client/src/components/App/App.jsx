import { BrowserRouter, Routes, Route } from 'react-router';
import styles from './App.module.css';
import { LoadingProvider } from '../Providers/LoadingProvider';
import { AuthProvider } from '../Providers/AuthProvider';
import { ErrorProvider } from '../Providers/ErrorProvider';
import { IconContext } from 'react-icons';
import MainLayout from '../MainLayout/MainLayout';
import LoginLayout from '../LoginLayout/LoginLayout';
import Home from '../Home/Home';
import Login from '../Login/Login';
import Register from '../Register/Register';
import MoviePage from '../MoviePage/MoviePage';
import Search from '../Search/Search';
import Discover from '../Discover/Discover';
import Collections from '../Collections/Collections';

function App() {
  return (
    <BrowserRouter>
      <LoadingProvider>
        <ErrorProvider>
          <AuthProvider>
            <IconContext.Provider value = {{className: styles.icon}}>
              <Routes>
                <Route element={<MainLayout />}>
                  <Route index element={<Home />}/>
                  <Route path='/movie/:id' element={<MoviePage />}/>
                  <Route path='/search' element={<Search />}/>
                  <Route path='/discover' element={<Discover />}/>
                  <Route path='/collections' element={<Collections />}/>
                </Route>
                <Route element={<LoginLayout />}>
                  <Route path='/login' element={<Login />}/>
                  <Route path='/register' element={<Register />}/>
                </Route>
              </Routes>
            </IconContext.Provider>
          </AuthProvider>
        </ErrorProvider>
      </LoadingProvider>
    </BrowserRouter>
  );
}

export default App;
