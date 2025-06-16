'use client';

import { API_URL } from "@/app/configs/constants"
import { useForm } from "react-hook-form"
import { CreateRestaurantDto } from "@/types/restaurant"

export const useRestaurant = () => {
    const methods = useForm<CreateRestaurantDto>()

    const getRestaurants = async () => {
        try {
            const response = await fetch(`${API_URL}restaurant`, {
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

    return {
        methods,
        getRestaurants,
        getRestaurantById,
        createRestaurant,
        updateRestaurant,
        uploadProfileImage,
        uploadMenu,
        uploadGalleryImage
    }
}