// src/lib/database/factory.ts
import { DatabaseClient } from './types'
import { FirebaseDatabaseClient } from './firebase-adapter'
import { SupabaseDatabaseClient } from './supabase-adapter'

// Singleton para mantener una instancia única del cliente de base de datos
class DatabaseClientFactory {
  private static instance: DatabaseClient | null = null
  private static currentProvider: 'firebase' | 'supabase' | null = null

  /**
   * Obtiene la instancia del cliente de base de datos
   * Si no existe o el proveedor ha cambiado, crea una nueva instancia
   */
  public static getInstance(): DatabaseClient {
    const useSupabase = process.env.USE_SUPABASE === 'true'
    const provider = useSupabase ? 'supabase' : 'firebase'

    // Si no hay instancia o el proveedor ha cambiado, crear nueva instancia
    if (!this.instance || this.currentProvider !== provider) {
      this.currentProvider = provider
      
      if (useSupabase) {
        console.log('[DatabaseFactory] Creating Supabase client')
        this.instance = new SupabaseDatabaseClient()
      } else {
        console.log('[DatabaseFactory] Creating Firebase client')
        this.instance = new FirebaseDatabaseClient()
      }
    }

    return this.instance
  }

  /**
   * Fuerza la recreación de la instancia del cliente
   * Útil para cambios dinámicos de configuración
   */
  public static resetInstance(): void {
    this.instance = null
    this.currentProvider = null
  }

  /**
   * Obtiene el proveedor actual
   */
  public static getCurrentProvider(): 'firebase' | 'supabase' {
    return this.currentProvider || (process.env.USE_SUPABASE === 'true' ? 'supabase' : 'firebase')
  }

  /**
   * Verifica si el proveedor actual es Supabase
   */
  public static isUsingSupabase(): boolean {
    return this.getCurrentProvider() === 'supabase'
  }

  /**
   * Verifica si el proveedor actual es Firebase
   */
  public static isUsingFirebase(): boolean {
    return this.getCurrentProvider() === 'firebase'
  }
}

// Función de conveniencia para obtener el cliente
export function createDatabaseClient(): DatabaseClient {
  return DatabaseClientFactory.getInstance()
}

// Función de conveniencia para obtener el proveedor actual
export function getCurrentDatabaseProvider(): 'firebase' | 'supabase' {
  return DatabaseClientFactory.getCurrentProvider()
}

// Función de conveniencia para verificar si se está usando Supabase
export function isUsingSupabase(): boolean {
  return DatabaseClientFactory.isUsingSupabase()
}

// Función de conveniencia para verificar si se está usando Firebase
export function isUsingFirebase(): boolean {
  return DatabaseClientFactory.isUsingFirebase()
}

// Función para resetear la instancia (útil en tests o cambios dinámicos)
export function resetDatabaseClient(): void {
  DatabaseClientFactory.resetInstance()
}

// Exportar la clase factory para uso avanzado
export { DatabaseClientFactory }

// Exportar el cliente por defecto
export const db = createDatabaseClient()
