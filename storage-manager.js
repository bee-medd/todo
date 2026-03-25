// storage-manager.js

// Initialize Firebase Storage
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    // Your Firebase configuration goes here
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

// Function to upload photo to Firebase Storage
export const uploadPhoto = async (file) => {
    const storageRef = ref(storage, `photos/${file.name}`);
    try {
        const snapshot = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(snapshot.ref);
        console.log('Uploaded a blob or file!', url);
        return url;
    } catch (error) {
        console.error('Upload failed:', error);
    }
};

// Function to save URL to localStorage
export const saveToLocalStorage = (key, url) => {
    localStorage.setItem(key, url);
};

// Function to synchronize localStorage with Firebase
export const syncWithLocalStorage = async () => {
    const keys = Object.keys(localStorage);
    for (const key of keys) {
        const url = localStorage.getItem(key);
        // Perform any synchronization process if needed
        // For now, just log the URLs
        console.log(`Key: ${key}, URL: ${url}`);
    }
};
