// src/components/profile-form.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { FilePenLine, X, Globe, FileUp, Loader2 } from 'lucide-react';
import { Separator } from './ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useRef, useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { uploadProfilePhotoAction, updateUserProfile } from '@/actions/user/profile'; // <-- RUTA CORREGIDA
import { useUserProfile } from '@/hooks/useUserProfile';

const profileFormSchema = z.object({
  profilePhoto: z.string().optional(),
  fullName: z.string().min(1, 'Full name is required'),
  artistName: z.string().optional(),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  locationCountry: z.string().optional(),
  locationState: z.string().optional(),
  locationCity: z.string().optional(),
  primaryRole: z.string().min(1, 'Primary role is required'),
  musicGenres: z.string().optional(),
  experienceLevel: z.enum(['beginner', 'intermediate', 'professional']),
  bio: z.string().optional(),
  publisher: z.string().optional(),
  proSociety: z.enum(['none', 'ascap', 'bmi', 'sesac', 'other']).optional(),
  website: z.string().url('Invalid URL').optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const defaultValues: Partial<ProfileFormValues> = {
  profilePhoto: '',
  fullName: '',
  artistName: '',
  email: '',
  phone: '',
  locationCountry: '',
  locationState: '',
  locationCity: '',
  primaryRole: '',
  musicGenres: '',
  experienceLevel: 'intermediate',
  bio: '',
  publisher: '',
  proSociety: 'none',
  website: '',
};

export function ProfileForm() {
  const { toast } = useToast();
  const { user } = useAuth();
  const { userProfile, loading: profileLoading } = useUserProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: 'onChange',
  });

  useEffect(() => {
    if (userProfile) {
      let genres = '';
      if (Array.isArray(userProfile.genres)) {
        genres = userProfile.genres.join(', ');
      } else if (typeof userProfile.genres === 'string') {
        genres = userProfile.genres;
      }

      const validProSociety = userProfile.proSociety && ['none', 'ascap', 'bmi', 'sesac', 'other'].includes(userProfile.proSociety) 
        ? userProfile.proSociety as 'none' | 'ascap' | 'bmi' | 'sesac' | 'other'
        : 'none';
      
      const formValues: Partial<ProfileFormValues> = {
        fullName: userProfile.displayName || '',
        email: userProfile.email || '',
        profilePhoto: userProfile.photoURL || '',
        artistName: userProfile.artistName || '',
        phone: userProfile.phone || '',
        locationCountry: userProfile.locationCountry || '',
        locationState: userProfile.locationState || '',
        locationCity: userProfile.locationCity || '',
        primaryRole: userProfile.primaryRole || '',
        musicGenres: genres,
        experienceLevel: userProfile.experienceLevel || 'intermediate',
        bio: userProfile.bio || '',
        publisher: userProfile.publisher || '',
        proSociety: validProSociety,
        website: userProfile.website || '',
      };

      form.reset(formValues);
      setPreviewUrl(userProfile.photoURL || null);
    }
  }, [userProfile, form]);
  
  useEffect(() => {
    if (selectedImage) {
      const objectUrl = URL.createObjectURL(selectedImage);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [selectedImage]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(event.target.files[0]);
    }
  };

  async function onSubmit(data: ProfileFormValues) {
    if (!user) {
        toast({ title: 'Error', description: 'You must be logged in.', variant: 'destructive'});
        return;
    }
    setIsSubmitting(true);

    try {
        let photoURL = form.getValues('profilePhoto'); // Start with existing URL
        if (selectedImage) {
            const formData = new FormData();
            formData.append('profilePhoto', selectedImage);
            formData.append('userId', user.uid); // Pass the current user's ID
            
            const result = await uploadProfilePhotoAction(formData);

            if (result.status === 'error') {
                toast({ title: 'Upload Error', description: result.message, variant: 'destructive' });
                setIsSubmitting(false);
                return;
            }
            photoURL = result.data?.downloadURL;
        }

        const genres = data.musicGenres ? data.musicGenres.split(',').map(g => g.trim()).filter(Boolean) : [];
        const updatedData = { ...data, photoURL, genres };
        
        await updateUserProfile(updatedData, user.uid);
        
        // This makes sure the form is up-to-date after submission.
        form.reset({ ...updatedData, musicGenres: updatedData.genres.join(', ') });
        
        toast({
            title: 'Profile Updated',
            description: 'Your changes have been saved successfully.',
        });
    } catch (error) {
        console.error(error);
        toast({ title: 'Error', description: 'Failed to update profile.', variant: 'destructive'});
    } finally {
        setIsSubmitting(false);
    }
  }

  function onCancel() {
    form.reset(userProfile ? {
        fullName: userProfile.displayName || '',
        email: userProfile.email || '',
        // ...reset other fields to their original state from userProfile
    } : defaultValues);
    setSelectedImage(null);
    setPreviewUrl(userProfile?.photoURL || null);
    toast({
      title: 'Changes Discarded',
      description: 'Your changes have been reverted.',
      variant: 'destructive',
    });
  }

  if (profileLoading) {
    return (
        <div className="flex justify-center items-center h-96">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Manage your personal and contact details.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
                control={form.control}
                name="profilePhoto"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Profile Photo</FormLabel>
                        <div className="flex items-center gap-6">
                            <Avatar className="h-24 w-24">
                                <AvatarImage src={previewUrl || undefined} data-ai-hint="user avatar" />
                                <AvatarFallback>
                                    {userProfile?.displayName?.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col gap-2">
                                <Input 
                                    type="file" 
                                    ref={fileInputRef}
                                    className="hidden"
                                    onChange={handleFileSelect}
                                    accept="image/png, image/jpeg, image/gif"
                                />
                                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                                    <FileUp className="mr-2" />
                                    Upload Photo
                                </Button>
                                <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB.</p>
                            </div>
                        </div>
                    </FormItem>
                )}
             />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Your legal name" {...field} autoComplete="name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address *</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" {...field} autoComplete="email" readOnly />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="artistName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Artist/Stage Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your professional name" {...field} autoComplete="off" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="+1 (555) 123-4567" {...field} autoComplete="tel" />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="locationCountry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a country" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="worldwide">Worldwide</SelectItem>
                            <Separator />
                            <SelectItem value="ar">Argentina</SelectItem>
                            <SelectItem value="bo">Bolivia</SelectItem>
                            <SelectItem value="br">Brazil</SelectItem>
                            <SelectItem value="cl">Chile</SelectItem>
                            <SelectItem value="co">Colombia</SelectItem>
                            <SelectItem value="cr">Costa Rica</SelectItem>
                            <SelectItem value="cu">Cuba</SelectItem>
                            <SelectItem value="ec">Ecuador</SelectItem>
                            <SelectItem value="sv">El Salvador</SelectItem>
                            <SelectItem value="gt">Guatemala</SelectItem>
                            <SelectItem value="hn">Honduras</SelectItem>
                            <SelectItem value="mx">Mexico</SelectItem>
                            <SelectItem value="ni">Nicaragua</SelectItem>
                            <SelectItem value="pa">Panama</SelectItem>
                            <SelectItem value="py">Paraguay</SelectItem>
                            <SelectItem value="pe">Peru</SelectItem>
                            <SelectItem value="pr">Puerto Rico</SelectItem>
                            <SelectItem value="do">Dominican Republic</SelectItem>
                            <SelectItem value="uy">Uruguay</SelectItem>
                            <SelectItem value="ve">Venezuela</SelectItem>
                             <Separator />
                            <SelectItem value="us">United States</SelectItem>
                            <SelectItem value="ca">Canada</SelectItem>
                            <SelectItem value="es">Spain</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                     </Select>
                     <FormField
                        control={form.control}
                        name="locationState"
                        render={({ field }) => (
                            <FormControl>
                                <Input placeholder="State / Province" {...field} autoComplete="address-level1" />
                            </FormControl>
                        )}
                        />
                     <FormField
                        control={form.control}
                        name="locationCity"
                        render={({ field }) => (
                            <FormControl>
                                <Input placeholder="City" {...field} autoComplete="address-level2" />
                            </FormControl>
                        )}
                      />
                  </div>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Musical Profile</CardTitle>
            <CardDescription>
              Describe your musical background and expertise.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <FormField
                control={form.control}
                name="primaryRole"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Role *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your main role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="songwriter">Songwriter</SelectItem>
                        <SelectItem value="producer">Producer</SelectItem>
                        <SelectItem value="vocalist">Vocalist</SelectItem>
                        <SelectItem value="musician">Musician</SelectItem>
                        <SelectItem value="audio-engineer">Audio Engineer</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="musicGenres"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Music Genres</FormLabel>
                         <FormControl>
                            <Input placeholder="Pop, Rock, Hip-Hop" {...field} />
                        </FormControl>
                         <FormMessage />
                    </FormItem>
                )}
              />
            </div>
             <FormField
                control={form.control}
                name="experienceLevel"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Experience Level</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="beginner" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Beginner (0-2 years)
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="intermediate" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Intermediate (3-5 years)
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="professional" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Professional (5+ years)
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
             <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio / Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us about your musical background, style, and accomplishments."
                        className="resize-y min-h-[100px]"
                        {...field}
                        autoComplete="off"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Professional Information</CardTitle>
            <CardDescription>Optional details about your professional setup.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="publisher"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Publisher</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Vera Music Publishing or Independent" {...field} autoComplete="organization" />
                    </FormControl>
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="proSociety"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>PRO Society</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="none" /></FormControl><FormLabel className="font-normal">None</FormLabel></FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="ascap" /></FormControl><FormLabel className="font-normal">ASCAP</FormLabel></FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="bmi" /></FormControl><FormLabel className="font-normal">BMI</FormLabel></FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="sesac" /></FormControl><FormLabel className="font-normal">SESAC</FormLabel></FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="other" /></FormControl><FormLabel className="font-normal">Other</FormLabel></FormItem>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
             <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website/Social Media</FormLabel>
                     <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <FormControl>
                          <Input type="url" placeholder="https://your-portfolio.com" className="pl-10" {...field} autoComplete="url" />
                        </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
          </CardContent>
           <CardFooter className="flex justify-end gap-4 p-6">
              <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
                <X className="mr-2 h-4 w-4" />
                Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FilePenLine className="mr-2 h-4 w-4" />}
                {isSubmitting ? 'Saving...' : 'Save Profile'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
