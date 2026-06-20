import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/icons';
import { getAppPassword } from '@/lib/auth';

export const metadata = {
  title: 'Sign in'
};

export default async function LoginPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string; from?: string }>;
}) {
  const { error, from } = await searchParams;

  // If the gate isn't configured, there's nothing to sign into.
  if (!getAppPassword()) {
    redirect('/dashboard/finance');
  }

  return (
    <div className='bg-background flex min-h-svh items-center justify-center p-4'>
      <Card className='w-full max-w-sm'>
        <CardHeader className='space-y-1 text-center'>
          <div className='bg-primary/10 text-primary mx-auto flex size-11 items-center justify-center rounded-xl'>
            <Icons.wallet className='size-6' />
          </div>
          <CardTitle className='text-xl'>Finance Tracker</CardTitle>
          <CardDescription>Enter the team password to continue.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action='/api/login' method='post' className='flex flex-col gap-4'>
            <input type='hidden' name='from' value={from ?? ''} />
            <div className='flex flex-col gap-2'>
              <Label htmlFor='password'>Password</Label>
              <Input
                id='password'
                name='password'
                type='password'
                autoComplete='current-password'
                autoFocus
                required
                placeholder='••••••••'
              />
            </div>
            {error ? (
              <p className='text-destructive text-sm'>Incorrect password. Try again.</p>
            ) : null}
            <Button type='submit' className='w-full'>
              Sign in
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
