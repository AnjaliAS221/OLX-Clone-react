import Login from '../Modal/Login';
import Navbar from '../Navbar/Navbar'
import React,{useState} from 'react'

const Home = () => {
  const [openModal,setModal] = useState(false);
  const toggleModal = ()=> {setModal(!openModal)}
  return (
    <div>
        <Navbar toggleModal={toggleModal}/>
        <Login toggleModal = {toggleModal} status = {openModal}/>
    </div>
  )
}

export default Home
