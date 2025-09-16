// src/lib/database/supabase-adapter.ts
import { 
  DatabaseClient, 
  AuthClient, 
  DatabaseOperations, 
  StorageClient,
  AuthUser,
  Agreement,
  Signer,
  AuthResult,
  CreateAgreementData,
  UpdateAgreementData,
  SignAgreementData,
  AgreementFilters,
  PaginationOptions
} from './types'
import { supabase, supabaseAdmin } from '../supabase-client'
import { User as SupabaseUser, Session } from '@supabase/supabase-js'

export class SupabaseAuthClient implements AuthClient {
  async signIn(email: string, password: string): Promise<AuthResult> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        return { user: null, error }
      }
      
      const user = await this.mapSupabaseUser(data.user)
      return { user, error: null, session: data.session }
    } catch (error: any) {
      return { user: null, error }
    }
  }

  async signUp(email: string, password: string, metadata?: any): Promise<AuthResult> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      })
      
      if (error) {
        return { user: null, error }
      }
      
      const user = await this.mapSupabaseUser(data.user)
      return { user, error: null, session: data.session }
    } catch (error: any) {
      return { user: null, error }
    }
  }

  async signOut(): Promise<void> {
    await supabase.auth.signOut()
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null
    return await this.mapSupabaseUser(user)
  }

  onAuthStateChanged(callback: (user: AuthUser | null) => void): () => void {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const user = await this.mapSupabaseUser(session.user)
          callback(user)
        } else {
          callback(null)
        }
      }
    )
    
    return () => subscription.unsubscribe()
  }

  async getToken(): Promise<string | null> {
    const { data: { session } } = await supabase.auth.getSession()
    return session?.access_token || null
  }

  async refreshToken(): Promise<string | null> {
    const { data: { session } } = await supabase.auth.refreshSession()
    return session?.access_token || null
  }

  private async mapSupabaseUser(supabaseUser: SupabaseUser): Promise<AuthUser> {
    // Obtener datos adicionales del perfil desde la tabla users
    const { data: userData } = await supabase
      .from('users')
      .select('*')
      .eq('id', supabaseUser.id)
      .single()

    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      name: userData?.name || supabaseUser.user_metadata?.name || '',
      profilePicture: userData?.profile_picture || supabaseUser.user_metadata?.avatar_url || '',
      phone: userData?.phone || '',
      company: userData?.company || '',
      role: userData?.role || 'user',
      isEmailVerified: supabaseUser.email_confirmed_at ? true : false,
      lastLogin: userData?.last_login ? new Date(userData.last_login) : new Date(),
      preferences: userData?.preferences || {},
      stripeCustomerId: userData?.stripe_customer_id || '',
      stripePriceId: userData?.stripe_price_id || '',
      stripeSubscriptionId: userData?.stripe_subscription_id || '',
      stripeSubscriptionStatus: userData?.stripe_subscription_status || '',
      createdAt: userData?.created_at ? new Date(userData.created_at) : new Date(),
      updatedAt: userData?.updated_at ? new Date(userData.updated_at) : new Date()
    }
  }
}

