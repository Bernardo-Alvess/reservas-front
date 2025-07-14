import { useForm } from 'react-hook-form';
import { API_URL } from '../configs/constants';
import { Reserve } from '../schemas/reserve/reserve';
import { toast } from 'react-toastify';
import { PageOptionsDto } from '@/lib/PageOptionsDto';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

export interface Reserva {
  _id: string;
  clientId: {
    _id: string;
    email: string;
    createdAt: string;
    updatedAt: string;
    type: string;
  };
  restaurantId: {
    _id: string;
    name: string;
    phone: string;
    address: any;
    description: string;
    type: string;
    maxClients: number;
    maxReservationTime: number;
    workHours: any[];
    companyId: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    profileImage: {
      url: string;
      publicId: string;
    };
  };
  clientConfirmed: boolean;
  restaurantConfirmed: boolean;
  startTime: string;
  endTime: string;
  amountOfPeople: number;
  status: string;
  canceledBy: string | null;
  canceledAt?: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  tableId: {
    _id: string;
    tableNumber: number;
    numberOfSeats: number;
    isReserved: boolean;
    restaurantId: string;
  };
  tableNumber: number;
  notes?: string;
}

export const useReserve = (mode?: string) => {
	const [reserves, setReserves] = useState<Reserva[]>([]);
	const queryClient = useQueryClient();

	const methods = useForm(
		{
			defaultValues: {
				startDate: '',
				startTime: '',
				amountOfPeople: 1,
				email: '',
				name: '',
				notes: '',
			}
		}
	)

	const getReservesForUser = async (options?: PageOptionsDto) => {
		try {
			let url = `${API_URL}reserve/client`;
			const queryParams = new URLSearchParams();
			
			if (options) {
				if (options.orderDirection) queryParams.append('orderDirection', options.orderDirection);
				if (options.orderColumn) queryParams.append('orderColumn', options.orderColumn);
				if (options.page) queryParams.append('page', options.page.toString());
				if (options.limit) queryParams.append('limit', options.limit <= 50 ? options.limit.toString() : '50');
				if (options.search) queryParams.append('search', options.search);
				if (options.status) queryParams.append('status', options.status);
				
				const queryString = queryParams.toString();
				if (queryString) {
					url = `${url}?${queryString}`;
				}
			}

			const response = await fetch(url, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
			});
			const data = await response.json();
			return data;
		} catch (error) {
			console.error('Erro ao buscar reservas:', error);
			throw error;
		}
	};

	const createReserve = async (data: Reserve) => {
		console.log(data)
		let url = `${API_URL}reserve`;

		if(mode && mode === 'restaurant') {
			url = `${API_URL}reserve/restaurant`;
		}

		try {
			const response = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify(data),
			});

			if(!response.ok) {
				const errorData = await response.json();
				toast.error(errorData.message);
				throw new Error('Erro ao criar reserva');
			}

			toast.success('Reserva realizada com sucesso');

			// Invalidar o cache para atualizar as listas automaticamente
			queryClient.invalidateQueries({ queryKey: ['reserves'] });
			queryClient.invalidateQueries({ queryKey: ['reserves-stats'] });
			queryClient.invalidateQueries({ queryKey: ['upcoming-reserves'] });

			return true
		} catch (error) {
			console.error('Erro ao criar reserva:', error);
			return false;
		}	
	}

	const confirmOrCancelReserve = async (reserveId: string, type: 'restaurant' | 'client', mode: 'confirm' | 'cancel') => {
		try {
			const response = await fetch(`${API_URL}reserve/${mode}/${type}/${reserveId}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
			});
			if(!response.ok) {
				throw new Error(`Erro ao ${mode === 'confirm' ? 'confirmar' : 'cancelar'} reserva`);
			}
			
			toast.success(`Reserva ${mode === 'confirm' ? 'confirmada' : 'cancelada'} com sucesso`);
			
			// Invalidar o cache para atualizar as listas automaticamente
			queryClient.invalidateQueries({ queryKey: ['reserves'] });
			queryClient.invalidateQueries({ queryKey: ['reserves-stats'] });
			queryClient.invalidateQueries({ queryKey: ['upcoming-reserves'] });
			queryClient.invalidateQueries({ queryKey: ['user-reserves'] });
			
			return `Reserva ${mode === 'confirm' ? 'confirmada' : 'cancelada'} com sucesso`;
		} catch (error) {
			console.error(`Erro ao ${mode === 'confirm' ? 'confirmar' : 'cancelar'} reserva:`, error);
			toast.error(`Erro ao ${mode === 'confirm' ? 'confirmar' : 'cancelar'} reserva`);
			throw error;
		}
	}

	const getReservesForRestaurant = async (options?: PageOptionsDto) => {
		try {
			const id = localStorage.getItem('restauranteSelecionado');
			let url = `${API_URL}reserve/restaurant/${id}`;
			const queryParams = new URLSearchParams();
			
			if(options) {
				if(options.orderDirection) queryParams.append('orderDirection', options.orderDirection);
				if(options.orderColumn) queryParams.append('orderColumn', options.orderColumn);
				if(options.page) queryParams.append('page', options.page.toString());
				if(options.limit) queryParams.append('limit', options.limit <= 50 ? options.limit.toString() : '50');
				if(options.search) queryParams.append('search', options.search);
				if(options.today !== undefined) queryParams.append('today', options.today.toString());
				if(options.status) queryParams.append('status', options.status);
				if(options.startDate) queryParams.append('startDate', options.startDate);
				
				const queryString = queryParams.toString();
				if (queryString) {
					url = `${url}?${queryString}`;
				}
			}
			const response = await fetch(url, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
			});

			if(!response.ok) {
				toast.error('Ocorreu um erro ao buscar as reservas');
				throw new Error('Erro ao buscar reservas');
			}

			const data = await response.json();
			setReserves(data.data || []); // Atualiza o estado local

			return data;
		} catch (error) {
			console.error('Erro ao buscar reservas:', error);
			throw error;
		}
	}

	const getReserveStatsForRestaurant = async () => {
		try {
			const id = localStorage.getItem('restauranteSelecionado');
			const response = await fetch(`${API_URL}reserve/restaurant/${id}/stats`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
			});
			
			if(!response.ok) {
				throw new Error('Ocorreu um erro ao buscar as estatísticas de reservas');
			}
			const data = await response.json();
			return data;
		} catch (error) {
			toast.error('Ocorreu um erro ao buscar as estatísticas de reservas');
			console.error('Erro ao buscar estatísticas de reservas:', error);
			throw error;
		}
	}

	const getUpcomingReservations = async () => {
		try {
			const id = localStorage.getItem('restauranteSelecionado');
			const response = await fetch(`${API_URL}reserve/restaurant/${id}/upcoming?limit=10`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
			});

			if(!response.ok) {
				throw new Error('Ocorreu um erro ao buscar as reservas pendentes');
			}

			const data = await response.json();
			return data;
		} catch (error) {
			toast.error('Ocorreu um erro ao buscar as reservas pendentes');
			console.error('Erro ao buscar reservas pendentes:', error);
			throw error;
		}
	}

	const searchUserNowReservations = async (restaurantId: string) => {
		try {
			const response = await fetch(`${API_URL}reserve/client/now/${restaurantId}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
			});

			if(!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || 'Reserva não encontrada');
			}

			const data = await response.json();
			return data;
		} catch (error) {
			console.error('Erro ao buscar reserva:', error);
			throw error;
		}
	}

	const checkInReserve = async (reserveId: string) => {
		try {
			const response = await fetch(`${API_URL}reserve/check-in/${reserveId}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
			});

			if(!response.ok) {
				throw new Error('Erro ao fazer check-in na reserva');
			}

			toast.success('Check-in realizado com sucesso');
			
			// Invalidar o cache para atualizar as listas automaticamente
			queryClient.invalidateQueries({ queryKey: ['reserves'] });
			queryClient.invalidateQueries({ queryKey: ['reserves-stats'] });
			queryClient.invalidateQueries({ queryKey: ['upcoming-reserves'] });

			return 'Check-in realizado com sucesso';
		} catch (error) {
			console.error('Erro ao confirmar reserva:', error);
			toast.error('Erro ao realizar check-in');
			throw error;
		}
	}

	const updateReserve = async (reserveId: string, data: Partial<Reserve>) => {
		try {
			const response = await fetch(`${API_URL}reserve/${reserveId}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify(data),
			});

			if(!response.ok) {
				throw new Error('Erro ao atualizar reserva');
			}

			toast.success('Reserva atualizada com sucesso');
			
			// Invalidar o cache para atualizar as listas automaticamente
			queryClient.invalidateQueries({ queryKey: ['reserves'] });
			queryClient.invalidateQueries({ queryKey: ['reserves-stats'] });
			queryClient.invalidateQueries({ queryKey: ['upcoming-reserves'] });
			queryClient.invalidateQueries({ queryKey: ['user-reserves'] });

			return true;
		} catch (error) {
			console.error('Erro ao atualizar reserva:', error);
			toast.error('Erro ao atualizar reserva');
			throw error;
		}
	}

	const deleteReserve = async (reserveId: string) => {
		try {
			const response = await fetch(`${API_URL}reserve/${reserveId}`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
			});

			if(!response.ok) {
				throw new Error('Erro ao excluir reserva');
			}

			toast.success('Reserva excluída com sucesso');
			
			// Invalidar o cache para atualizar as listas automaticamente
			queryClient.invalidateQueries({ queryKey: ['reserves'] });
			queryClient.invalidateQueries({ queryKey: ['reserves-stats'] });
			queryClient.invalidateQueries({ queryKey: ['upcoming-reserves'] });
			queryClient.invalidateQueries({ queryKey: ['user-reserves'] });

			return true;
		} catch (error) {
			console.error('Erro ao excluir reserva:', error);
			toast.error('Erro ao excluir reserva');
			throw error;
		}
	}

	return {
		reserves,
		setReserves,
		methods,
		getReservesForUser,
		createReserve,
		confirmOrCancelReserve,
		getReservesForRestaurant,
		getReserveStatsForRestaurant,
		getUpcomingReservations,
		searchUserNowReservations,
		checkInReserve,
		updateReserve,
		deleteReserve
	};
};
