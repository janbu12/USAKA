require('dotenv').config({ path: './.env' });
const { initializeApp } = require('firebase/app');
const { signInWithCustomToken, getAuth } = require('firebase/auth');

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_REALTIME_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

async function getIdToken(customToken) {
    try {
        const userCredential = await signInWithCustomToken(auth, customToken);
        const idToken = await userCredential.user.getIdToken();
        console.log("Successfully signed in with custom token. ID Token:", idToken);
        return idToken;
    } catch (error) {
        console.error("Error signing in with custom token:", error);
    }
}

const customTokenFromBackend = process.argv[2];

if (customTokenFromBackend) {
    getIdToken(customTokenFromBackend);
} else {
    console.log("Please provide a custom token as an argument: node get-id-token.js <YOUR_CUSTOM_TOKEN>");
}