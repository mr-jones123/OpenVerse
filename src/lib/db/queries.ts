import { createClient } from "@/lib/db/server"
import { Aral } from "../types"

export async function getAllResources(): Promise<Aral[]> {
    const supabase = await createClient()
    try{
       const { data, error } = await supabase
      .from('resource')
      .select('*')
      .order('source_name', { ascending: true })

      if (error) {
        console.error('Supabase error:', error)
        throw new Error('Failed to fetch resources')
      }
      return data || []
    } catch (error) {
           console.error('Supabase error:', error)
      throw new Error('Failed to fetch resources')
    }
  }

