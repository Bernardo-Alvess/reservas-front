import { useForm } from 'react-hook-form';
import { API_URL } from '../configs/constants';
import { Reserve } from '../schemas/reserve/reserve';
import { toast } from 'react-toastify';
import { PageOptionsDto } from '@/lib/PageOptionsDto';

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
}

export const useReserve = () => {

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
		try {
			const response = await fetch(`${API_URL}reserve`, {
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
				throw new Error('Erro ao confirmar reserva');
			}
			return 'Reserva confirmada com sucesso';
		} catch (error) {
			console.error('Erro ao confirmar reserva:', error);
			return 'Erro ao confirmar reserva';
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

	return {
		methods,
		getReservesForUser,
		createReserve,
		confirmOrCancelReserve,
		getReservesForRestaurant,
		getReserveStatsForRestaurant,
		getUpcomingReservations
	};
};
