'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, MailCheck, Smartphone, Laptop, LogOut, Trash2, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useUserProfile } from '@/hooks/useUserProfile';

const sessions = [
    { id: 1, browser: 'Chrome', os: 'macOS', location: 'Los Angeles, US', time: 'Current session', icon: Laptop },
    { id: 2, browser: 'Safari', os: 'iOS', location: 'Los Angeles, US', time: '2 hours ago', icon: Smartphone },
    { id: 3, browser: 'Firefox', os: 'Windows', location: 'New York, US', time: '1 day ago', icon: Laptop },
];


export function AccountSecurityForm() {
    const [is2faEnabled, setIs2faEnabled] = useState(false);
    const { userProfile, loading: profileLoading } = useUserProfile();

    if (profileLoading) {
      return (
        <Card>
          <CardHeader>
            <CardTitle>Account & Security</CardTitle>
            <CardDescription>
                Manage your password, email, security settings, and active sessions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Account & Security</CardTitle>
                <CardDescription>
                    Manage your password, email, security settings, and active sessions.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                {/* Password Section */}
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="flex items-center gap-4">
                        <Input id="password" type="password" value="••••••••••••••" readOnly className="flex-grow" />
                        <Button variant="outline">Change Password</Button>
                    </div>
                    <p className="text-xs text-muted-foreground">Last changed: 2 months ago</p>
                </div>

                <Separator />

                {/* Email Verification Section */}
                <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="flex items-center gap-4">
                        <div className="relative flex-grow">
                             <MailCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input id="email" type="email" value={userProfile?.email || ''} readOnly className="pl-10" />
                        </div>
                        <Badge variant="outline" className="text-green-600 border-green-500/50 bg-green-500/10">
                            <ShieldCheck className="mr-1 h-3 w-3" />
                            Verified
                        </Badge>
                    </div>
                </div>
                
                <Separator />

                {/* Two-Factor Authentication Section */}
                <div className="space-y-2">
                    <Label>Two-Factor Authentication (2FA)</Label>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                            <p className="font-medium">{is2faEnabled ? 'Enabled' : 'Disabled'}</p>
                            <p className="text-sm text-muted-foreground">Add an extra layer of security to your account.</p>
                        </div>
                        <Switch
                            checked={is2faEnabled}
                            onCheckedChange={setIs2faEnabled}
                            aria-label="Toggle Two-Factor Authentication"
                        />
                    </div>
                </div>

                <Separator />
                
                {/* Active Sessions Section */}
                <div className="space-y-4">
                     <Label>Active Sessions</Label>
                     <div className="space-y-4">
                        {sessions.map(session => (
                             <div key={session.id} className="flex items-center justify-between">
                                 <div className="flex items-center gap-3">
                                     <session.icon className="h-5 w-5 text-muted-foreground" />
                                     <div>
                                         <p className="font-medium">{session.browser} on {session.os}</p>
                                         <p className="text-sm text-muted-foreground">{session.location} - <span className={session.time === 'Current session' ? 'text-green-500 font-semibold' : ''}>{session.time}</span></p>
                                     </div>
                                 </div>
                                 {session.time !== 'Current session' && (
                                     <Button variant="ghost" size="sm">
                                         <LogOut className="mr-2 h-4 w-4" />
                                         Sign Out
                                     </Button>
                                 )}
                            </div>
                        ))}
                     </div>
                     <div className="flex justify-end pt-2">
                         <Button variant="outline">Sign Out All Other Devices</Button>
                     </div>
                </div>
                
                <Separator />

                {/* Account Deletion Section */}
                 <div className="space-y-2 p-4 border border-destructive/50 rounded-lg bg-destructive/5">
                    <h4 className="font-semibold text-destructive">Delete Account</h4>
                    <p className="text-sm text-destructive/90">
                        Permanently delete your account and all associated data. This action is irreversible.
                    </p>
                    <div className="pt-2">
                        <Button variant="destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete My Account
                        </Button>
                    </div>
                </div>

            </CardContent>
        </Card>
    );
}