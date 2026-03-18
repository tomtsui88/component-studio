export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // Node.js 22 exposes a stub `localStorage` global (via --localstorage-file)
    // that exists as an object but has no methods. Patch it with a working
    // in-memory implementation so SSR of client components doesn't crash.
    const ls = (globalThis as unknown as Record<string, unknown>).localStorage;
    if (ls && typeof (ls as Storage).getItem !== "function") {
      // localStorage is a read-only Proxy — replace the entire global
      const store: Record<string, string> = {};
      (globalThis as unknown as Record<string, unknown>).localStorage = {
        getItem: (k: string) => store[k] ?? null,
        setItem: (k: string, v: string) => {
          store[k] = v;
        },
        removeItem: (k: string) => {
          delete store[k];
        },
        clear: () => {
          for (const k in store) delete store[k];
        },
        key: (i: number) => Object.keys(store)[i] ?? null,
        get length() {
          return Object.keys(store).length;
        },
      };
    }
  }
}
