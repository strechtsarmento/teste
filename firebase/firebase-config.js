import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, setPersistence, browserLocalPersistence } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Replace these placeholders with the Firebase web app settings for the dedicated Web project.
// These client settings are public by design; never put a service-account key here.
export const firebaseConfig = {
  apiKey: "CONFIGURE_FIREBASE_WEB_API_KEY",
  authDomain: "CONFIGURE_FIREBASE_AUTH_DOMAIN",
  projectId: "CONFIGURE_FIREBASE_PROJECT_ID",
  storageBucket: "CONFIGURE_FIREBASE_STORAGE_BUCKET",
  messagingSenderId: "CONFIGURE_FIREBASE_MESSAGING_SENDER_ID",
  appId: "CONFIGURE_FIREBASE_APP_ID"
};

export const firebaseConfigured = Object.values(firebaseConfig).every(
  (value) => value && !value.startsWith("CONFIGURE_")
);

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Não foi possível manter a sessão neste navegador.", error);
});
