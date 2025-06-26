'use client';

import { useState } from 'react';
import Link from 'next/link';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormMessage, FormControl } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LoginFormProps, useLogin } from '@/app/hooks/useLogin';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { methods, login, responseError: loginError } = useLogin();

  const onSubmit = async (data: LoginFormProps) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4">
      <Card className="w-full max-w-md shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Entrar</CardTitle>
          <p className="text-sm text-muted-foreground text-center">
            Faça login para acessar sua conta
          </p>
        </CardHeader>

        <CardContent>
          <Form {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
              {loginError && (
                <Alert variant="destructive">
                  <AlertDescription>{loginError}</AlertDescription>
                </Alert>
              )}

              <FormField
                control={methods.control}
                name="email"
                render={({ field } : any) => (
                  <FormItem>
                    <Label>Email</Label>
                    <FormControl>
                      <Input
                        placeholder="exemplo@email.com"
                        type="email"
                        autoComplete="email"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={methods.control}
                name="password"
                render={({ field }: any) => (
                  <FormItem>
                    <Label>Senha</Label>
                    <FormControl>
                      <Input
                        placeholder="Sua senha"
                        type="password"
                        autoComplete="current-password"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember-me" />
                  <Label htmlFor="remember-me">Lembrar-me</Label>
                </div>

                <Link
                  href="/auth/recuperar-senha"
                  className="text-sm text-muted-foreground hover:underline"
                >
                  Esqueceu sua senha?
                </Link>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
          </Form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
  Ainda não tem uma conta?{' '}
  <Link href="/auth/cadastro" className="text-primary hover:underline">
    Cadastre-se
  </Link>
</p>

        </CardContent>
      </Card>
    </div>
  );
}
