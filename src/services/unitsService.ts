
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type Unit = Database['public']['Tables']['units']['Row'];
type UnitInsert = Database['public']['Tables']['units']['Insert'];

export const unitsService = {
  // Fetch all units
  async getAllUnits() {
    const { data, error } = await supabase
      .from('units')
      .select('*')
      .order('floor', { ascending: true })
      .order('unit_number', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  // Add a new unit
  async addUnit(unit: Omit<UnitInsert, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('units')
      .insert(unit)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update unit
  async updateUnit(id: string, unit: Partial<Omit<UnitInsert, 'id' | 'created_at' | 'updated_at'>>) {
    // Sign in anonymously to get authenticated status for RLS
    const { error: authError } = await supabase.auth.signInAnonymously();
    if (authError) {
      console.error('Auth error:', authError);
    }

    const { data, error } = await supabase
      .from('units')
      .update({ ...unit, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update unit status
  async updateUnitStatus(id: string, status: string) {
    const { data, error } = await supabase
      .from('units')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete unit
  async deleteUnit(id: string) {
    // Sign in anonymously to get authenticated status for RLS
    const { error: authError } = await supabase.auth.signInAnonymously();
    if (authError) {
      console.error('Auth error:', authError);
    }

    const { error } = await supabase
      .from('units')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};
