'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/app/configs/constants';
import { useQueryClient } from '@tanstack/react-query';
import { useUser } from './useUser';
import { useUserContext } from '../context/user/useUserContext';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
});

type LoginForm = z.infer<typeof loginSchema>;

export interface LoginFormProps {
  email: string;
  password: string;
}

export const useLogin = (type: 'client' | 'restaurant') => {
  const router = useRouter();
  
  const methods = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { getUserLogged } = useUser();
  const { setUser: setUserContext } = useUserContext();
  const [error, setError] = useState('');
  const queryClient = useQueryClient();

  const login = async (email: string, password: string) => {
    try {
      const url = 'auth-user/login';
      const response = await fetch(`${API_URL}${url}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Credenciais inválidas');
      }
      const data = await response.json();
      console.log(data);
      const user = await getUserLogged();
      setUserContext(user);

      await queryClient.invalidateQueries({ queryKey: ['user'] });
      
      if (type === 'client') {
        router.push('/home');
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      setError('Email ou senha incorretos');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/logout', {
        method: 'GET',
        credentials: 'include',
      });

      await queryClient.resetQueries({ queryKey: ['user'] });
      await queryClient.invalidateQueries({ queryKey: ['user'] });
      localStorage.removeItem('restauranteSelecionado');
      window.location.href = '/home';
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  }

  return {
    login,
    error,
    logout,
    methods
  };
}; 