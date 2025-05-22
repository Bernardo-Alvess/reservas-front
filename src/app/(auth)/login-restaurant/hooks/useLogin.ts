'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/app/configs/constants';

export const useLogin = () => {
  const router = useRouter();
  const [error, setError] = useState('');

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}auth-company/login`, {
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

      // Redirecionar para o dashboard após login bem-sucedido
      router.push('/admin/dashboard');
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