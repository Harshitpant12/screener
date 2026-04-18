import Home from './pages/Home'
import { Route, Routes } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import { AuthContextProvider } from './context/AuthContext'
import ProtectedRoute from "./components/ProtectedRoute";

function App() {

  return (
    <>
        <AuthContextProvider>
          <Routes>
            {/* Public Routes */}
            <Route path='/' element={<Home/>} />
            <Route path='/register' element={<Register/>} />
            <Route path='/login' element={<Login/>} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute/> } >
              {/* <Route path="/dashboard" element={<Dashboard />} /> */}
              {/* all protected route will be added here */}
            </Route>
          </Routes>
        </AuthContextProvider>
    </>
  )
}

export default App
