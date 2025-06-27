import { Modal, ModalBody } from "flowbite-react"
import { useState } from "react"
import Input from "../Input/Input"
import { UserAuth } from "../Context/Auth"
import { addDoc, collection } from "firebase/firestore"
import { fetchFromFirestore, fireStore } from "../Firebase/Firebase"
import fileUpload from '../../assets/fileUpload.svg'
import loading from '../../assets/loading.gif'
import close from '../../assets/close.svg'



const Sell = (props) => {  
    const {toggleModalSell,status ,setItems} = props

    const [title,setTitle] = useState('')
    const [category,setCategory] = useState('')
    const [price,setPrice] = useState('')
    const [description,setDescription] = useState('')
    const [image,setImage] = useState(null)

    const [submitting,setSubmitting] = useState(false)

    const auth = UserAuth();

    const handleImageUpload = (event)=>{
        if(event.target.files) setImage(event.target.files[0])
    }
    
    const handleSubmit = async (event)=>{
        event.preventDefault();

        if(!auth?.user){
            alert('Please login to continue');
            return;
        }

        setSubmitting(true)

        const readImageAsDataUrl =(file) =>{
            return new Promise((resolve,reject) =>{
                const reader = new FileReader();
                reader.onloadend = ()=>{
                    const imageUrl = reader.result
                    localStorage.setItem(`image_${file.name}`, imageUrl)
                    resolve(imageUrl)
                }
                reader.onerror = reject
                reader.readAsDataURL(file)
            })
        }

        let imageUrl = '';
        if(image){
            try {
                imageUrl = await readImageAsDataUrl(image)
                
            } catch (error) {
                console.log(error)
                alert('falied to read image');
                return;
                
            }
        }

        const trimmedTitle = title.trim();
        const trimmedCategory = category.trim();
        const trimmedPrice = price.trim();
        const trimmedDescription = description.trim();
  

        if(!trimmedTitle || !trimmedCategory ||!trimmedPrice || !trimmedDescription  ){
            alert('All fields are required');
            setSubmitting(false)
            return;
        }

        try {

            await addDoc(collection(fireStore, 'products'), {
                title,
                category,
                price,
                description,
                imageUrl,
                userId: auth.user.uid,
                userName: auth.user.displayName || 'Anonymous',
                createAt: new Date().toDateString(),
            });

            setImage(null);
            const datas = await fetchFromFirestore();
            setItems(datas)
            toggleModalSell();
            
        } catch (error) {
            console.log(error);
            alert('failed to add items to the firestore')
            
        }finally{
            setSubmitting(false)
        }

        

    }



  return (
    <div>
        <Modal  theme={{
             "content": {
                "base": "relative w-full p-4 md:h-auto",
                "inner": "relative flex max-h-[90dvh] flex-col rounded-lg bg-white shadow dark:bg-gray-700"
            },
        }}  onClick={toggleModalSell} show={status}  className="bg-black"  position={'center'}  size="md" popup= {true}>
            <ModalBody  className="bg-white h-96 p-0 rounded-md"   onClick={(event) => event.stopPropagation()}>
                <img 
                onClick={()=>{
                    toggleModalSell();
                    setImage(null);
                }}
                className="w-6 absolute z-10 top-6 right-8 cursor-pointer"
                src={close} alt="" />
               
                <div className="p-6 pl-8 pr-8 pb-8">
                    <p  className="font-bold text-lg mb-3">Sell Item</p>

                    <form  onSubmit={handleSubmit}>
                       <Input setInput={setTitle} placeholder ='Title' />
                       <Input setInput={setCategory} placeholder='category'/>
                       <Input setInput={setPrice} placeholder='Price'/>
                       <Input setInput={setDescription} placeholder='Description'/>

                       <div  className="pt-2 w-full relative">
                        
                       {image ? (

                        <div className="relative h-40 sm:h-60 w-full flex justify-center border-2 border-black border-solid rounded-md overflow-hidden">
                            <img  className="object-contain" src={URL.createObjectURL(image)}   alt="" />
                        </div>
                       ) : (
                        <div  className="relative h-40 sm:h-60 w-full border-2 border-black border-solid rounded-md">
                            <input
                            onChange={handleImageUpload}
                            type="file" 
                            className="absolute inset-10 h-full w-full opacity-0 cursor-pointer z-30"
                            required
                            />

                            <div  className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] flex flex-col items-center">
                                <img  className="w-12" src={fileUpload} alt="" />
                                <p  className="text-center text-sm pt-2">Click to upload images</p>
                                <p  className="text-center text-sm pt-2">SVG, PNG, JPG</p>
                            </div>
                        </div>
                       )} 

                       </div>
                       

                       {
                        submitting? (
                            <div  className="w-full flex h-14 justify-center pt-4 pb-2">
                                <img className="w-32 object-cover" src={loading} alt="" />

                            </div>
                        ) : (

                            <div  className="w-full pt-2">
                                <button  className="w-full p-3 rounded-lg text-white"
                                style={{ backgroundColor: '#002f34' }}
                                > Sell Item </button>
                            </div>
                        )
                       }
                     
                    </form>
                </div>
            </ModalBody>

        </Modal  >

      
    </div>
  )
}

export default Sell