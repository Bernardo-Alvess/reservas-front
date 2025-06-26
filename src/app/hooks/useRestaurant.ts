'use client';

import { API_URL } from "@/app/configs/constants"
import { useForm } from "react-hook-form"
import { CreateRestaurantDto } from "@/types/restaurant"
import { toast } from "react-toastify";

interface RestaurantFilters {
    search?: string;
    type?: string;
    page?: number;
    limit?: number;
}

export const useRestaurant = () => {
    const methods = useForm<CreateRestaurantDto>()

    const getRestaurants = async (filters?: RestaurantFilters) => {
        try {
            let url = `${API_URL}restaurant`;
            const queryParams = new URLSearchParams();
            
            if (filters) {
                if (filters.search) queryParams.append('search', filters.search);
                if (filters.type) queryParams.append('type', filters.type);
                if (filters.page) queryParams.append('page', filters.page.toString());
                if (filters.limit) queryParams.append('limit', filters.limit.toString());
                
                const queryString = queryParams.toString();
                if (queryString) {
                    url = `${url}?${queryString}`;
                }
            }

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Erro ao buscar restaurantes:', error);
            throw error;
        }
    }

    const getRestaurantById = async (id: string) => {
        try {
            const response = await fetch(`${API_URL}restaurant/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Erro ao buscar restaurante por ID');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Erro ao buscar restaurante por ID:', error);
            throw error;
        }
    }

    const createRestaurant = async (data: CreateRestaurantDto) => {
        try {
            const response = await fetch(`${API_URL}restaurant`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error('Erro ao criar restaurante');
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao criar restaurante:', error);
            throw error;
        }
    }

    const updateRestaurant = async (id: string, data: Partial<CreateRestaurantDto>) => {
        try {
            const response = await fetch(`${API_URL}restaurant/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error('Erro ao atualizar restaurante');
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao atualizar restaurante:', error);
            throw error;
        }
    }

    const uploadProfileImage = async (id: string, file: File) => {
        try {
            const formData = new FormData();
            formData.append('image', file);

            const response = await fetch(`${API_URL}restaurant/upload/${id}/profile`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Erro ao fazer upload da imagem');
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao fazer upload da imagem:', error);
            throw error;
        }
    }

    const uploadMenu = async (id: string, file: File) => {
        try {
            const formData = new FormData();
            formData.append('menu', file);

            const response = await fetch(`${API_URL}restaurant/upload/${id}/menu`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Erro ao fazer upload do cardápio');
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao fazer upload do cardápio:', error);
            throw error;
        }
    }

    const uploadGalleryImage = async (id: string, files: File[]) => {
        try {
            const formData = new FormData();
            files.forEach((file) => {
                formData.append('images', file);
            });

            const response = await fetch(`${API_URL}restaurant/upload/${id}/gallery`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Erro ao fazer upload da imagem');
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao fazer upload da imagem:', error);
            throw error;
        }
    }

    const getDashboardData = async () => {
        const id = localStorage.getItem('restauranteSelecionado');
        const url = `${API_URL}restaurant/${id}/dashboard`;
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Erro ao buscar dados do dashboard');
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao buscar dados do dashboard:', error);
            throw error;
        }
    }

    const getCuisineTypes = async () => {
        try {
            const response = await fetch(`${API_URL}restaurant/cook-types`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Erro ao buscar tipos de culinária');
            }
            const data = await response.json();
            console.log(data);
            return data;
        } catch (error) {
            console.error('Erro ao buscar tipos de culinária:', error);
            throw error;
        }
    }

    const deleteGalleryImage = async (publicId: string) => {
        try {
            const id = localStorage.getItem('restauranteSelecionado');
            const response = await fetch(`${API_URL}restaurant/upload/${id}/image`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ publicId })
            });

            if (!response.ok) {
                throw new Error('Erro ao deletar imagem da galeria');
            }

            toast.success('Imagem deletada com sucesso');
            return await response.json();
        } catch (error) {
            console.error('Erro ao deletar imagem da galeria:', error);
            toast.error('Erro ao deletar imagem da galeria');
            throw error;
        }
    }

    return {
        methods,
        getRestaurants,
        getRestaurantById,
        createRestaurant,
        updateRestaurant,
        uploadProfileImage,
        uploadMenu,
        uploadGalleryImage,
        getDashboardData,
        getCuisineTypes,
        deleteGalleryImage
    }
}

