
import { 
    GoogleAuthProvider, 
    signInWithPopup, 
    User,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updateProfile,
    type UserCredential,
    signOut,
    onAuthStateChanged,
    connectAuthEmulator,
    signInWithRedirect,
    getRedirectResult,
    Auth 
} from 'firebase/auth';
import { auth } from './firebase-client'; // Use client-side auth
import { db } from './firebase-client'; // Use client-side db for writes
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

if (typeof window !== 'undefined' && window.location.hostname === "localhost") {
  connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
}

export type EmailPasswordCredentials = {
    email: string;
    password: string;
}

export type ProfileData = {
  fullName: string;
  artistName?: string;
  primaryRole?: string;
  genres?: string[];
  publisher?: string;
  proSociety?: string;
  ipiNumber?: string;
  photoURL?: string;
  phone?: string;
  locationCountry?: string;
  locationState?: string;
  locationCity?: string;
  experienceLevel?: 'beginner' | 'intermediate' | 'professional';
  bio?: string;
  website?: string;
};


export type SignUpDetails = {
  fullName: string;
  email: string;
  password: string;
  artistName?: string;
  primaryRole?: string;
  genres?: string;
  publisher?: string;
  proSociety?: string;
  ipiNumber?: string;
};

export interface AuthResult {
  success: boolean;
  user?: any;
  error?: string;
  errorCode?: string;
}


export const signInWithEmail = async ({ email, password }: EmailPasswordCredentials): Promise<User | null> => {
    try {
        const result: UserCredential = await signInWithEmailAndPassword(auth, email, password);
        return result.user;
    } catch (error) {
        console.error('Error signing in with email and password', error);
        throw error;
    }
};

export const signUpWithEmail = async (details: SignUpDetails): Promise<User | null> => {
    const { email, password, fullName, ...profileData } = details;
    try {
        const result: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = result.user;
        if (user) {
            await updateProfile(user, {
                displayName: fullName
            });

            // Convert genres string to array
            const genresArray = profileData.genres ? profileData.genres.split(',').map(g => g.trim()).filter(Boolean) : [];

            // Save user to Firestore
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                displayName: fullName,
                email: user.email,
                createdAt: new Date().toISOString(),
                ...profileData, // Save all other optional fields
                genres: genresArray,
                agreementCount: 0, // Initialize counter
                planId: 'free', // Default to free plan
            });
        }
        return user;
    } catch (error) {
        console.error('Error signing up with email and password', error);
        throw error;
    }
};

export async function updateUserProfile(user: User, profileData: Partial<ProfileData>) {
    const { fullName, photoURL, ...firestoreData } = profileData;

    // Update Firebase Auth profile
    const authUpdatePayload: {displayName?: string, photoURL?: string} = {};
    if (fullName) authUpdatePayload.displayName = fullName;
    if (photoURL) authUpdatePayload.photoURL = photoURL;

    if (Object.keys(authUpdatePayload).length > 0) {
        await updateProfile(user, authUpdatePayload);
    }
    
    // Create a new object for Firestore with all the data
    const firestoreUpdateData: any = { ...firestoreData };
    if (fullName) firestoreUpdateData.displayName = fullName;
    if (photoURL) firestoreUpdateData.photoURL = photoURL;
    if (profileData.primaryRole) firestoreUpdateData.primaryRole = profileData.primaryRole;


    // Update Firestore document
    const userDocRef = doc(db, "users", user.uid);
    await updateDoc(userDocRef, firestoreUpdateData);
}

const upsertUserInFirestore = async (user: User) => {
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) {
        await setDoc(userDocRef, {
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            createdAt: new Date().toISOString(),
            agreementCount: 0, // Initialize counter
            planId: 'free', // Default to free plan
        });
    }
};


export const signInWithGoogle = async (): Promise<AuthResult> => {
  const provider = new GoogleAuthProvider();
  
  try {
    const result = await signInWithPopup(auth, provider);
    await upsertUserInFirestore(result.user);
    return { 
      success: true, 
      user: result.user 
    };
  } catch (error: any) {
    console.error('Google sign-in error:', error);
    
    // Manejar diferentes tipos de errores
    switch (error.code) {
      case 'auth/cancelled-popup-request':
        return { 
          success: false, 
          error: 'Inicio de sesión cancelado',
          errorCode: error.code 
        };
      
      case 'auth/popup-closed-by-user':
        return { 
          success: false, 
          error: 'Ventana de inicio de sesión cerrada',
          errorCode: error.code 
        };
      
      case 'auth/popup-blocked':
        return { 
          success: false, 
          error: 'Por favor permite las ventanas emergentes para este sitio',
          errorCode: error.code 
        };
      
      case 'auth/network-request-failed':
        return { 
          success: false, 
          error: 'Error de conexión. Verifica tu internet',
          errorCode: error.code 
        };
      
      case 'auth/too-many-requests':
        return { 
          success: false, 
          error: 'Demasiados intentos. Intenta más tarde',
          errorCode: error.code 
        };
      
      default:
        return { 
          success: false, 
          error: 'Error inesperado durante el inicio de sesión',
          errorCode: error.code 
        };
    }
  }
};

// Alternativa con redirect para casos problemáticos
export const signInWithGoogleRedirect = async (authInstance: Auth): Promise<void> => {
  const provider = new GoogleAuthProvider();
  
  try {
    await signInWithRedirect(authInstance, provider);
  } catch (error: any) {
    console.error('Google redirect sign-in error:', error);
    throw error;
  }
};

// Verificar resultado del redirect
export const checkRedirectResult = async (authInstance: Auth): Promise<AuthResult> => {
  try {
    const result = await getRedirectResult(authInstance);
    
    if (result) {
      await upsertUserInFirestore(result.user);
      return { 
        success: true, 
        user: result.user 
      };
    }
    
    return { success: false };
  } catch (error: any) {
    console.error('Redirect result error:', error);
    return { 
      success: false, 
      error: error.message,
      errorCode: error.code 
    };
  }
};


export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Sign Out Error:", error);
    throw error;
  }
};

// Function to get the current user on the server
export const getAuthenticatedUser = (): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    }, reject);
  });
};

export { auth };
