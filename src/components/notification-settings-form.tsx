
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Bell, Mail, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const emailNotifications = [
    { id: 'email-agreements', label: 'New songwriter split agreements', defaultChecked: true },
    { id: 'email-signatures', label: 'Signature requests from collaborators', defaultChecked: true },
    { id: 'email-updates', label: 'Agreement status updates', defaultChecked: true },
    { id: 'email-completed', label: 'When all parties have signed an agreement', defaultChecked: true },
    { id: 'email-collabs', label: 'Collaboration invitations', defaultChecked: false },
    { id: 'email-marketing', label: 'Marketing and product updates', defaultChecked: false },
];

const inAppNotifications = [
    { id: 'inapp-push', label: 'Browser push notifications', defaultChecked: true },
    { id: 'inapp-sound', label: 'Sound alerts for important actions', defaultChecked: true },
    { id: 'inapp-reminders', label: 'Email reminders for pending signatures', defaultChecked: false },
];


export function NotificationSettingsForm() {
    const { toast } = useToast();
    
    const handleSettingChange = (setting: string, value: string | boolean) => {
        console.log('Setting changed:', { setting, value });
        toast({
            title: 'Settings Saved',
            description: 'Your notification preferences have been updated.',
        });
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                    Choose how you want to be notified about activity on Muwise.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">

                {/* Email Notifications Section */}
                <div className="space-y-4">
                    <div className='flex items-center gap-2'>
                        <Mail className="h-5 w-5 text-muted-foreground" />
                        <Label className="text-base font-semibold">Email Notifications</Label>
                    </div>
                    <div className="space-y-3 pl-7">
                        {emailNotifications.map(item => (
                             <div key={item.id} className="flex items-center justify-between">
                                <Label htmlFor={item.id} className="font-normal text-muted-foreground">{item.label}</Label>
                                <Switch 
                                    id={item.id} 
                                    defaultChecked={item.defaultChecked} 
                                    onCheckedChange={(checked) => handleSettingChange(item.id, checked)}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <Separator />

                {/* In-App Notifications Section */}
                <div className="space-y-4">
                    <div className='flex items-center gap-2'>
                        <Bell className="h-5 w-5 text-muted-foreground" />
                        <Label className="text-base font-semibold">In-App Notifications</Label>
                    </div>
                     <div className="space-y-3 pl-7">
                        {inAppNotifications.map(item => (
                             <div key={item.id} className="flex items-center justify-between">
                                <Label htmlFor={item.id} className="font-normal text-muted-foreground">{item.label}</Label>
                                <Switch 
                                    id={item.id} 
                                    defaultChecked={item.defaultChecked}
                                    onCheckedChange={(checked) => handleSettingChange(item.id, checked)}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <Separator />
                
                {/* Delivery Preferences Section */}
                <div className="space-y-4">
                    <div className='flex items-center gap-2'>
                        <Clock className="h-5 w-5 text-muted-foreground" />
                        <Label className="text-base font-semibold">Delivery Preferences</Label>
                    </div>
                    <RadioGroup 
                        defaultValue="immediately" 
                        className="pl-7"
                        onValueChange={(value) => handleSettingChange('delivery-frequency', value)}
                    >
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="immediately" id="freq-immediately" />
                            <Label htmlFor="freq-immediately" className="font-normal">Immediately</Label>
                        </div>
                        <p className="text-xs text-muted-foreground pl-6">Receive notifications as soon as they happen.</p>

                        <div className="flex items-center space-x-2 pt-2">
                            <RadioGroupItem value="daily" id="freq-daily" />
                            <Label htmlFor="freq-daily" className="font-normal">Daily Digest</Label>
                        </div>
                         <p className="text-xs text-muted-foreground pl-6">Get a summary of all notifications once a day.</p>

                        <div className="flex items-center space-x-2 pt-2">
                            <RadioGroupItem value="weekly" id="freq-weekly" />
                            <Label htmlFor="freq-weekly" className="font-normal">Weekly Summary</Label>
                        </div>
                        <p className="text-xs text-muted-foreground pl-6">Get a summary of all notifications once a week.</p>
                    </RadioGroup>
                </div>

            </CardContent>
        </Card>
    );
}
