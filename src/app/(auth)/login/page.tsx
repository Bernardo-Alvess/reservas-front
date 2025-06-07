// 'use client';

// import { useForm } from 'react-hook-form';
// import { useState } from 'react';
// import Link from 'next/link';
// import { useLogin } from '../../hooks/useLogin';

// interface LoginForm {
//   email: string;
//   password: string;
// }

// export default function LoginPage() {
//   const [isLoading, setIsLoading] = useState(false);
//   const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();
//   const { login, error: loginError } = useLogin('client');

//   const onSubmit = async (data: LoginForm) => {
//     setIsLoading(true);
//     try {
//       await login(data.email, data.password);
//     } catch (error) {
//       console.error('Erro ao fazer login:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8">
//         <div>
//           <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//             Área do Restaurante
//           </h2>
//           <p className="mt-2 text-center text-sm text-gray-600">
//             Faça login para acessar seu painel administrativo
//           </p>
//         </div>
        
//         <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
//           {loginError && (
//             <div className="rounded-md bg-red-50 p-4">
//               <p className="text-sm text-red-700">{loginError}</p>
//             </div>
//           )}

//           <div className="rounded-md shadow-sm -space-y-px">
//             <div>
//               <label htmlFor="email" className="sr-only">Email</label>
//               <input
//                 {...register('email', {
//                   required: 'Email é obrigatório',
//                   pattern: {
//                     value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
//                     message: 'Email inválido'
//                   }
//                 })}
//                 type="email"
//                 className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
//                 placeholder="Email"
//               />
//               {errors.email && (
//                 <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
//               )}
//             </div>
//             <div>
//               <label htmlFor="password" className="sr-only">Senha</label>
//               <input
//                 {...register('password', {
//                   required: 'Senha é obrigatória',
//                   minLength: {
//                     value: 6,
//                     message: 'A senha deve ter no mínimo 6 caracteres'
//                   }
//                 })}
//                 type="password"
//                 className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
//                 placeholder="Senha"
//               />
//               {errors.password && (
//                 <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
//               )}
//             </div>
//           </div>

//           <div className="flex items-center justify-between">
//             <div className="flex items-center">
//               <input
//                 id="remember-me"
//                 name="remember-me"
//                 type="checkbox"
//                 className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//               />
//               <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
//                 Lembrar-me
//               </label>
//             </div>

//             <div className="text-sm">
//               <Link href="/auth/recuperar-senha" className="font-medium text-blue-600 hover:text-blue-500">
//                 Esqueceu sua senha?
//               </Link>
//             </div>
//           </div>

//           <div>
//             <button
//               type="submit"
//               disabled={isLoading}
//               className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
//             >
//               {isLoading ? (
//                 <span className="absolute left-0 inset-y-0 flex items-center pl-3">
//                   <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                 </span>
//               ) : 'Entrar'}
//             </button>
//           </div>
//         </form>

//         <div className="text-center">
//           <p className="text-sm text-gray-600">
//             Ainda não tem uma conta?{' '}
//             <Link href="/auth/cadastro" className="font-medium text-blue-600 hover:text-blue-500">
//               Cadastre seu restaurante
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// } 

'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

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
  const { methods, login, error: loginError } = useLogin('client');

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
