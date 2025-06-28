import React, { useEffect, useState } from 'react'
import Navbar from '../Navbar/Navbar'
import Login from '../Modal/Login'
import Sell from '../Modal/Sell'
import EditAd from '../Modal/EditAd' // Import the new EditAd component
import { ItemsContext } from '../Context/Item'
import { UserAuth } from '../Context/Auth'
import { Link } from 'react-router-dom'
import { deleteDoc, doc } from 'firebase/firestore'
import { fireStore, fetchFromFirestore } from '../Firebase/Firebase'

const MyAds = () => {
    const [openModal, setModal] = useState(false)
    const [openModalSell, setModalSell] = useState(false)
    const [openEditModal, setEditModal] = useState(false) 
    const [editItem, setEditItem] = useState(null) 
    const [userAds, setUserAds] = useState([])
    const [loading, setLoading] = useState(true)

    const toggleModal = () => setModal(!openModal)
    const toggleModalSell = () => setModalSell(!openModalSell)
    const toggleEditModal = () => setEditModal(!openEditModal)

    const itemsCtx = ItemsContext()
    const auth = UserAuth()

    useEffect(() => {
        if (itemsCtx?.items && auth?.user) {
            const filteredAds = itemsCtx.items.filter(item => item.userId === auth.user.uid)
            setUserAds(filteredAds)
        }
        setLoading(false)
    }, [itemsCtx?.items, auth?.user])

    const handleDelete = async (itemId) => {
        if (window.confirm('Are you sure you want to delete this ad?')) {
            try {
                await deleteDoc(doc(fireStore, 'products', itemId))
                
                const updatedItems = await fetchFromFirestore()
                itemsCtx?.setItems(updatedItems)
                
                setUserAds(prev => prev.filter(ad => ad.id !== itemId))
                
                alert('Ad deleted successfully!')
            } catch (error) {
                console.error('Error deleting ad:', error)
                alert('Failed to delete ad. Please try again.')
            }
        }
    }

    const handleEdit = (item) => {
        setEditItem(item)
        toggleEditModal()
    }

    if (!auth?.user) {
        return (
            <div>
                <Navbar toggleModal={toggleModal} toggleModalSell={toggleModalSell} />
                <Login toggleModal={toggleModal} status={openModal} />
                <div className="flex flex-col items-center justify-center min-h-screen p-10">
                    <h1 className="text-2xl font-bold mb-4" style={{color: '#002f34'}}>Please Login</h1>
                    <p className="text-gray-600 mb-6">You need to login to view your ads</p>
                    <button 
                        onClick={toggleModal}
                        className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Login Now
                    </button>
                </div>
            </div>
        )
    }

    if (loading) {
        return (
            <div>
                <Navbar toggleModal={toggleModal} toggleModalSell={toggleModalSell} />
                <div className="flex items-center justify-center min-h-screen">
                    <p className="text-xl">Loading your ads...</p>
                </div>
            </div>
        )
    }

    return (
        <div>
            <Navbar toggleModal={toggleModal} toggleModalSell={toggleModalSell} />
            <Login toggleModal={toggleModal} status={openModal} />
            <Sell setItems={itemsCtx?.setItems} toggleModalSell={toggleModalSell} status={openModalSell} />
            
            <EditAd 
                setItems={itemsCtx?.setItems} 
                toggleEditModal={toggleEditModal} 
                status={openEditModal}
                editItem={editItem}
            />

            <div className='p-10 px-5 sm:px-15 md:px-30 lg:px-40 min-h-screen pt-32'>
                <div className="flex justify-between items-center mb-6">
                    <h1 style={{ color: '#002f34' }} className="text-2xl font-bold">My Ads ({userAds.length})</h1>
                    <button 
                        onClick={toggleModalSell}
                        className="px-4 py-2 text-white rounded-md"
                        style={{ backgroundColor: '#002f34' }}
                    >
                        + Post New Ad
                    </button>
                </div>

                {userAds.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <h2 className="text-xl font-semibold mb-4" style={{color: '#002f34'}}>No ads posted yet</h2>
                        <p className="text-gray-600 mb-6">Start selling by posting your first ad</p>
                        <button 
                            onClick={toggleModalSell}
                            className="px-6 py-3 text-white rounded-md"
                            style={{ backgroundColor: '#002f34' }}
                        >
                            Post Your First Ad
                        </button>
                    </div>
                ) : (
                    <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
                        {userAds.map((item) => (
                            <div key={item.id} className="relative">
                                <Link 
                                    to={'/details'} 
                                    state={{item}}
                                    style={{ borderWidth: '1px', borderColor:'lightgrey'}}
                                    className="block"
                                >
                                    <div 
                                        style={{borderWidth: '1px', borderColor: 'lightgray'}} 
                                        className='relative w-full h-72 rounded-md border-solid bg-gray-50 overflow-hidden cursor-pointer'
                                    >
                                        {/* Display Images */}
                                        <div className='w-full flex justify-center p-2 overflow-hidden'>
                                            <img
                                                className='h-36 object-contain'
                                                src={item.imageUrl || 'https://via.placeholder.com/150'} 
                                                alt={item.title} 
                                            />
                                        </div>

                                        {/* Display details */}
                                        <div className='details p-1 pl-4 pr-4'>
                                            <h1 style={{ color: '#002f34' }} className="font-bold text-xl">₹ {item.price}</h1>
                                            <p className="text-sm pt-2">{item.category}</p>
                                            <p className="pt-2">{item.title}</p>
                                            <p className="text-xs text-gray-500 pt-1">{item.createdAt}</p>
                                        </div>
                                    </div>
                                </Link>

                                
                                <div className="absolute top-3 right-3 flex flex-col gap-2">
                                    {/* Edit button */}
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault()
                                            handleEdit(item)
                                        }}
                                        className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
                                        title="Edit Ad"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>
                                    
                                    {/* Delete button */}
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault()
                                            handleDelete(item.id)
                                        }}
                                        className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                                        title="Delete Ad"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Status indicator */}
                                <div className="absolute top-3 left-3">
                                    <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                                        Active
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default MyAds