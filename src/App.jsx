import { Route, Routes } from 'react-router-dom'
import Home from './Components/Pages/Home'
import Details from './Components/Details/Details'
import MyAds from './Components/Pages/MyAds'

const App = () => {
  return (
   <>
   <Routes>
    <Route path='/' element={<Home/>}/>
    <Route path='/details' element={<Details/>}/>
    <Route path='/my-ads' element={<MyAds/>}/>
   </Routes>
   </>
  )
}

export default App