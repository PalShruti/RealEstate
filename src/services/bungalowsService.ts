// src/services/bungalowsService.ts
import { supabase } from '@/lib/supabaseClient';

export interface Bungalow {
  id?: string;
  plot_number: string;
  type: string;
  size_sqft: number;
  price: number;
  status: 'Available' | 'Booked' | 'Sold';
  created_at?: string;
}

export const bungalowsService = {
  async getAllBungalows(): Promise<Bungalow[]> {
    const { data, error } = await supabase
      .from('bungalows')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data as Bungalow[];
  },

  async addBungalow(bungalow: Omit<Bungalow, 'id' | 'created_at'>): Promise<Bungalow> {
    const payload = {
      ...bungalow,
      size_sqft: Number(bungalow.size_sqft),
      price: Number(bungalow.price),
    };
    const { data, error } = await supabase
      .from('bungalows')
      .insert(payload)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as Bungalow;
  },

  async updateBungalow(id: string, patch: Partial<Bungalow>): Promise<Bungalow> {
    const { data, error } = await supabase
      .from('bungalows')
      .update(patch)
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as Bungalow;
  },

  async deleteBungalow(id: string): Promise<void> {
    const { error } = await supabase.from('bungalows').delete().eq('id', id);
    if (error) throw new Error(error.message);
  },
};
