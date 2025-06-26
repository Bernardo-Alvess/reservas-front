'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useRestaurant } from "@/app/hooks/useRestaurant";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PaginationComponent } from "@/components/Pagination";

const RestaurantSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const router = useRouter();
  const { getRestaurants, getCuisineTypes } = useRestaurant();

  const itemsPerPage = 6;

  // Debounce da pesquisa para evitar muitas requisições
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset para primeira página quando pesquisar
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset da página quando o tipo muda
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedType]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['restaurants', debouncedSearchTerm, selectedType, currentPage],
    queryFn: () => getRestaurants({
      search: debouncedSearchTerm || undefined,
      type: selectedType || undefined,
      page: currentPage,
      limit: itemsPerPage
    }),
  });

  const { data: cuisineTypes } = useQuery({
    queryKey: ['cuisine-types'],
    queryFn: () => getCuisineTypes(),
    staleTime: 300000, // Cache por 5 minutos
  });

  const restaurants = data?.data || [];
  
  // Criando objeto pagination compatível com PaginationComponent
  const pagination = data?.meta ? {
    currentPage: data.meta.currentPage || currentPage,
    totalPages: data.meta.totalPages || Math.ceil((data.meta.totalItems || data.meta.total || 0) / itemsPerPage),
    totalItems: data.meta.totalItems || data.meta.total || 0,
    hasNextPage: data.meta.hasNextPage || false,
    hasPreviousPage: data.meta.hasPreviousPage || false,
    limit: itemsPerPage
  } : {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNextPage: false,
    hasPreviousPage: false,
    limit: itemsPerPage
  };

  const handleSearch = () => {
    setDebouncedSearchTerm(searchTerm);
    setCurrentPage(1);
  };

  const handleTypeFilter = (type: string) => {
    setSelectedType(type === selectedType ? "" : type);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-6 p-4">
      <div className="bg-gradient-to-r from-red-500 to-black text-white py-16 px-4 rounded-xl">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            Encontre o Restaurante Perfeito
          </h1>
          <p className="text-xl mb-8 opacity-90 animate-slide-up">
            Reserve uma mesa em segundos nos melhores restaurantes da cidade
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative animate-slide-up">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  placeholder="Busque por restaurante ou tipo de culinária..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10 h-12 text-lg bg-white/95 border-0 text-black"
                />
              </div>
              <Button 
                size="lg" 
                className="h-12 px-8 bg-white text-primary hover:bg-white/90"
                onClick={handleSearch}
                disabled={isLoading}
              >
                {isLoading ? 'Buscando...' : 'Buscar'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 justify-center">
        <Badge
          variant={selectedType === "" ? "default" : "secondary"}
          className="px-4 py-2 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
          onClick={() => handleTypeFilter("")}
        >
          Todos
        </Badge>
        {cuisineTypes?.map((type: string, index: number) => (
          <Badge
            key={index}
            variant={selectedType === type ? "default" : "secondary"}
            className="px-4 py-2 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
            onClick={() => handleTypeFilter(type)}
          >
            {type}
          </Badge>
        ))}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Carregando restaurantes...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-8">
          <p className="text-red-500">Erro ao carregar restaurantes. Tente novamente.</p>
        </div>
      )}

      {/* Restaurant Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.map((restaurant: any) => (
          <Card key={restaurant._id} className="overflow-hidden hover-lift cursor-pointer group pb-2">
            <Link href={`/restaurant/${restaurant._id}`}>
              <div className="relative h-48 overflow-hidden">
                <img
                  src={restaurant.profileImage?.url || "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
                  alt={restaurant.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 pb-2"
                />
              </div>
              
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {restaurant.name}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <MapPin className="w-4 h-4" />
                      {restaurant.address.city}, {restaurant.address.street}, {restaurant.address.number}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
              <p
              className="text-gray-600 text-sm mb-2 break-words overflow-hidden"
              style={{
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 3, // número de linhas visíveis
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {restaurant.description}
            </p>
                
                <div className="flex items-center justify-between text-sm mb-4">
                  <div className="flex items-center gap-4">
                    <Badge variant="outline">{restaurant.type}</Badge>
                  </div>
                </div>
              </CardContent>

              <CardContent className="pt-0">
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={(e) => {
                    e.preventDefault();
                    router.push(`/restaurant/${restaurant._id}`);
                  }}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Reservar Mesa
                </Button>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>

      {/* Pagination - Usando o componente padrão da aplicação */}
      <PaginationComponent 
        pagination={pagination} 
        currentPage={currentPage} 
        handlePageChange={handlePageChange} 
      />
    </div>
  );
};

export default RestaurantSearch;