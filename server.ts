// src/services/bungalowsService.ts
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();
// ✅ Supabase client initialization
const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_ANON_KEY as string
);

export interface Bungalow {
  id?: string;
  plot_number: string;
  type: string;
  size_sqft: number;
  price: number;
  status: "Available" | "Booked" | "Sold";
  created_at?: string;
}

export const bungalowsService = {
  // ✅ Get all bungalows
  async getAllBungalows(): Promise<Bungalow[]> {
    const { data, error } = await supabase
      .from("bungalows")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as Bungalow[];
  },

  // ✅ Add a new bungalow
  async addBungalow(bungalow: Bungalow): Promise<Bungalow> {
    const { data, error } = await supabase
      .from("bungalows")
      .insert([bungalow])
      .select()
      .single();

    if (error) throw error;
    return data as Bungalow;
  },

  // ✅ Update bungalow by ID
  async updateBungalow(id: string, bungalow: Partial<Bungalow>): Promise<Bungalow> {
    const { data, error } = await supabase
      .from("bungalows")
      .update(bungalow)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Bungalow;
  },

  // ✅ Delete bungalow by ID
  async deleteBungalow(id: string): Promise<void> {
    const { error } = await supabase
      .from("bungalows")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },
};