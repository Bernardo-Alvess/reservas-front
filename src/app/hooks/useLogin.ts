'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/app/configs/constants';
import { useQueryClient } from '@tanstack/react-query';

export const useLogin = (type: 'client' | 'restaurant') => {
  const router = useRouter();
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

      // Limpa o cache do usuário e força uma nova busca
      await queryClient.resetQueries({ queryKey: ['user'] });
      await queryClient.invalidateQueries({ queryKey: ['user'] });
      
      // Força um redirecionamento completo para garantir que o estado seja limpo
      window.location.href = '/home';
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  }

  return {
    login,
    error,
    logout,
  };
}; 