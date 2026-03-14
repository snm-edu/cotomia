import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import type { StateStorage } from "zustand/middleware";

const storageProbeKey = "__cotomia_storage_probe__";
const memoryStorage = new Map<string, string>();

function getBrowserStorage(): Storage | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const storage = window.localStorage;
    storage.setItem(storageProbeKey, "1");
    storage.removeItem(storageProbeKey);
    return storage;
  } catch {
    return null;
  }
}

export const persistStorage: StateStorage = {
  getItem: async (name) => {
    if (Platform.OS === "web") {
      const storage = getBrowserStorage();
      return storage ? storage.getItem(name) : (memoryStorage.get(name) ?? null);
    }

    try {
      return await AsyncStorage.getItem(name);
    } catch {
      return memoryStorage.get(name) ?? null;
    }
  },
  setItem: async (name, value) => {
    if (Platform.OS === "web") {
      const storage = getBrowserStorage();
      if (storage) {
        storage.setItem(name, value);
        memoryStorage.set(name, value);
        return;
      }

      memoryStorage.set(name, value);
      return;
    }

    try {
      await AsyncStorage.setItem(name, value);
      memoryStorage.set(name, value);
    } catch {
      memoryStorage.set(name, value);
    }
  },
  removeItem: async (name) => {
    if (Platform.OS === "web") {
      const storage = getBrowserStorage();
      if (storage) {
        storage.removeItem(name);
      }
      memoryStorage.delete(name);
      return;
    }

    try {
      await AsyncStorage.removeItem(name);
    } finally {
      memoryStorage.delete(name);
    }
  },
};
