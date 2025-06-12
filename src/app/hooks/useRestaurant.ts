'use client';

import { API_URL } from "@/app/configs/constants"
// import { useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"

export const useRestaurant = () => {
    const methods = useForm()

    const getRestaurants = async () => {
        try {
            const response = await fetch(`${API_URL}restaurant`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const data = await response.json()
            return data
        } catch (error) {
            console.error('Erro ao buscar restaurantes:', error)
            throw error
        }
    }


    const getRestaurantById = async (id: string) => {
        try {
            const response = await fetch(`${API_URL}restaurant/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const data = await response.json()
            return data
        } catch (error) {
            console.error('Erro ao buscar restaurante por ID:', error)
            throw error
        }
    }

    return {
        methods,
        getRestaurants,
        getRestaurantById
    }
}