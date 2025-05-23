'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/app/configs/constants';

export const useLogin = (type: 'client' | 'restaurant') => {
  const router = useRouter();
  const [error, setError] = useState('');

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

  return {
    login,
    error,
  };
}; 