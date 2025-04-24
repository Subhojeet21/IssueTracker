
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
//import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
//import { toast } from '@/components/ui/use-toast';
import { useToast } from "@/hooks/use-toast";
import { Loader2, UserCheckIcon } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Link } from 'wouter';
import Avatar from 'react-avatar';

const Settings = () => {
  const { toast } = useToast();
  const { user, logout } = useAuth();
  // User profile state
  const [profileForm, setProfileForm] = useState({
    //name: 'John Doe',
    //email: 'john@example.com',
    //role: 'Administrator',
    //bio: 'Product manager with a focus on user experience and team collaboration.',
  });
  
  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    issueAssigned: true,
    issueStatusChanged: true,
    newComments: true,
    weeklyDigest: false,
  });
  
  // Display preferences state
  const [displayPreferences, setDisplayPreferences] = useState({
    compactMode: false,
    showAvatars: true,
    enableAnimations: true,
  });
  
  // Password change state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  // Loading states
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  
  // Handle profile form change
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle notification toggle
  const handleNotificationToggle = (setting: string) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev],
    }));
  };
  
  // Handle display preference toggle
  const handleDisplayToggle = (setting: string) => {
    setDisplayPreferences(prev => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev],
    }));
  };
  
  // Handle password form change
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };
  
  // Save profile
  const handleSaveProfile = () => {
    setSavingProfile(true);
    
    // Simulate API request
    setTimeout(() => {
      setSavingProfile(false);
      toast({
        title: "Profile updated",
        description: "Your profile information has been saved",
      });
    }, 1000);
  };
  
  // Save password
  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords don't match",
        description: "Your new password and confirmation do not match",
      });
      return;
    }
    
    setSavingPassword(true);
    
    // Simulate API request
    setTimeout(() => {
      setSavingPassword(false);
      
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully",
      });
      
      // Reset form
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }, 1000);
  };
  
  // Save notification settings
  const handleSaveNotifications = () => {
    toast({
      title: "Notification settings saved",
      description: "Your notification preferences have been updated",
    });
  };
  
  // Save display preferences
  const handleSaveDisplayPreferences = () => {
    toast({
      title: "Display settings saved",
      description: "Your display preferences have been updated",
    });
  };

  if (!user) return null;
  
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Settings</h1>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>
        
        {/* Profile Settings */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and public profile
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center sm:flex-row sm:items-start sm:gap-8">
                <div className="flex flex-col items-center mb-6 sm:mb-0">
                  {/*<Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>{user.fullName}</AvatarFallback>
                  </Avatar>
                  <Button variant="outline" className="mt-4 text-sm">
                    Change Avatar
                  </Button>*/}
                  {user && (
                    <Avatar name={user.fullName} size="80" round={true} />
                  )}
                </div>
                
                <div className="space-y-4 flex-1">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={user.fullName}
                        onChange={handleProfileChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={user.email}
                        onChange={handleProfileChange}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input
                      id="role"
                      name="role"
                      value="Team Member"
                      onChange={handleProfileChange}
                      disabled
                    />
                    <p className="text-xs text-muted-foreground">
                      Your role cannot be changed from this page. Please contact admin.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <textarea
                      id="bio"
                      name="bio"
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value=""
                      onChange={handleProfileChange}
                      disabled 
                    />
                    <p className="text-xs text-muted-foreground">
                      Your bio cannot be changed from this page. Please contact admin.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSaveProfile} disabled={savingProfile}>
                {savingProfile ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Account Settings */}
        <TabsContent value="account">
          <div className="space-y-6">
            {/* Password Change */}
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                  Update your password to enhance your account security
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSavePassword}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button type="submit" disabled={savingPassword}>
                    {savingPassword ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : "Update Password"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
            
            {/* Account Management */}
            <Card>
              <CardHeader>
                <CardTitle>Account Management</CardTitle>
                <CardDescription>
                  Manage your account information and data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Export Data</h4>
                    <p className="text-sm text-muted-foreground">
                      Download a copy of your data
                    </p>
                  </div>
                  <Button variant="outline">Export</Button>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-destructive">Delete Account</h4>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete your account and all data
                    </p>
                  </div>
                  <Button variant="destructive">Delete Account</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Preferences */}
        <TabsContent value="preferences">
          <div className="space-y-6">
            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Manage how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Email Notifications</h4>
                    <p className="text-sm text-muted-foreground">
                      Enable or disable all email notifications
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={() => handleNotificationToggle('emailNotifications')}
                  />
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h4 className="font-medium">Notify me about:</h4>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h5 className="text-sm font-medium">Issue Assignments</h5>
                      <p className="text-xs text-muted-foreground">
                        When an issue is assigned to me
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.issueAssigned}
                      onCheckedChange={() => handleNotificationToggle('issueAssigned')}
                      disabled={!notificationSettings.emailNotifications}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h5 className="text-sm font-medium">Status Changes</h5>
                      <p className="text-xs text-muted-foreground">
                        When the status of an issue I'm involved with changes
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.issueStatusChanged}
                      onCheckedChange={() => handleNotificationToggle('issueStatusChanged')}
                      disabled={!notificationSettings.emailNotifications}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h5 className="text-sm font-medium">New Comments</h5>
                      <p className="text-xs text-muted-foreground">
                        When someone comments on an issue I'm involved with
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.newComments}
                      onCheckedChange={() => handleNotificationToggle('newComments')}
                      disabled={!notificationSettings.emailNotifications}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h5 className="text-sm font-medium">Weekly Digest</h5>
                      <p className="text-xs text-muted-foreground">
                        Receive a weekly summary of all activity
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.weeklyDigest}
                      onCheckedChange={() => handleNotificationToggle('weeklyDigest')}
                      disabled={!notificationSettings.emailNotifications}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleSaveNotifications}>
                  Save Notification Settings
                </Button>
              </CardFooter>
            </Card>
            
            {/* Display Preferences */}
            <Card>
              <CardHeader>
                <CardTitle>Display Settings</CardTitle>
                <CardDescription>
                  Customize how the application appears
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h5 className="text-sm font-medium">Compact Mode</h5>
                    <p className="text-xs text-muted-foreground">
                      Reduce spacing to fit more content on screen
                    </p>
                  </div>
                  <Switch
                    checked={displayPreferences.compactMode}
                    onCheckedChange={() => handleDisplayToggle('compactMode')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h5 className="text-sm font-medium">Show Avatars</h5>
                    <p className="text-xs text-muted-foreground">
                      Display user avatars throughout the application
                    </p>
                  </div>
                  <Switch
                    checked={displayPreferences.showAvatars}
                    onCheckedChange={() => handleDisplayToggle('showAvatars')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h5 className="text-sm font-medium">Enable Animations</h5>
                    <p className="text-xs text-muted-foreground">
                      Turn on interface animations and transitions
                    </p>
                  </div>
                  <Switch
                    checked={displayPreferences.enableAnimations}
                    onCheckedChange={() => handleDisplayToggle('enableAnimations')}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleSaveDisplayPreferences}>
                  Save Display Settings
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
