import { initializeApp, getApps } from "firebase/app";
import { getFunctions, Functions } from "firebase/functions";

// --- Firebase config from environment variables ---
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
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
  } catch (e) {
    console.warn("Firebase initialization failed. Falling back to non-Firebase mode.", e);
    functions = null;
  }
} else {
  console.warn("Firebase config missing or placeholder values. Firebase disabled.");
}

export { functions, isFirebaseConfigured };
