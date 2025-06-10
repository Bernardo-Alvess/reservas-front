'use client'

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface RestaurantContextType {
  selectedRestaurant: string | null;
  setSelectedRestaurant: (id: string | null) => void;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export function RestaurantProvider({ children }: { children: ReactNode }) {
  const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(null);

  useEffect(() => {
    const restaurant = localStorage.getItem('restauranteSelecionado');
    setSelectedRestaurant(restaurant);
  }, []);

  const updateSelectedRestaurant = (id: string | null) => {
    setSelectedRestaurant(id);
    if (id) {
      localStorage.setItem('restauranteSelecionado', id);
    } else {
      localStorage.removeItem('restauranteSelecionado');
    }
  };

  return (
    <RestaurantContext.Provider value={{ 
      selectedRestaurant, 
      setSelectedRestaurant: updateSelectedRestaurant 
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