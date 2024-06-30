import { Routes, Route } from 'react-router-dom';
import './App.css'
import Homepage from '../pages/home';
import Login from '../pages/login';
import Singup from '../pages/signup';
import { UserContextProvider } from './components/userContext';
import CreatePage from '../pages/createPost';



function App() {
  return(
    <UserContextProvider>
    <Routes>
      <Route path='/' element={<Homepage />} />
      <Route path='/signup' element={<Singup />} />
      <Route path='/login' element={<Login />} />
      <Route path='/create' element={<CreatePage />} />
    </Routes>
    </UserContextProvider>
  )
}

export default App
