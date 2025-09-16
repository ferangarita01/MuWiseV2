
import AgreementsClientPage from './AgreementsClientPage';

// This is now a simple wrapper component.
// All logic, including auth checks and data fetching, is handled in the Client Component.
export default function AgreementsPage() {
    return (
        <AgreementsClientPage />
    );
}
