// src/lib/supabase-client.ts
import { createClient } from '@supabase/supabase-js'
import { createClientComponentClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Cliente para uso en componentes del cliente
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Cliente para uso en componentes del servidor
export const createServerSupabaseClient = () => {
  return createServerComponentClient({ cookies })
}

// Cliente para uso en componentes del cliente (React)
export const createClientSupabaseClient = () => {
  return createClientComponentClient()
}

// Cliente admin para operaciones del servidor (con service role key)
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Tipos de base de datos (se generarán automáticamente)
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          profile_picture: string | null
          phone: string | null
          company: string | null
          role: string
          is_email_verified: boolean
          last_login: string | null
          preferences: any
          stripe_customer_id: string | null
          stripe_price_id: string | null
          stripe_subscription_id: string | null
          stripe_subscription_status: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          profile_picture?: string | null
          phone?: string | null
          company?: string | null
          role?: string
          is_email_verified?: boolean
          last_login?: string | null
          preferences?: any
          stripe_customer_id?: string | null
          stripe_price_id?: string | null
          stripe_subscription_id?: string | null
          stripe_subscription_status?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          profile_picture?: string | null
          phone?: string | null
          company?: string | null
          role?: string
          is_email_verified?: boolean
          last_login?: string | null
          preferences?: any
          stripe_customer_id?: string | null
          stripe_price_id?: string | null
          stripe_subscription_id?: string | null
          stripe_subscription_status?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      agreements: {
        Row: {
          id: string
          title: string
          song_title: string | null
          description: string | null
          publication_date: string | null
          last_modified: string
          composers: any
          status: string
          type: string
          created_by: string
          signers: any
          document_url: string | null
          metadata: any
          expires_at: string | null
          signed_at: string | null
          completed_at: string | null
          pdf_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          song_title?: string | null
          description?: string | null
          publication_date?: string | null
          last_modified?: string
          composers?: any
          status?: string
          type: string
          created_by: string
          signers?: any
          document_url?: string | null
          metadata?: any
          expires_at?: string | null
          signed_at?: string | null
          completed_at?: string | null
          pdf_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          song_title?: string | null
          description?: string | null
          publication_date?: string | null
          last_modified?: string
          composers?: any
          status?: string
          type?: string
          created_by?: string
          signers?: any
          document_url?: string | null
          metadata?: any
          expires_at?: string | null
          signed_at?: string | null
          completed_at?: string | null
          pdf_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
