// src/lib/database/firebase-adapter.ts
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
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth'
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs,
  Timestamp
} from 'firebase/firestore'
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject,
  getBlob
} from 'firebase/storage'
import { auth, db, storage } from '../firebase-client'
import { adminDb, adminStorage } from '../firebase-server'

export class FirebaseAuthClient implements AuthClient {
  async signIn(email: string, password: string): Promise<AuthResult> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = await this.mapFirebaseUser(userCredential.user)
      return { user, error: null }
    } catch (error: any) {
      return { user: null, error }
    }
  }

  async signUp(email: string, password: string, metadata?: any): Promise<AuthResult> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = await this.mapFirebaseUser(userCredential.user)
      
      // Crear perfil de usuario en Firestore
      if (user) {
        await setDoc(doc(db, 'users', user.id), {
          email: user.email,
          name: metadata?.name || '',
          profilePicture: '',
          phone: '',
          company: '',
          role: 'user',
          isEmailVerified: user.isEmailVerified || false,
          lastLogin: new Date().toISOString(),
          preferences: {},
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
      }
      
      return { user, error: null }
    } catch (error: any) {
      return { user: null, error }
    }
  }

  async signOut(): Promise<void> {
    await firebaseSignOut(auth)
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    if (!auth.currentUser) return null
    return await this.mapFirebaseUser(auth.currentUser)
  }

  onAuthStateChanged(callback: (user: AuthUser | null) => void): () => void {
    return firebaseOnAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const user = await this.mapFirebaseUser(firebaseUser)
        callback(user)
      } else {
        callback(null)
      }
    })
  }

  async getToken(): Promise<string | null> {
    if (!auth.currentUser) return null
    return await auth.currentUser.getIdToken()
  }

  async refreshToken(): Promise<string | null> {
    if (!auth.currentUser) return null
    return await auth.currentUser.getIdToken(true)
  }

  private async mapFirebaseUser(firebaseUser: FirebaseUser): Promise<AuthUser> {
    // Obtener datos adicionales del perfil desde Firestore
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
    const userData = userDoc.data()

    return {
      id: firebaseUser.uid,
      email: firebaseUser.email || '',
      name: userData?.name || firebaseUser.displayName || '',
      profilePicture: userData?.profilePicture || firebaseUser.photoURL || '',
      phone: userData?.phone || '',
      company: userData?.company || '',
      role: userData?.role || 'user',
      isEmailVerified: firebaseUser.emailVerified,
      lastLogin: userData?.lastLogin ? new Date(userData.lastLogin) : new Date(),
      preferences: userData?.preferences || {},
      stripeCustomerId: userData?.stripeCustomerId || '',
      stripePriceId: userData?.stripePriceId || '',
      stripeSubscriptionId: userData?.stripeSubscriptionId || '',
      stripeSubscriptionStatus: userData?.stripeSubscriptionStatus || '',
      createdAt: userData?.createdAt ? new Date(userData.createdAt) : new Date(),
      updatedAt: userData?.updatedAt ? new Date(userData.updatedAt) : new Date()
    }
  }
}

