
import type { DownloadedSurah } from '../types';

const DB_NAME = 'AajerrAudioDB';
const DB_VERSION = 1;
const STORE_NAME = 'downloaded_surahs';

let db: IDBDatabase | null = null;

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('IndexedDB error:', request.error);
      reject('Error opening DB');
    };

    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const dbInstance = (event.target as IDBOpenDBRequest).result;
      if (!dbInstance.objectStoreNames.contains(STORE_NAME)) {
        dbInstance.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
};

export const saveAudio = async (surahData: Omit<DownloadedSurah, 'audioBlob'>, audioBlob: Blob) => {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const dataToStore: DownloadedSurah = { ...surahData, audioBlob };
    store.put(dataToStore);
    return new Promise<void>((resolve, reject) => {
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
    });
};

export const getAudio = async (id: string): Promise<DownloadedSurah | null> => {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(id);

    return new Promise((resolve, reject) => {
        request.onsuccess = () => {
            resolve(request.result || null);
        };
        request.onerror = () => {
            reject(request.error);
        };
    });
};

export const deleteAudio = async (id: string) => {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    store.delete(id);
    return new Promise<void>((resolve, reject) => {
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
    });
};

export const getDownloadedIds = async (): Promise<string[]> => {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAllKeys();

    return new Promise((resolve, reject) => {
        request.onsuccess = () => {
            resolve(request.result as string[]);
        };
        request.onerror = () => {
            reject(request.error);
        };
    });
};
