import Home from './pages/Home'
import { Route, Routes } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import { AuthContextProvider } from './context/AuthContext'
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from './pages/protected/Dashboard'
import Results from './pages/protected/Results'
import History from './pages/protected/History'
import Settings from './pages/protected/Settings'

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
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/results/:id" element={<Results />} />
              <Route path="/history" element={<History />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Routes>
        </AuthContextProvider>
    </>
  )
}

export default App
