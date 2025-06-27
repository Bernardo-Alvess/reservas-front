'use client'
import { useState } from "react";
import { toast } from "react-toastify";
import { API_URL } from "../configs/constants";
import { useForm } from "react-hook-form";
import { TableData } from "../(restaurant)/tables/table.schema";
import { useQueryClient } from "@tanstack/react-query";

export interface Table {
  _id: string;
  tableNumber: number;
  numberOfSeats: number;
  status: "disponível" | "ocupada" | "reservada" | "manutenção";
  location: string;
  isReserved: boolean;
}

export const useTables = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const queryClient = useQueryClient();

  const methods = useForm({
    // resolver: zodResolver(TableSchema),
    defaultValues: {
      tableNumber: "",
      numberOfSeats: 0,
      isReserved: false,
    }
  })

  const parsePostBody = (table: TableData) => {
    return {
      tableNumber: parseInt(table.tableNumber),
      numberOfSeats: table.numberOfSeats,
      isReserved: false,
      restaurantId: localStorage.getItem('restauranteSelecionado')
    }
  }

  const parseEditBody = (table: TableData) => {
    const body: any = {}
    if(table.tableNumber) body.tableNumber = parseInt(table.tableNumber)
    if(table.numberOfSeats) body.numberOfSeats = table.numberOfSeats
    if(table.isReserved !== undefined) body.isReserved = table.isReserved

    return body
  }

  const getTables = async () => {
    try {
      const id = localStorage.getItem('restauranteSelecionado')
      
      // Se não há restaurante selecionado, retorna array vazio
      if (!id) {
        return [];
      }
      
      const response = await fetch(`${API_URL}tables/list/${id}`, {
        credentials: 'include'
      })
      const data = await response.json()
      
      // Garante que sempre retorna um array
      const tablesData = Array.isArray(data) ? data : [];
      
      setTables(tablesData); // Atualiza o estado local
      return tablesData
    }catch(err) {
      console.error(err)
      toast.error('Erro ao buscar mesas')
      
      // Em caso de erro, retorna array vazio em vez de fazer throw
      return [];
    }
  }

  const addEditTable = async (data: TableData, id?: string) => {
    const method = id ? 'PATCH' : 'POST'
    const body = id ? parseEditBody(data) : parsePostBody(data)
    const url = id ? `${API_URL}tables/${id}` : `${API_URL}tables`
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        credentials: 'include'
      })
      
      if (!response.ok) {
        throw new Error('Falha na requisição');
      }
      
      const result = await response.json()
      toast.success(id ? 'Mesa atualizada com sucesso!' : 'Mesa adicionada com sucesso!')
      
      // Invalidar o cache para atualizar a lista automaticamente
      queryClient.invalidateQueries({ queryKey: ['tables'] });
      queryClient.invalidateQueries({ queryKey: ['table-stats'] });
      
      return result
    } catch(err) {
      console.error(err)
      toast.error(id ? 'Erro ao atualizar mesa' : 'Erro ao adicionar mesa')
      throw err; // Re-throw para que o componente possa tratar o erro
    }
  }

  const getTableById = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}tables/${id}`, {
        credentials: 'include'
      })
      const data = await response.json()
      return data
    } catch(err) {
      console.error(err)
      toast.error('Erro ao buscar mesa')
      throw err;
    }
  }

  const getTableStats = async () => {
    try {
      const id = localStorage.getItem('restauranteSelecionado')
      
      // Se não há restaurante selecionado, retorna stats vazias
      if (!id) {
        return {
          availableTables: 0,
          blockedTables: 0,
          tablesWithReservations: 0,
          totalTables: 0
        };
      }
      
      const url = `${API_URL}tables/restaurant/${id}/stats`
      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Falha na requisição')
      }

      const data = await response.json()
      return data
    } catch(err) {
      console.error(err)
      toast.error('Erro ao buscar estatísticas das mesas')
      
      // Em caso de erro, retorna stats vazias em vez de fazer throw
      return {
        availableTables: 0,
        blockedTables: 0,
        tablesWithReservations: 0,
        totalTables: 0
      };
    }
  }

  const updateTableStatus = async (tableId: string, isReserved: boolean) => {
    try {
      const response = await fetch(`${API_URL}tables/${tableId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isReserved }),
        credentials: 'include'
      })
      
      if (!response.ok) {
        throw new Error('Falha na requisição');
      }
      
      const result = await response.json()
      toast.success('Status da mesa atualizado com sucesso!')
      
      // Invalidar o cache para atualizar a lista automaticamente
      queryClient.invalidateQueries({ queryKey: ['tables'] });
      queryClient.invalidateQueries({ queryKey: ['table-stats'] });
      
      return result
    } catch(err) {
      console.error(err)
      toast.error('Erro ao atualizar status da mesa')
      throw err;
    }
  }

  return {
    tables,
    setTables,
    getTables,
    addEditTable,
    getTableById,
    getTableStats,
    updateTableStatus,
    methods
  };
};

