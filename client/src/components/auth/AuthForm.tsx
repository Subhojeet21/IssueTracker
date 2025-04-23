import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { insertUserSchema } from '@shared/schema';

// Login schema only needs username and password
const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required')
});

// Register schema extends the insertUserSchema with password confirmation
const registerSchema = insertUserSchema.extend({
  confirmPassword: z.string().min(1, 'Please confirm your password')
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

interface AuthFormProps {
  type: 'login' | 'register';
  onSubmit: (data: any) => void;
  isSubmitting?: boolean;
}

const AuthForm = ({ type, onSubmit, isSubmitting = false }: AuthFormProps) => {
  const isLogin = type === 'login';
  const schema = isLogin ? loginSchema : registerSchema;
  
  const form = useForm<any>({
    resolver: zodResolver(schema),
    defaultValues: isLogin ? {
      username: '',
      password: ''
    } : {
      username: '',
      password: '',
      confirmPassword: '',
      email: '',
      fullName: ''
    }
  });
  
  const handleSubmit = (data: any) => {
    // Remove confirmPassword for register before submitting
    if (!isLogin && 'confirmPassword' in data) {
      const { confirmPassword, ...userData } = data;
      onSubmit(userData);
    } else {
      onSubmit(data);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {!isLogin && (
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="John Doe" 
                    disabled={isSubmitting}
                    autoComplete="name"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="johndoe" 
                  disabled={isSubmitting}
                  autoComplete={isLogin ? "username" : "new-username"}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {!isLogin && (
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    type="email" 
                    placeholder="john.doe@example.com" 
                    disabled={isSubmitting}
                    autoComplete="email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  type="password" 
                  placeholder="••••••••" 
                  disabled={isSubmitting}
                  autoComplete={isLogin ? "current-password" : "new-password"}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {!isLogin && (
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    type="password" 
                    placeholder="••••••••" 
                    disabled={isSubmitting}
                    autoComplete="new-password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <span className="mr-2">
                <i className="fas fa-spinner fa-spin"></i>
              </span>
              {isLogin ? 'Signing in...' : 'Creating account...'}
            </>
          ) : (
            isLogin ? 'Sign in' : 'Create account'
          )}
        </Button>
      </form>
    </Form>
  );
};

export default AuthForm;
