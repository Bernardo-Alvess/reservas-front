import { toast } from "react-toastify"
import { API_URL } from "../configs/constants"
import { useQueryClient } from "@tanstack/react-query"
import { useState } from "react"

export enum UserTypeEnum {
    ADMIN = 'admin',
    WORKER = 'worker'
}

export interface CreateUserDto {
    email: string;
    name: string;
    type: UserTypeEnum;
    restaurantId?: string;
}

export interface User {
    _id: string;
    email: string;
    name: string;
    type: UserTypeEnum;
    active: boolean;
    role: string;
    createdAt: string;
}

export const useUser = () => {
    const [users, setUsers] = useState<User[]>([]);
    const queryClient = useQueryClient();

    const getUserLogged = async () => {
        try {
            const response = await fetch(`${API_URL}users/me`,
                {
                    method: 'GET',
                    credentials: 'include',
                },
            )

            if (!response.ok || response.status === 401) {
                console.log('Erro ao obter usuário logado')
                return null
            }
            const data = await response.json()


            return data || null
        }catch(error){
            console.error('Erro ao obter usuário logado:', error)
            throw error
        }
    }

    const createOrUpdateOtp = async (email: string) => {
        try {
            const response = await fetch(`${API_URL}users/create-user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            })
            if (!response.ok) {
                throw new Error('Erro ao criar ou atualizar OTP')
            }
            const data = await response.json()
            toast.success("Código enviado para seu email!");
            return data || null
        }catch(error){
            console.error('Erro ao criar ou atualizar OTP:', error)
            throw error
        }

    }

    const getUsers = async () => {
        try {
            const restaurantId = localStorage.getItem('restauranteSelecionado');
            const response = await fetch(`${API_URL}users/restaurant/${restaurantId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Erro ao buscar usuários');
            }

            const data = await response.json();
            setUsers(data); // Atualiza o estado local
            return data;
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
            toast.error('Erro ao buscar usuários');
            throw error;
        }
    }

    const addUser = async (data: CreateUserDto) => {
        try {
            const restaurantId = localStorage.getItem('restauranteSelecionado');
            const response = await fetch(`${API_URL}users/create-user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    email: data.email,
                    name: data.name,
                    type: data.type,
                    restaurantId,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao adicionar usuário');
            }

            toast.success('Usuário adicionado com sucesso');
            
            // Invalidar o cache para atualizar a lista automaticamente
            queryClient.invalidateQueries({ queryKey: ['users'] });
            queryClient.invalidateQueries({ queryKey: ['user-stats'] });
            
            return true;
        } catch (error: any) {
            console.error('Erro ao adicionar usuário:', error);
            toast.error(error.message || 'Erro ao adicionar usuário');
            return false;
        }
    }

    const updateUserStatus = async (userId: string) => {
        try {
            const response = await fetch(`${API_URL}users/${userId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Erro ao atualizar status do usuário');
            }

            toast.success('Status do usuário atualizado com sucesso');
            
            // Invalidar o cache para atualizar a lista automaticamente
            queryClient.invalidateQueries({ queryKey: ['users'] });
            queryClient.invalidateQueries({ queryKey: ['user-stats'] });
            
            return true;
        } catch (error) {
            console.error('Erro ao atualizar status do usuário:', error);
            toast.error('Erro ao atualizar status do usuário');
            return false;
        }
    }

    const updateUserRole = async (userId: string, type: UserTypeEnum) => {
        try {
            const response = await fetch(`${API_URL}users/${userId}/role`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ type }),
            });

            if (!response.ok) {
                throw new Error('Erro ao atualizar função do usuário');
            }

            toast.success('Função do usuário atualizada com sucesso');
            
            // Invalidar o cache para atualizar a lista automaticamente
            queryClient.invalidateQueries({ queryKey: ['users'] });
            queryClient.invalidateQueries({ queryKey: ['user-stats'] });
            
            return true;
        } catch (error) {
            console.error('Erro ao atualizar função do usuário:', error);
            toast.error('Erro ao atualizar função do usuário');
            return false;
        }
    }

    const deleteUser = async (userId: string) => {
        try {
            const response = await fetch(`${API_URL}users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Erro ao excluir usuário');
            }

            toast.success('Usuário excluído com sucesso');
            
            // Invalidar o cache para atualizar a lista automaticamente
            queryClient.invalidateQueries({ queryKey: ['users'] });
            queryClient.invalidateQueries({ queryKey: ['user-stats'] });
            
            return true;
        } catch (error) {
            console.error('Erro ao excluir usuário:', error);
            toast.error('Erro ao excluir usuário');
            return false;
        }
    }

    const getUserStats = async () => {
        try {
            const restaurantId = localStorage.getItem('restauranteSelecionado');
            const response = await fetch(`${API_URL}users/restaurant/${restaurantId}/stats`, {
                method: 'GET',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Erro ao buscar estatísticas de usuários');
            }

            const data = await response.json();
            return data;
        }catch(error){
            console.error('Erro ao buscar estatísticas de usuários:', error);
            toast.error('Erro ao buscar estatísticas de usuários');
            throw error;
        }
    }

    return {
        users,
        setUsers,
        getUserLogged,
        createOrUpdateOtp,
        getUsers,
        addUser,
        updateUserStatus,
        updateUserRole,
        deleteUser,
        getUserStats
    }
}