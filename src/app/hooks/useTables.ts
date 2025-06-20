'use client'
import { useState } from "react";
import { toast } from "react-toastify";
import { API_URL } from "../configs/constants";
import { useForm } from "react-hook-form";
import { TableData } from "../(restaurant)/tables/table.schema";

export interface Table {
  _id: string;
  tableNumber: number;
  numberOfSeats: number;
  status: "disponível" | "ocupada" | "reservada" | "manutenção";
  location: string;
}

export const useTables = () => {
  const [tables] = useState<Table[]>();

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
    if(table.isReserved) body.isReserved = table.isReserved

    return body
  }

  const getTables = async () => {
    try {
      const id = localStorage.getItem('restauranteSelecionado')
      const response = await fetch(`${API_URL}tables/list/${id}`, {
        credentials: 'include'
      })
      const data = await response.json()
      return data
    }catch(err) {
      console.error(err)
      toast.error('Erro ao buscar mesas')
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
      toast.success('Mesa adicionada com sucesso!')
      return result
    } catch(err) {
      console.error(err)
      toast.error('Erro ao adicionar mesa')
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
    }
  }

  const getTableStats = async () => {
    try {
      const id = localStorage.getItem('restauranteSelecionado')
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
    }
  }

  return {
    tables,
    getTables,
    addEditTable,
    getTableById,
    getTableStats,
    methods
  };
};

