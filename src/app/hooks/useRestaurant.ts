'use client';

import { API_URL } from "@/app/configs/constants"
// import { useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"

export const useRestaurant = () => {
    const methods = useForm()
    // const queryClient = useQueryClient()


    const getRestaurants = async () => {
        console.log('tentando buscar restaurantes')
        try {
            const response = await fetch(`${API_URL}restaurant`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const data = await response.json()
            console.log(data)
            return data
        } catch (error) {
            console.error('Erro ao buscar restaurantes:', error)
            throw error
        }
    }

    return {
        methods,
        getRestaurants
    }
}