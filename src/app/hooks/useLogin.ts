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
import { useRouter } from 'next/navigation';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
});

type LoginForm = z.infer<typeof loginSchema>;

export interface LoginFormProps {
  email: string;
  password: string;
}

export const useLogin = () => {  

  const methods = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { getUserLogged } = useUser();
  const { setUser: setUserContext, fetchUser } = useUserContext();
  const [responseError, setError] = useState('');
  const queryClient = useQueryClient();
  const router = useRouter();

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
      
      const data = await response.json();
      setError(data.message);
      if (!response.ok) {
        throw new Error('Credenciais inválidas');
      }

      const user = await getUserLogged();
      setUserContext(user);

      // Disparar evento para auto-seleção de restaurante
      if (user && user.restaurant && user.restaurant.length > 0) {
        // Pequeno delay para garantir que o contexto seja atualizado
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('userDataLoaded', { detail: user }));
        }, 100);
      }

      toast.success(data.message);

      await queryClient.invalidateQueries({ queryKey: ['user'] });
      return true
    } catch (error) {
      console.log(error)
      toast.error(responseError || 'Credenciais inválidas');
      return false
    }
  };
  
  const logout = async () => {
    try {
      console.log('teste chamando o hook')
      router.push('/');
      await fetch(`${API_URL}auth-user/logout`, {
        method: 'GET',
        credentials: 'include',
      });
      
      localStorage.removeItem('restauranteSelecionado');
      
      // 3. Verificar e forçar limpeza se necessário
      if (localStorage.getItem('restauranteSelecionado')) {
        console.log('limpando localStorage dnv')
        localStorage.clear(); // Como fallback, limpa tudo se o item específico não foi removido
      }
      

      // 4. Resetar contexto do usuário
      setUserContext(null);
      
      // 5. Limpar queries do React Query
      await queryClient.resetQueries({ queryKey: ['user'] });
      await queryClient.invalidateQueries({ queryKey: ['user'] });
      
      // 6. Limpar todas as queries relacionadas ao restaurante/usuário
      await queryClient.resetQueries({ queryKey: ['reserves'] });
      await queryClient.resetQueries({ queryKey: ['tables'] });
      await queryClient.resetQueries({ queryKey: ['users'] });
      
      // 7. Refetch user para garantir estado limpo
      await fetchUser();
      
      // 8. Redirecionar para home
      
      // 9. Mostrar mensagem de sucesso
      toast.success('Logout realizado com sucesso!');
      
    } catch (error) {
      console.log('error', error)
      localStorage.removeItem('restauranteSelecionado');
      setUserContext(null);
      router.push('/');
    }
  }

  const forgotPassword = async (email: string) => {
    try {
      const response = await fetch(`${API_URL}password-reset/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message);
        throw new Error('Erro ao enviar email de recuperação');
      }

      return data;
    } catch (error) {
      console.error('Erro ao enviar email de recuperação:', error);
      throw error;
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    try {
      const response = await fetch(`${API_URL}password-reset/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword }),
        credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      toast.error(data.message);
      throw new Error('Erro ao redefinir senha');
    }

    return data;
    } catch (error) {
      console.error('Erro ao redefinir senha:', error);
      throw error;
    }
  };

  return {
    login,
    responseError,
    logout,
    methods,
    forgotPassword,
    resetPassword,
  };
}; 