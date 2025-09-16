
import { AccountSecurityForm } from '@/components/account-security-form';
import { NotificationSettingsForm } from '@/components/notification-settings-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SettingsPage() {
    return (
        <div className="space-y-8">
            <AccountSecurityForm />
            <NotificationSettingsForm />

             <Card>
                <CardHeader>
                    <CardTitle>Privacy Settings</CardTitle>
                    <CardDescription>
                        Control your privacy and data sharing settings.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                     <div className="p-8 text-center text-muted-foreground">
                        Privacy settings form will be built here.
                    </div>
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle>Application Preferences</CardTitle>
                    <CardDescription>
                        Customize the application to your liking.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                     <div className="p-8 text-center text-muted-foreground">
                        Application preferences form will be built here.
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
