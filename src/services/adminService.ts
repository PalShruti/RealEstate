import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type Admin = Database['public']['Tables']['admins']['Row'];

export const adminService = {
  // Validate admin credentials
  async validateAdmin(email: string, password: string): Promise<Admin | null> {
    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .eq('email', email)
      .eq('password', password)
      .single();
    
    if (error || !data) {
      return null;
    }
    
    return data;
  }
};