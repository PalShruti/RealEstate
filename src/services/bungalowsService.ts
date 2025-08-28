// src/bungalowsService.ts
export type Bungalow = {
  id: string;
  plot_number: string;
  type: string;
  size_sqft: number;
  price: number;
  status: "Available" | "Booked" | "Sold";
  created_at?: string;
  updated_at?: string;
};

const STORAGE_KEY = "bungalows";

// Load from localStorage
function loadBungalows(): Bungalow[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

// Save to localStorage
function saveBungalows(bungalows: Bungalow[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bungalows));
}

// keep it in-memory but synced with localStorage
let bungalows: Bungalow[] = loadBungalows();

export const bungalowsService = {
  async getAllBungalows(): Promise<Bungalow[]> {
    return bungalows;
  },

  async addBungalow(input: Omit<Bungalow, "id" | "created_at" | "updated_at">) {
    const newBungalow: Bungalow = {
      ...input,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    bungalows.push(newBungalow);
    saveBungalows(bungalows);
    return newBungalow;
  },

  async updateBungalow(id: string, updates: Partial<Bungalow>) {
    const index = bungalows.findIndex((b) => b.id === id);
    if (index === -1) throw new Error("Bungalow not found");

    bungalows[index] = {
      ...bungalows[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    saveBungalows(bungalows);
    return bungalows[index];
  },

  async deleteBungalow(id: string) {
    const index = bungalows.findIndex((b) => b.id === id);
    if (index === -1) throw new Error("Bungalow not found");

    bungalows.splice(index, 1);
    saveBungalows(bungalows);
    return true;
  },
};