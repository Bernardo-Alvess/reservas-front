'use client';

import { useState } from 'react';
import { API_URL } from '@/app/configs/constants';
import { useQueryClient } from '@tanstack/react-query';
import { useUser } from './useUser';
import { useUserContext } from '../context/user/useUserContext';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';

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
  console.log(type)
  const methods = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { getUserLogged } = useUser();
  const { setUser: setUserContext, fetchUser } = useUserContext();
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
      const user = await getUserLogged();
      setUserContext(user);

      toast.success('Login realizado com sucesso!');

      await queryClient.invalidateQueries({ queryKey: ['user'] });
      return true
    } catch (error) {
      console.log(error)
      toast.error('Verifique suas credenciais');
      setError('Erro ao fazer login');
      return false
    }
  };

  const logout = async () => {
    try {
      await fetch(`${API_URL}auth-user/logout`, {
        method: 'GET',
        credentials: 'include',
      });

      await queryClient.resetQueries({ queryKey: ['user'] });
      await queryClient.invalidateQueries({ queryKey: ['user'] });
      setUserContext(null);
      await fetchUser();
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