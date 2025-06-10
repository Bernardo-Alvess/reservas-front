'use client'
import { useState } from "react";
import { toast } from "react-toastify";
import { API_URL } from "../configs/constants";
import { useRestaurantContext } from "../context/selectedRestaurant/selectedRestaurantContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TableData, TableSchema } from "../(restaurant)/tables/table.schema";

export interface Table {
  _id: string;
  tableNumber: number;
  numberOfSeats: number;
  status: "disponível" | "ocupada" | "reservada" | "manutenção";
  location: string;
}

export const useTables = () => {
  const {selectedRestaurant} = useRestaurantContext()
  const [tables, setTables] = useState<Table[]>();

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

  // const getTablesByStatus = (status: Table["status"]) => {
  //   return tables.filter(table => table.status === status);
  // };

  // const addTable = (newTable: Omit<Table, "id">) => {
  //   const newId = Math.max(...tables.map(t => t.id)) + 1;
  //   setTables([...tables, { ...newTable, id: newId }]);
  // };

  // const updateTableStatus = (id: number, status: Table["status"]) => {
  //   setTables(tables.map(table => 
  //     table.id === id ? { ...table, status } : table
  //   ));
  // };

  // const getTablesByStatus = async (status: Table["status"]) => {
  //   const response = await fetch(`${API_URL}/tables/list/${selectedRestaurant}?status=${status}`, {
  //     credentials: 'include'
  //   })
  //   const data = await response.json()
  //   setTables(data)
  // }

  const getTables = async () => {
    try {
      const id = localStorage.getItem('restauranteSelecionado')
      console.log(id)
      const response = await fetch(`${API_URL}tables/list/${id}`, {
        credentials: 'include'
      })
      const data = await response.json()
      return data
    }catch(err) {
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
      toast.error('Erro ao adicionar mesa')
      throw err
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
      toast.error('Erro ao buscar mesa')
    }
  }

  return {
    tables,
    getTables,
    addEditTable,
    getTableById,
    methods
  };
};