export class FirebaseDatabaseOperations implements DatabaseOperations {
  // Usuarios
  async createUser(userData: Partial<AuthUser>): Promise<AuthUser> {
    const docRef = await addDoc(collection(db, 'users'), {
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
    
    return {
      id: docRef.id,
      email: userData.email || '',
      name: userData.name || '',
      profilePicture: userData.profilePicture || '',
      phone: userData.phone || '',
      company: userData.company || '',
      role: userData.role || 'user',
      isEmailVerified: userData.isEmailVerified || false,
      lastLogin: userData.lastLogin || new Date(),
      preferences: userData.preferences || {},
      stripeCustomerId: userData.stripeCustomerId || '',
      stripePriceId: userData.stripePriceId || '',
      stripeSubscriptionId: userData.stripeSubscriptionId || '',
      stripeSubscriptionStatus: userData.stripeSubscriptionStatus || '',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }

  async getUser(userId: string): Promise<AuthUser | null> {
    const docRef = doc(db, 'users', userId)
    const docSnap = await getDoc(docRef)
    
    if (!docSnap.exists()) return null
    
    const data = docSnap.data()
    return {
      id: docSnap.id,
      email: data.email || '',
      name: data.name || '',
      profilePicture: data.profilePicture || '',
      phone: data.phone || '',
      company: data.company || '',
      role: data.role || 'user',
      isEmailVerified: data.isEmailVerified || false,
      lastLogin: data.lastLogin ? new Date(data.lastLogin) : new Date(),
      preferences: data.preferences || {},
      stripeCustomerId: data.stripeCustomerId || '',
      stripePriceId: data.stripePriceId || '',
      stripeSubscriptionId: data.stripeSubscriptionId || '',
      stripeSubscriptionStatus: data.stripeSubscriptionStatus || '',
      createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date()
    }
  }

  async updateUser(userId: string, userData: Partial<AuthUser>): Promise<AuthUser> {
    const docRef = doc(db, 'users', userId)
    await updateDoc(docRef, {
      ...userData,
      updatedAt: new Date().toISOString()
    })
    
    const updatedUser = await this.getUser(userId)
    if (!updatedUser) throw new Error('User not found after update')
    return updatedUser
  }

  async deleteUser(userId: string): Promise<void> {
    const docRef = doc(db, 'users', userId)
    await deleteDoc(docRef)
  }

  // Acuerdos
  async createAgreement(agreementData: Partial<Agreement>): Promise<Agreement> {
    const docRef = await addDoc(collection(db, 'agreements'), {
      ...agreementData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    })
    
    return {
      id: docRef.id,
      title: agreementData.title || '',
      songTitle: agreementData.songTitle || '',
      description: agreementData.description || '',
      publicationDate: agreementData.publicationDate || new Date(),
      lastModified: new Date(),
      composers: agreementData.composers || [],
      status: agreementData.status || 'draft',
      type: agreementData.type || '',
      createdBy: agreementData.createdBy || '',
      signers: agreementData.signers || [],
      documentUrl: agreementData.documentUrl || '',
      metadata: agreementData.metadata || {},
      expiresAt: agreementData.expiresAt || new Date(),
      signedAt: agreementData.signedAt || new Date(),
      completedAt: agreementData.completedAt || new Date(),
      pdfUrl: agreementData.pdfUrl || '',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }

  async getAgreement(agreementId: string): Promise<Agreement | null> {
    const docRef = doc(db, 'agreements', agreementId)
    const docSnap = await getDoc(docRef)
    
    if (!docSnap.exists()) return null
    
    const data = docSnap.data()
    return this.mapFirestoreAgreement(docSnap.id, data)
  }

  async getAgreements(userId: string, filters?: AgreementFilters): Promise<Agreement[]> {
    let q = query(collection(db, 'agreements'), where('createdBy', '==', userId))
    
    if (filters?.status) {
      q = query(q, where('status', '==', filters.status))
    }
    
    if (filters?.type) {
      q = query(q, where('type', '==', filters.type))
    }
    
    q = query(q, orderBy('createdAt', 'desc'))
    
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => this.mapFirestoreAgreement(doc.id, doc.data()))
  }

  async updateAgreement(agreementId: string, agreementData: Partial<Agreement>): Promise<Agreement> {
    const docRef = doc(db, 'agreements', agreementId)
    await updateDoc(docRef, {
      ...agreementData,
      updatedAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    })
    
    const updatedAgreement = await this.getAgreement(agreementId)
    if (!updatedAgreement) throw new Error('Agreement not found after update')
    return updatedAgreement
  }

  async deleteAgreement(agreementId: string): Promise<void> {
    const docRef = doc(db, 'agreements', agreementId)
    await deleteDoc(docRef)
  }

  // Firmantes
  async updateSignerSignature(agreementId: string, signerId: string, signatureData: string): Promise<{ signedAt: string }> {
    const agreementRef = doc(db, 'agreements', agreementId)
    const agreementDoc = await getDoc(agreementRef)

    if (!agreementDoc.exists()) {
      throw new Error('Agreement not found.')
    }

    const agreementData = agreementDoc.data()
    const signers = agreementData?.signers || []
    
    const signerIndex = signers.findIndex((s: any) => s.id === signerId)

    if (signerIndex === -1) {
      throw new Error('Signer not found in this agreement.')
    }

    const signedAt = new Date().toISOString()
    signers[signerIndex].signed = true
    signers[signerIndex].signedAt = signedAt
    signers[signerIndex].signature = signatureData

    await updateDoc(agreementRef, { 
      signers,
      lastModified: signedAt,
      updatedAt: signedAt
    })

    return { signedAt }
  }

  async addSigner(agreementId: string, signerData: Partial<Signer>): Promise<Signer> {
    const agreementRef = doc(db, 'agreements', agreementId)
    const agreementDoc = await getDoc(agreementRef)

    if (!agreementDoc.exists()) {
      throw new Error('Agreement not found.')
    }

    const agreementData = agreementDoc.data()
    const signers = agreementData?.signers || []
    
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

    await updateDoc(agreementRef, { 
      signers,
      lastModified: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })

    return newSigner
  }

  async removeSigner(agreementId: string, signerId: string): Promise<void> {
    const agreementRef = doc(db, 'agreements', agreementId)
    const agreementDoc = await getDoc(agreementRef)

    if (!agreementDoc.exists()) {
      throw new Error('Agreement not found.')
    }

    const agreementData = agreementDoc.data()
    const signers = agreementData?.signers || []
    
    const filteredSigners = signers.filter((s: any) => s.id !== signerId)

    await updateDoc(agreementRef, { 
      signers: filteredSigners,
      lastModified: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
  }

  private mapFirestoreAgreement(id: string, data: any): Agreement {
    return {
      id,
      title: data.title || '',
      songTitle: data.songTitle || '',
      description: data.description || '',
      publicationDate: data.publicationDate ? new Date(data.publicationDate) : new Date(),
      lastModified: data.lastModified ? new Date(data.lastModified) : new Date(),
      composers: data.composers || [],
      status: data.status || 'draft',
      type: data.type || '',
      createdBy: data.createdBy || '',
      signers: data.signers || [],
      documentUrl: data.documentUrl || '',
      metadata: data.metadata || {},
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : new Date(),
      signedAt: data.signedAt ? new Date(data.signedAt) : new Date(),
      completedAt: data.completedAt ? new Date(data.completedAt) : new Date(),
      pdfUrl: data.pdfUrl || '',
      createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date()
    }
  }
}

export class FirebaseStorageClient implements StorageClient {
  async uploadFile(bucket: string, path: string, file: File | Buffer, options?: any): Promise<string> {
    const storageRef = ref(storage, `${bucket}/${path}`)
    await uploadBytes(storageRef, file, options)
    return await getDownloadURL(storageRef)
  }

  async downloadFile(bucket: string, path: string): Promise<Blob> {
    const storageRef = ref(storage, `${bucket}/${path}`)
    return await getBlob(storageRef)
  }

  async deleteFile(bucket: string, path: string): Promise<void> {
    const storageRef = ref(storage, `${bucket}/${path}`)
    await deleteObject(storageRef)
  }

  getPublicUrl(bucket: string, path: string): string {
    const storageRef = ref(storage, `${bucket}/${path}`)
    return `https://firebasestorage.googleapis.com/v0/b/${storage.app.options.storageBucket}/o/${encodeURIComponent(`${bucket}/${path}`)}?alt=media`
  }

  async getSignedUrl(bucket: string, path: string, expiresIn: number = 3600): Promise<string> {
    // Firebase Storage no tiene signed URLs nativas, usar public URL
    return this.getPublicUrl(bucket, path)
  }
}

export class FirebaseDatabaseClient implements DatabaseClient {
  public auth: AuthClient
  public db: DatabaseOperations
  public storage: StorageClient

  constructor() {
    this.auth = new FirebaseAuthClient()
    this.db = new FirebaseDatabaseOperations()
    this.storage = new FirebaseStorageClient()
  }
}
