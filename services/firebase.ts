import { initializeApp, getApps } from "firebase/app";
import { getFunctions, Functions } from "firebase/functions";

// --- REAL FIREBASE CONFIG (Updated) ---
const firebaseConfig = {
  apiKey: "AIzaSyBur1dRxHsiI0LitNfBK4TR7ECKEWkpYBM",
  authDomain: "gen-lang-client-0928241661.firebaseapp.com",
  projectId: "gen-lang-client-0928241661",
  storageBucket: "gen-lang-client-0928241661.firebasestorage.app",
  messagingSenderId: "31152200054",
  appId: "1:31152200054:web:e5c05bc344a444d66e4257",
  measurementId: "G-QLXPG7HZ4T"
};

// --- Detect whether config is valid ---
function isFirebaseConfigured(): boolean {
  return (
    !!firebaseConfig.apiKey &&
    firebaseConfig.apiKey !== "YOUR_API_KEY" &&
    !!firebaseConfig.projectId &&
    firebaseConfig.projectId !== "YOUR_PROJECT_ID"
  );
}

let functions: Functions | null = null;

// --- Only initialize Firebase if config is valid ---
if (isFirebaseConfigured()) {
  try {
    const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
    functions = getFunctions(app);
    // Note: Analytics is intentionally omitted to prevent 'Installations' errors
    // if the API key is restricted or the service isn't fully provisioned yet.
  } catch (e) {
    console.warn("Firebase initialization failed. Falling back to non-Firebase mode.", e);
    functions = null;
  }
} else {
  console.warn("Firebase config missing or placeholder values. Firebase disabled.");
}

export { functions, isFirebaseConfigured };