export class SupabaseDatabaseOperations implements DatabaseOperations {
  // Usuarios
  async createUser(userData: Partial<AuthUser>): Promise<AuthUser> {
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert({
        id: userData.id,
        email: userData.email,
        name: userData.name,
        profile_picture: userData.profilePicture,
        phone: userData.phone,
        company: userData.company,
        role: userData.role || 'user',
        is_email_verified: userData.isEmailVerified || false,
        last_login: userData.lastLogin?.toISOString(),
        preferences: userData.preferences || {},
        stripe_customer_id: userData.stripeCustomerId,
        stripe_price_id: userData.stripePriceId,
        stripe_subscription_id: userData.stripeSubscriptionId,
        stripe_subscription_status: userData.stripeSubscriptionStatus,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error
    return this.mapSupabaseUser(data)
  }

  async getUser(userId: string): Promise<AuthUser | null> {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error || !data) return null
    return this.mapSupabaseUser(data)
  }

  async updateUser(userId: string, userData: Partial<AuthUser>): Promise<AuthUser> {
    const { data, error } = await supabaseAdmin
      .from('users')
      .update({
        email: userData.email,
        name: userData.name,
        profile_picture: userData.profilePicture,
        phone: userData.phone,
        company: userData.company,
        role: userData.role,
        is_email_verified: userData.isEmailVerified,
        last_login: userData.lastLogin?.toISOString(),
        preferences: userData.preferences,
        stripe_customer_id: userData.stripeCustomerId,
        stripe_price_id: userData.stripePriceId,
        stripe_subscription_id: userData.stripeSubscriptionId,
        stripe_subscription_status: userData.stripeSubscriptionStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    return this.mapSupabaseUser(data)
  }

  async deleteUser(userId: string): Promise<void> {
    const { error } = await supabaseAdmin
      .from('users')
      .delete()
      .eq('id', userId)

    if (error) throw error
  }

  // Acuerdos
  async createAgreement(agreementData: Partial<Agreement>): Promise<Agreement> {
    const { data, error } = await supabaseAdmin
      .from('agreements')
      .insert({
        title: agreementData.title,
        song_title: agreementData.songTitle,
        description: agreementData.description,
        publication_date: agreementData.publicationDate?.toISOString(),
        last_modified: new Date().toISOString(),
        composers: agreementData.composers || [],
        status: agreementData.status || 'draft',
        type: agreementData.type,
        created_by: agreementData.createdBy,
        signers: agreementData.signers || [],
        document_url: agreementData.documentUrl,
        metadata: agreementData.metadata || {},
        expires_at: agreementData.expiresAt?.toISOString(),
        signed_at: agreementData.signedAt?.toISOString(),
        completed_at: agreementData.completedAt?.toISOString(),
        pdf_url: agreementData.pdfUrl,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error
    return this.mapSupabaseAgreement(data)
  }

  async getAgreement(agreementId: string): Promise<Agreement | null> {
    const { data, error } = await supabaseAdmin
      .from('agreements')
      .select('*')
      .eq('id', agreementId)
      .single()

    if (error || !data) return null
    return this.mapSupabaseAgreement(data)
  }

  async getAgreements(userId: string, filters?: AgreementFilters): Promise<Agreement[]> {
    let query = supabaseAdmin
      .from('agreements')
      .select('*')
      .eq('created_by', userId)

    if (filters?.status) {
      query = query.eq('status', filters.status)
    }

    if (filters?.type) {
      query = query.eq('type', filters.type)
    }

    if (filters?.dateFrom) {
      query = query.gte('created_at', filters.dateFrom.toISOString())
    }

    if (filters?.dateTo) {
      query = query.lte('created_at', filters.dateTo.toISOString())
    }

    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
    }

    query = query.order('created_at', { ascending: false })

    const { data, error } = await query

    if (error) throw error
    return data.map(item => this.mapSupabaseAgreement(item))
  }

  async updateAgreement(agreementId: string, agreementData: Partial<Agreement>): Promise<Agreement> {
    const { data, error } = await supabaseAdmin
      .from('agreements')
      .update({
        title: agreementData.title,
        song_title: agreementData.songTitle,
        description: agreementData.description,
        publication_date: agreementData.publicationDate?.toISOString(),
        last_modified: new Date().toISOString(),
        composers: agreementData.composers,
        status: agreementData.status,
        type: agreementData.type,
        created_by: agreementData.createdBy,
        signers: agreementData.signers,
        document_url: agreementData.documentUrl,
        metadata: agreementData.metadata,
        expires_at: agreementData.expiresAt?.toISOString(),
        signed_at: agreementData.signedAt?.toISOString(),
        completed_at: agreementData.completedAt?.toISOString(),
        pdf_url: agreementData.pdfUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', agreementId)
      .select()
      .single()

    if (error) throw error
    return this.mapSupabaseAgreement(data)
  }

  async deleteAgreement(agreementId: string): Promise<void> {
    const { error } = await supabaseAdmin
      .from('agreements')
      .delete()
      .eq('id', agreementId)

    if (error) throw error
  }

  // Firmantes
  async updateSignerSignature(agreementId: string, signerId: string, signatureData: string): Promise<{ signedAt: string }> {
    const { data: agreement, error: fetchError } = await supabaseAdmin
      .from('agreements')
      .select('*')
      .eq('id', agreementId)
      .single()

    if (fetchError || !agreement) {
      throw new Error('Agreement not found.')
    }

    const signers = agreement.signers || []
    const signerIndex = signers.findIndex((s: any) => s.id === signerId)

    if (signerIndex === -1) {
      throw new Error('Signer not found in this agreement.')
    }

    const signedAt = new Date().toISOString()
    signers[signerIndex].signed = true
    signers[signerIndex].signedAt = signedAt
    signers[signerIndex].signature = signatureData

    const { error: updateError } = await supabaseAdmin
      .from('agreements')
      .update({ 
        signers,
        last_modified: signedAt,
        updated_at: signedAt
      })
      .eq('id', agreementId)

    if (updateError) {
      throw new Error(`Failed to update agreement: ${updateError.message}`)
    }

    return { signedAt }
  }

  async addSigner(agreementId: string, signerData: Partial<Signer>): Promise<Signer> {
    const { data: agreement, error: fetchError } = await supabaseAdmin
      .from('agreements')
      .select('*')
      .eq('id', agreementId)
      .single()

    if (fetchError || !agreement) {
      throw new Error('Agreement not found.')
    }

    const signers = agreement.signers || []
    
    const newSigner: Signer = {
      id: `signer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId: signerData.userId || '',
      email: signerData.email || '',
      name: signerData.name || '',
      role: signerData.role || 'signer',
      status: 'pending',
      order: signers.length + 1
    }

    signers.push(newSigner)

    const { error: updateError } = await supabaseAdmin
      .from('agreements')
      .update({ 
        signers,
        last_modified: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', agreementId)

    if (updateError) {
      throw new Error(`Failed to update agreement: ${updateError.message}`)
    }

    return newSigner
  }

  async removeSigner(agreementId: string, signerId: string): Promise<void> {
    const { data: agreement, error: fetchError } = await supabaseAdmin
      .from('agreements')
      .select('*')
      .eq('id', agreementId)
      .single()

    if (fetchError || !agreement) {
      throw new Error('Agreement not found.')
    }

    const signers = agreement.signers || []
    const filteredSigners = signers.filter((s: any) => s.id !== signerId)

    const { error: updateError } = await supabaseAdmin
      .from('agreements')
      .update({ 
        signers: filteredSigners,
        last_modified: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', agreementId)

    if (updateError) {
      throw new Error(`Failed to update agreement: ${updateError.message}`)
    }
  }

  private mapSupabaseUser(data: any): AuthUser {
    return {
      id: data.id,
      email: data.email || '',
      name: data.name || '',
      profilePicture: data.profile_picture || '',
      phone: data.phone || '',
      company: data.company || '',
      role: data.role || 'user',
      isEmailVerified: data.is_email_verified || false,
      lastLogin: data.last_login ? new Date(data.last_login) : new Date(),
      preferences: data.preferences || {},
      stripeCustomerId: data.stripe_customer_id || '',
      stripePriceId: data.stripe_price_id || '',
      stripeSubscriptionId: data.stripe_subscription_id || '',
      stripeSubscriptionStatus: data.stripe_subscription_status || '',
      createdAt: data.created_at ? new Date(data.created_at) : new Date(),
      updatedAt: data.updated_at ? new Date(data.updated_at) : new Date()
    }
  }

  private mapSupabaseAgreement(data: any): Agreement {
    return {
      id: data.id,
      title: data.title || '',
      songTitle: data.song_title || '',
      description: data.description || '',
      publicationDate: data.publication_date ? new Date(data.publication_date) : new Date(),
      lastModified: data.last_modified ? new Date(data.last_modified) : new Date(),
      composers: data.composers || [],
      status: data.status || 'draft',
      type: data.type || '',
      createdBy: data.created_by || '',
      signers: data.signers || [],
      documentUrl: data.document_url || '',
      metadata: data.metadata || {},
      expiresAt: data.expires_at ? new Date(data.expires_at) : new Date(),
      signedAt: data.signed_at ? new Date(data.signed_at) : new Date(),
      completedAt: data.completed_at ? new Date(data.completed_at) : new Date(),
      pdfUrl: data.pdf_url || '',
      createdAt: data.created_at ? new Date(data.created_at) : new Date(),
      updatedAt: data.updated_at ? new Date(data.updated_at) : new Date()
    }
  }
}

export class SupabaseStorageClient implements StorageClient {
  async uploadFile(bucket: string, path: string, file: File | Buffer, options?: any): Promise<string> {
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .upload(path, file, {
        contentType: options?.contentType,
        upsert: options?.upsert || false
      })

    if (error) throw error

    const { data: { publicUrl } } = supabaseAdmin.storage
      .from(bucket)
      .getPublicUrl(path)

    return publicUrl
  }

  async downloadFile(bucket: string, path: string): Promise<Blob> {
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .download(path)

    if (error) throw error
    return data
  }

  async deleteFile(bucket: string, path: string): Promise<void> {
    const { error } = await supabaseAdmin.storage
      .from(bucket)
      .remove([path])

    if (error) throw error
  }

  getPublicUrl(bucket: string, path: string): string {
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from(bucket)
      .getPublicUrl(path)

    return publicUrl
  }

  async getSignedUrl(bucket: string, path: string, expiresIn: number = 3600): Promise<string> {
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn)

    if (error) throw error
    return data.signedUrl
  }
}

export class SupabaseDatabaseClient implements DatabaseClient {
  public auth: AuthClient
  public db: DatabaseOperations
  public storage: StorageClient

  constructor() {
    this.auth = new SupabaseAuthClient()
    this.db = new SupabaseDatabaseOperations()
    this.storage = new SupabaseStorageClient()
  }
}
