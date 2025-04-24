import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDDzHSJFLh8mnmX0tT5c9S5EH1OdH4OKG4",
  authDomain: "kisaanconnect-5990b.firebaseapp.com",
  projectId: "kisaanconnect-5990b",
  storageBucket: "kisaanconnect-5990b.firebasestorage.app",
  messagingSenderId: "392716635804",
  appId: "1:392716635804:web:7efa5f2b4fc36eff576759",
  measurementId: "G-JNPS0FRWTC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.useDeviceLanguage(); // Use the device's preferred language

// Initialize Firestore with better error handling
const db = getFirestore(app);

// Initialize Google Authentication provider with custom parameters
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// For development environment, you could use emulators
// if (import.meta.env.VITE_APP_ENV === 'development' && window.location.hostname === 'localhost') {
//   connectFirestoreEmulator(db, 'localhost', 8080);
// }

export { auth, db, googleProvider };