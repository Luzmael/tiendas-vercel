import { supabase } from '@/lib/supabase-edge'; 
 
export default async (req) =
  const url = new URL(req.url); 
  const uuid = url.searchParams.get('uuid'); 
 
  const { data } = await supabase 
    .from('whatsapp_numbers') 
    .select('phone_number') 
    .eq('id', uuid) 
    .eq('is_active', true) 
    .single(); 
 
  return new Response(JSON.stringify(data), { 
    headers: { 'Cache-Control': 'no-store' } 
  }); 
}; 
