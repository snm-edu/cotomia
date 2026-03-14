function createRandomUUID() {
  const template = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";
  return template.replace(/[xy]/g, (char) => {
    const random = Math.floor(Math.random() * 16);
    const value = char === "x" ? random : ((random & 0x3) | 0x8);
    return value.toString(16);
  });
}

if (typeof window !== "undefined") {
  const scope = globalThis as typeof globalThis & {
    queueMicrotask?: (callback: VoidFunction) => void;
    structuredClone?: <T>(value: T) => T;
    ResizeObserver?: new (callback: ResizeObserverCallback) => ResizeObserver;
    crypto?: Crypto;
  };
  const mutableCrypto = (scope.crypto ?? {}) as Crypto & {
    randomUUID?: () => string;
    getRandomValues?: <T extends ArrayBufferView>(array: T) => T;
  };

  if (typeof scope.queueMicrotask !== "function") {
    scope.queueMicrotask = (callback) => {
      Promise.resolve().then(callback);
    };
  }

  if (typeof scope.structuredClone !== "function") {
    scope.structuredClone = <T,>(value: T) => JSON.parse(JSON.stringify(value)) as T;
  }

  if (typeof scope.ResizeObserver === "undefined") {
    scope.ResizeObserver = class ResizeObserverFallback {
      observe() {}
      unobserve() {}
      disconnect() {}
    } as typeof ResizeObserver;
  }

  if (!scope.crypto) {
    scope.crypto = mutableCrypto;
  }

  if (typeof mutableCrypto.getRandomValues !== "function") {
    mutableCrypto.getRandomValues = <T extends ArrayBufferView>(array: T) => {
      const view = new Uint8Array(array.buffer, array.byteOffset, array.byteLength);
      for (let index = 0; index < view.length; index += 1) {
        view[index] = Math.floor(Math.random() * 256);
      }
      return array;
    };
  }

  if (typeof mutableCrypto.randomUUID !== "function") {
    mutableCrypto.randomUUID = createRandomUUID as typeof mutableCrypto.randomUUID;
  }
}
