'use client'

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface RestaurantContextType {
  selectedRestaurant: string | null;
  setSelectedRestaurant: (id: string | null) => void;
  autoSelectRestaurant: (userData: any) => void;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export function RestaurantProvider({ children }: { children: ReactNode }) {
  const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(null);

  const updateSelectedRestaurant = (id: string | null) => {
    setSelectedRestaurant(id);
    if (id) {
      localStorage.setItem('restauranteSelecionado', id);
    } else {
      localStorage.removeItem('restauranteSelecionado');
    }
  };

  // Função para auto-selecionar restaurante baseado nos dados do usuário
  const autoSelectRestaurant = (userData: any) => {
    if (!userData || !userData.restaurant || userData.restaurant.length === 0) {
      return;
    }

    const currentSelected = localStorage.getItem('restauranteSelecionado');
    
    // Se usuário não é company, sempre auto-selecionar o primeiro restaurante
    if (userData.type !== 'company' && userData.restaurant.length > 0) {
      const restaurantId = userData.restaurant[0]._id;
      updateSelectedRestaurant(restaurantId);
      return;
    }
    
    // Se usuário é company e tem apenas 1 restaurante, auto-selecionar
    if (userData.type === 'company' && userData.restaurant.length === 1) {
      const restaurantId = userData.restaurant[0]._id;
      updateSelectedRestaurant(restaurantId);
      return;
    }
    
    // Se já tem um restaurante selecionado, verificar se ainda é válido
    if (currentSelected) {
      const isValidSelection = userData.restaurant.some((r: any) => r._id === currentSelected);
      if (!isValidSelection) {
        updateSelectedRestaurant(null);
      } else {
        // Se é válido, atualizar o estado para garantir sincronização
        setSelectedRestaurant(currentSelected);
      }
    }
  };

  useEffect(() => {
    const restaurant = localStorage.getItem('restauranteSelecionado');
    setSelectedRestaurant(restaurant);

    // Listener para quando os dados do usuário são carregados
    const handleUserDataLoaded = (event: CustomEvent) => {
      autoSelectRestaurant(event.detail);
    };

    window.addEventListener('userDataLoaded', handleUserDataLoaded as EventListener);

    return () => {
      window.removeEventListener('userDataLoaded', handleUserDataLoaded as EventListener);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <RestaurantContext.Provider value={{ 
      selectedRestaurant, 
      setSelectedRestaurant: updateSelectedRestaurant,
      autoSelectRestaurant
    }}>
      {children}
    </RestaurantContext.Provider>
  );
}

export function useRestaurantContext() {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurantContext must be used within RestaurantProvider');
  }
  return context;
}