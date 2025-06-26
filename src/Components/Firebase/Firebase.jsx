
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"
import { getStorage } from "firebase/storage";
import { collection, getDocs,getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyB7au78sEuBPoARmJEbgPLBcY336nrTAVs",
  authDomain: "olx-clone-ed612.firebaseapp.com",
  projectId: "olx-clone-ed612",
  storageBucket: "olx-clone-ed612.firebasestorage.app",
  messagingSenderId: "187410159774",
  appId: "1:187410159774:web:2c0b30a7063ec26fe9038f"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const storage = getStorage();
const fireStore = getFirestore()

const fetchFromFirestore = async () => {
    try {
      const productsCollection = collection(fireStore, 'products');
      const productSnapshot = await getDocs(productsCollection);
      const productList = productSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) 
      console.log("Fetched products from Firestore:", productList);
      return productList;
    } catch (error) {
      console.error("Error fetching products from Firestore:", error);
      return [];
    }
  };
  

  export {
    auth,
    provider,
    storage,
    fireStore,
    fetchFromFirestore
  }