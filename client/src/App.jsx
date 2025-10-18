
import { Route, Routes } from 'react-router'
import './App.css'
import Signup from './components/Signup'
import HomePage from './components/HomePage'
import PendingRequests from './components/PendingRequests'

function App() {
  return (<>
      <div className="font-['Noto Sans']">
      <Routes>
        <Route path='/' element={<HomePage/>}></Route>
        <Route path='/signup' element={<Signup />}></Route>
        <Route path='/pendingrequests' element={<PendingRequests />}></Route>
      </Routes>  
      </div>
  </>
  )
}

export default App
