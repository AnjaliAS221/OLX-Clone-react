import './Navbar.css'
import logo from '../../assets/olx_logo_2025.svg'
import search from '../../assets/search1.svg'
import arrow from '../../assets/arrow-down.svg'
import searchWt from '../../assets/search.svg'
import {useAuthState} from 'react-firebase-hooks/auth'
import { auth } from '../Firebase/Firebase'
import addBtn from '../../assets/addButton.png'
import { signOut } from 'firebase/auth'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ClipboardDocumentListIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/solid'



const Navbar = (props) => {
    const [user] = useAuthState(auth)
    const {toggleModal, toggleModalSell} = props
    const [showDropdown, setShowDropdown] = useState(false)

    const handleLogout = async () => {
        try {
            await signOut(auth)
            setShowDropdown(false)
            console.log('User logged out successfully')
        } catch (error) {
            console.error('Logout error:', error.message)
        }
    }

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown)
    }

    return (
        <div>
            <nav className="fixed z-50 w-full overflow-auto p-2 pl-3 pr-3 shadow-md bg-slate-100 border-b-4 border-solid border-b-white">
                <Link to="/">
                    <img src={logo} alt="" className='w-12 cursor-pointer' />
                </Link>
                
                <div className='relative location-search ml-5'>
                    <img src={search} alt="" className='absolute top-4 left-2 w-5' />
                    <input placeholder='Search city, area, or locality...' className='w-[50px] sm:w-[150px] md:w-[250] lg:w-[270px] p-3 pl-8 pr-8 border-black border-solid border-2 rounded-md placeholder:text-ellipsis focus:outline-none focus:border-teal-300' type="text" />
                    <img src={arrow} alt="" className='absolute top-4 right-3 w-5 cursor-pointer' />
                </div>

                <div className="ml-5 mr-2 relative w-full main-search">
                    <input placeholder='Find Cars, Mobile Phones, and More...' className='w-full p-3 border-black border-solid border-2 rounded-md placeholder:text-ellipsis focus:outline-none focus:border-teal-300' type="text" />
                    <div style={{ backgroundColor: '#002f34' }} className="flex justify-center items-center absolute top-0 right-0 h-full rounded-e-md w-12">
                        <img className="w-5 filter invert" src={searchWt} alt="Search Icon" />
                    </div>
                </div>

                <div className="mx-1 sm:ml-5 sm:mr-5 relative lang">
                    <p className="font-bold mr-3">English</p>
                    <img src={arrow} alt="" className='w-5 cursor-pointer' />
                </div>

                {!user ? (
                    <p className='font-bold underline ml-5 cursor-pointer' style={{color: '#002f34'}} onClick={toggleModal}>Login</p>
                ) : (
                    <div className='relative ml-5'>
                        <div className='flex items-center cursor-pointer' onClick={toggleDropdown}>
                            <p style={{color: '#002f34'}} className='font-bold'>{user.displayName?.split(' ')[0]}</p>
                            <img src={arrow} alt="" className='w-4 ml-1' />
                        </div>
                        
                        {showDropdown && (
                            <div className='absolute top-full right-0 mt-2 w-48 bg-white border-2 border-gray-300 rounded-md shadow-xl z-[60]'>
                                <div className='py-2'>
                              <Link 
                                to="/my-ads" 
                                className='flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-blue-50 border-b border-gray-100'
                                onClick={() => setShowDropdown(false)}
                              >
                                <ClipboardDocumentListIcon className="w-5 h-5 text-[#002f34]" />
                                <span className='text-[#002f34]'>My Ads</span>
                              </Link>
                              
                              <button 
                                onClick={handleLogout}
                                className='flex items-center gap-2 w-full text-left px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50'
                              >
                                <ArrowRightOnRectangleIcon className="w-5 h-5 text-red-600" />
                                Logout
                              </button>
                            </div>

                            </div>
                        )}
                    </div>
                )}

                <img src={addBtn} 
                    onClick={user ? toggleModalSell : toggleModal}
                    className='w-24 mx-1 sm:ml-5 sm:mr-5 shadow-xl rounded-full cursor-pointer'
                    alt="" />
            </nav>

            <div className='w-full relative z-0 flex shadow-md p-2 pt-20 pl-10 pr-10 sm:pl-44 md:pr-44 sub-lists'>
                <ul className='list-none flex items-center justify-between w-full'>
                    <div className='flex flex-shrink-0'>
                        <p className='font-semibold uppercase all-cats'>All categories</p>
                        <img className='w-4 ml-2' src={arrow} alt="" />
                    </div>

                    <li>Cars</li>
                    <li>Motorcycles</li>
                    <li>Mobile Phones</li>
                    <li>For sale : Houses & Apartments</li>
                    <li>Scooter</li>
                    <li>Commercial & Other Vehicles</li>
                    <li>For rent : Houses & Apartments</li>
                </ul>
            </div>
        </div>
    )
}

export default Navbar;