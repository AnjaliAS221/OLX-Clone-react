import { Modal, ModalBody } from "flowbite-react"
import { useState, useEffect } from "react"
import Input from "../Input/Input"
import { UserAuth } from "../Context/Auth"
import { doc, updateDoc } from "firebase/firestore"
import { fetchFromFirestore, fireStore } from "../Firebase/Firebase"
import fileUpload from '../../assets/fileUpload.svg'
import loading from '../../assets/loading.gif'
import close from '../../assets/close.svg'

const EditAd = (props) => {  
    const { toggleEditModal, status, setItems, editItem } = props

    const [title, setTitle] = useState('')
    const [category, setCategory] = useState('')
    const [price, setPrice] = useState('')
    const [description, setDescription] = useState('')
    const [image, setImage] = useState(null)
    const [currentImageUrl, setCurrentImageUrl] = useState('')

    const [submitting, setSubmitting] = useState(false)

    const auth = UserAuth();

    useEffect(() => {
        if (editItem && status) {
            setTitle(editItem.title || '')
            setCategory(editItem.category || '')
            setPrice(editItem.price || '')
            setDescription(editItem.description || '')
            setCurrentImageUrl(editItem.imageUrl || '')
            setImage(null) 
        }
    }, [editItem, status])

    const handleImageUpload = (event) => {
        if (event.target.files) {
            setImage(event.target.files[0])
        }
    }

    const handleClose = () => {
        toggleEditModal();
        setImage(null);
        setTitle('');
        setCategory('');
        setPrice('');
        setDescription('');
        setCurrentImageUrl('');
    }
    
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!auth?.user) {
            alert('Please login to continue');
            return;
        }

        if (!editItem?.id) {
            alert('Invalid item to edit');
            return;
        }

        setSubmitting(true)

        const readImageAsDataUrl = (file) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const imageUrl = reader.result
                    resolve(imageUrl)
                }
                reader.onerror = reject
                reader.readAsDataURL(file)
            })
        }

        let imageUrl = currentImageUrl; 
        
        if (image) {
            try {
                imageUrl = await readImageAsDataUrl(image)
            } catch (error) {
                console.log(error)
                alert('Failed to read image');
                setSubmitting(false)
                return;
            }
        }

        const trimmedTitle = title.trim();
        const trimmedCategory = category.trim();
        const trimmedPrice = price.trim();
        const trimmedDescription = description.trim();

        if (!trimmedTitle || !trimmedCategory || !trimmedPrice || !trimmedDescription) {
            alert('All fields are required');
            setSubmitting(false)
            return;
        }

        try {
            const itemRef = doc(fireStore, 'products', editItem.id);
            await updateDoc(itemRef, {
                title: trimmedTitle,
                category: trimmedCategory,
                price: trimmedPrice,
                description: trimmedDescription,
                imageUrl,
                updatedAt: new Date().toDateString(),
            });

            setTitle('');
            setCategory('');
            setPrice('');
            setDescription('');
            setImage(null);
            setCurrentImageUrl('');
            
            const datas = await fetchFromFirestore();
            setItems(datas)
            toggleEditModal();
            alert('Ad updated successfully!');
            
        } catch (error) {
            console.log(error);
            alert('Failed to update item in firestore')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div>
            <Modal  
                theme={{
                    "content": {
                        "base": "relative w-full p-4 md:h-auto",
                        "inner": "relative flex max-h-[90dvh] flex-col rounded-lg bg-white shadow dark:bg-gray-700"
                    },
                }}  
                onClick={handleClose} 
                show={status}  
                className="bg-black bg-opacity-50"  
                position={'center'}  
                size="md" 
                popup={true}
            >
                <ModalBody className="bg-white h-96 p-0 rounded-md" onClick={(event) => event.stopPropagation()}>
                    <img 
                        onClick={handleClose}
                        className="w-6 absolute z-10 top-6 right-8 cursor-pointer hover:opacity-70"
                        src={close} 
                        alt="Close" 
                    />
                   
                    <div className="p-6 pl-8 pr-8 pb-8">
                        <p className="font-bold text-lg mb-3" style={{color: '#002f34'}}>Edit Item</p>

                        <form onSubmit={handleSubmit}>
                           <Input setInput={setTitle} placeholder='Title' value={title} />
                           <Input setInput={setCategory} placeholder='Category' value={category} />
                           <Input setInput={setPrice} placeholder='Price' value={price} />
                           <Input setInput={setDescription} placeholder='Description' value={description} />

                           <div className="pt-2 w-full relative">
                            
                           {image ? (
                            
                            <div className="relative h-40 sm:h-60 w-full flex justify-center border-2 border-black border-solid rounded-md overflow-hidden">
                                <img className="object-contain" src={URL.createObjectURL(image)} alt="Preview" />
                                <button
                                    type="button"
                                    onClick={() => setImage(null)}
                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                                >
                                    ×
                                </button>
                                <div className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                                    New Image
                                </div>
                            </div>
                           ) : currentImageUrl ? (
                            
                            <div className="relative h-40 sm:h-60 w-full flex justify-center border-2 border-gray-300 border-solid rounded-md overflow-hidden">
                                <img className="object-contain" src={currentImageUrl} alt="Current" />
                                <div className="absolute bottom-2 left-2 bg-gray-500 text-white text-xs px-2 py-1 rounded">
                                    Current Image
                                </div>
                                <input
                                    onChange={handleImageUpload}
                                    type="file" 
                                    accept="image/*"
                                    className="absolute inset-0 h-full w-full opacity-0 cursor-pointer z-30"
                                />
                                <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                                    Click to change
                                </div>
                            </div>
                           ) : (
                            
                            <div className="relative h-40 sm:h-60 w-full border-2 border-black border-solid rounded-md hover:border-teal-300 transition-colors">
                                <input
                                    onChange={handleImageUpload}
                                    type="file" 
                                    accept="image/*"
                                    className="absolute inset-0 h-full w-full opacity-0 cursor-pointer z-30"
                                />

                                <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] flex flex-col items-center">
                                    <img className="w-12" src={fileUpload} alt="" />
                                    <p className="text-center text-sm pt-2 font-semibold">Click to upload images</p>
                                    <p className="text-center text-xs pt-1 text-gray-500">SVG, PNG, JPG (Max 5MB)</p>
                                </div>
                            </div>
                           )} 

                           </div>
                           

                           {
                            submitting ? (
                                <div className="w-full flex h-14 justify-center pt-4 pb-2">
                                    <img className="w-32 object-cover" src={loading} alt="Loading..." />
                                </div>
                            ) : (
                                <div className="w-full pt-4 flex gap-2">
                                    <button  
                                        type="button"
                                        onClick={handleClose}
                                        className="w-1/3 p-3 rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                                    > 
                                        Cancel 
                                    </button>
                                    <button  
                                        type="submit"
                                        className="w-2/3 p-3 rounded-lg text-white hover:opacity-90 transition-opacity"
                                        style={{ backgroundColor: '#002f34' }}
                                        disabled={!title || !category || !price || !description}
                                    > 
                                        Update Ad 
                                    </button>
                                </div>
                            )
                           }
                         
                        </form>
                    </div>
                </ModalBody>
            </Modal>
        </div>
    )
}

export default EditAd