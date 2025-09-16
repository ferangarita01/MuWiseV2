
import type { User, Composer } from '../types';

/**
 * Maps a User object to a Composer object for pre-filling forms.
 * @param user The user profile object.
 * @param sharePercentage Optional default share percentage.
 * @returns A Composer object.
 */
export function mapUserToComposer(user: User, sharePercentage?: number): Partial<Omit<Composer, 'share'>> & { share?: number, role: string, id: string, documentId: string } {
    
    // Role-based default share percentages
    const getRoleBasedShare = (role?: string): number => {
        switch (role?.toLowerCase()) {
            case 'producer':
                return 25;
            case 'composer':
                return 60;
            case 'lyricist':
                 return 40;
            default:
                return 50; // Default for other roles or if role is not defined
        }
    };

    return {
        id: crypto.randomUUID(),
        documentId: '', // Leave document ID blank for manual entry
        name: user.displayName || '',
        email: user.email || '',
        publisher: user.publisher || 'Self-published',
        ipiNumber: user.ipiNumber || '',
        role: user.primaryRole || 'Composer',
        share: sharePercentage ?? getRoleBasedShare(user.primaryRole),
        isRegisteredUser: true,
    };
}

/**
 * Creates default form data based on a user's profile.
 * This can be used to initialize a form state.
 * @param user The user profile object.
 * @returns An object with default form values.
 */
export function createFormDefaults(user: User) {
    const defaultComposer = mapUserToComposer(user, 100);

    return {
        songTitle: '',
        composers: [defaultComposer],
        // ... other form defaults
    };
}
