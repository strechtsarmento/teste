import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, setPersistence, browserLocalPersistence } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Replace these placeholders with the Firebase web app settings for the dedicated Web project.
// These client settings are public by design; never put a service-account key here.
const firebaseConfig = {
  apiKey: "AIzaSyA3Duv6qD2DY6vuYhv84xy8iTMo2aJpUtA",
  authDomain: "master-dashboard-bb.firebaseapp.com",
  projectId: "master-dashboard-bb",
  storageBucket: "master-dashboard-bb.firebasestorage.app",
  messagingSenderId: "639331293700",
  appId: "1:639331293700:web:17f7adc5dcee8b00e47351"
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
