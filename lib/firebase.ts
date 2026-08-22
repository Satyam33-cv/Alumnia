import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import firebaseConfig from "@/firebase-applet-config.json";

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Configure Google Auth Provider with Workspace Scopes
export const googleAuthProvider = new GoogleAuthProvider();

// Gmail Scopes
googleAuthProvider.addScope("https://www.googleapis.com/auth/gmail.readonly");
googleAuthProvider.addScope("https://www.googleapis.com/auth/gmail.send");
googleAuthProvider.addScope("https://www.googleapis.com/auth/gmail.compose");

// Google Forms Scopes
googleAuthProvider.addScope("https://www.googleapis.com/auth/forms.body");
googleAuthProvider.addScope("https://www.googleapis.com/auth/forms.body.readonly");
googleAuthProvider.addScope("https://www.googleapis.com/auth/forms.responses.readonly");

// Google Docs & Drive Scopes
googleAuthProvider.addScope("https://www.googleapis.com/auth/documents");
googleAuthProvider.addScope("https://www.googleapis.com/auth/documents.readonly");
googleAuthProvider.addScope("https://www.googleapis.com/auth/drive.readonly");
googleAuthProvider.addScope("https://www.googleapis.com/auth/drive.file");

// Google Calendar Scopes
googleAuthProvider.addScope("https://www.googleapis.com/auth/calendar");
googleAuthProvider.addScope("https://www.googleapis.com/auth/calendar.events");
googleAuthProvider.addScope("https://www.googleapis.com/auth/calendar.events.readonly");

// Google Chat Scopes
googleAuthProvider.addScope("https://www.googleapis.com/auth/chat.spaces");
googleAuthProvider.addScope("https://www.googleapis.com/auth/chat.spaces.readonly");
googleAuthProvider.addScope("https://www.googleapis.com/auth/chat.messages");
googleAuthProvider.addScope("https://www.googleapis.com/auth/chat.messages.readonly");

export default app;
