import { createClient } from '@/lib/supabase';
import { GlitchConfig } from '@/types/glitch';

export async function saveCreation(userId: string, config: GlitchConfig, isPublic: boolean = false) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('creations')
    .insert({
      user_id: userId,
      config: config,
      is_public: isPublic,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  return { data, error };
}

export async function getUserCreations(userId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('creations')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  return { data, error };
}

export async function getPublicCreations(limit: number = 20) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('creations')
    .select('*')
    .eq('is_public', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  return { data, error };
}

export async function deleteCreation(creationId: string, userId: string) {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('creations')
    .delete()
    .eq('id', creationId)
    .eq('user_id', userId);

  return { error };
}

export async function updateCreation(creationId: string, userId: string, updates: { config?: GlitchConfig; is_public?: boolean }) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('creations')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', creationId)
    .eq('user_id', userId)
    .select()
    .single();

  return { data, error };
}
