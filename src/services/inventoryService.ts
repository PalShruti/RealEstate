
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type Inventory = Database['public']['Tables']['inventory']['Row'];

export const inventoryService = {
  // Fetch all inventory
  async getAllInventory() {
    const { data, error } = await supabase
      .from('inventory')
      .select('*')
      .order('floor', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  // Get inventory by BHK type
  async getInventoryByBHK(bhkType: string) {
    const { data, error } = await supabase
      .from('inventory')
      .select('*')
      .eq('bhk_type', bhkType)
      .order('floor', { ascending: true });
    
    if (error) throw error;
    return data;
  }
};
