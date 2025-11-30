
const DB_NAME = 'Rufoof_Storage_DB';
const STORE_NAME = 'files';
const DB_VERSION = 1;

let dbPromise: Promise<IDBDatabase> | null = null;

const initDB = (): Promise<IDBDatabase> => {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event: any) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = (event: any) => resolve(event.target.result);
    request.onerror = (event: any) => reject(event.target.error);
  });

  return dbPromise;
};

export const saveFile = async (file: File): Promise<string> => {
  try {
    const db = await initDB();
    const id = crypto.randomUUID();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      const fileData = {
        id,
        file, // Store the Blob/File object directly
        name: file.name,
        type: file.type,
        size: file.size,
        date: Date.now()
      };

      const request = store.put(fileData);
      
      request.onsuccess = () => resolve(id);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error saving file:', error);
    throw error;
  }
};

export const getFileUrl = async (id: string): Promise<string | null> => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(id);

      request.onsuccess = () => {
        const result = request.result;
        if (result && result.file) {
          resolve(URL.createObjectURL(result.file));
        } else {
          resolve(null);
        }
      };
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error getting file:', error);
    return null;
  }
};

export const deleteFile = async (id: string): Promise<void> => {
  try {
    const db = await initDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    store.delete(id);
  } catch (error) {
    console.error('Error deleting file:', error);
  }
};
