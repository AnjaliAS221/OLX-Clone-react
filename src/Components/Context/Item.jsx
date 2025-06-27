import { collection, getDocs } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { fireStore } from "../Firebase/Firebase";

const Context = createContext(null);
export const ItemsContext = ()=> useContext(Context) //customHook

export  const ItemsContextProvider = ({children})=>{
    const [items,setItems] = useState(null);

    useEffect(()=>{
        const fetchItemsFromFireStore = async ()=>{

            try {
                const productsCollection = collection(fireStore,'products'); // firestore collection names are case-sensitive
                const productSnapshot = await getDocs(productsCollection)
                const productsList = productSnapshot.docs.map(doc =>({
                    id:doc.id,
                    ...doc.data()
                }))
                setItems(productsList)
                
            } catch (error) {
                console.log(error,'error fetching products')
                
            }

        }

        fetchItemsFromFireStore();

    },[]);

    return(
        <>


        <Context.Provider  value={{items, setItems}}>
            {children}
        </Context.Provider>
        
        </>
    )
}