import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Link, useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AuthForm from '@/components/auth/AuthForm';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [location, navigate] = useLocation();
  const { login, isLoading, user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleLogin = async (data: { username: string; password: string }) => {
    try {
      setIsSubmitting(true);
      await login(data.username, data.password);
      // Redirect if user is already logged in
      useEffect(() => {
        if (user) {
          navigate('/');
        }
      }, [user, navigate]);
      //navigate('/');
    } catch (error) {
      toast({
        title: 'Login failed',
        description: error instanceof Error ? error.message : 'Invalid credentials',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <div className="bg-primary text-white p-2 rounded-full">
              <i className="fas fa-bug text-xl"></i>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Issue Tracker</CardTitle>
          <CardDescription>Enter your credentials to sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <AuthForm 
            type="login" 
            onSubmit={handleLogin} 
            isSubmitting={isSubmitting || isLoading}
          />
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-gray-500">
            Don't have an account?{' '}
            <Link href="/register" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
