// db.js

// Function to initialize IndexedDB
function initIndexedDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('TodoAppDB', 1);

        request.onupgradeneeded = function(event) {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('todos')) {
                db.createObjectStore('todos', { keyPath: 'id' });
            }
        };

        request.onsuccess = function(event) {
            resolve(event.target.result);
        };

        request.onerror = function(event) {
            reject(event.target.error);
        };
    });
}

// Function to sync with Firebase
function syncWithFirebase(db) {
    const todosRef = firebase.database().ref('todos');

    // Sync data from IndexedDB to Firebase
    const transaction = db.transaction('todos', 'readonly');
    const objectStore = transaction.objectStore('todos');
    objectStore.getAll().onsuccess = function(event) {
        const todos = event.target.result;
        todosRef.set(todos);
    };

    // Sync data from Firebase to IndexedDB
    todosRef.on('value', (snapshot) => {
        const todos = snapshot.val();
        const transaction = db.transaction('todos', 'readwrite');
        const objectStore = transaction.objectStore('todos');
        for (const id in todos) {
            objectStore.put({...todos[id], id});
        }
    });
}

// Initialize and sync
initIndexedDB().then(db => {
    syncWithFirebase(db);
}).catch(error => {
    console.error('Error initializing IndexedDB:', error);
});