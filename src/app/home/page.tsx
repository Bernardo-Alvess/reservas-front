'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useRestaurant } from "@/app/hooks/useRestaurant";
import { useRouter } from "next/navigation";
import Link from "next/link";

const RestaurantSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const {getRestaurants} = useRestaurant();

  const {data} = useQuery({
    queryKey: ['restaurants'],
    queryFn: () => getRestaurants()
  })

  return (
    <div className="space-y-6 p-4">
      <div className="bg-gradient-to-r from-orange-500 to-black text-white py-16 px-4 rounded-xl">
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
                  className="pl-10 h-12 text-lg bg-white/95 border-0"
                />
              </div>
              <Button size="lg" className="h-12 px-8 bg-white text-primary hover:bg-white/90">
                Buscar
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 justify-center">
        {["Todos", "Italiana", "Japonesa", "Brasileira", "Francesa", "Steakhouse"].map((filter) => (
          <Badge
            key={filter}
            variant={filter === "Todos" ? "default" : "secondary"}
            className="px-4 py-2 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            {filter}
          </Badge>
        ))}
      </div>

      {/* Restaurant Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.map((restaurant: any) => (
          <Card key={restaurant._id} className="overflow-hidden hover-lift cursor-pointer group">
            <Link href={`/restaurant/${restaurant._id}`}>
              <div className="relative h-48 overflow-hidden">
                <img
                  src={"https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
                  alt={restaurant.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 pb-2"
                />
                {/* <div className="absolute top-4 right-4">
                  <Badge className="bg-white/90 text-primary">
                    {restaurant.availability}
                  </Badge>
                </div> */}
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
                  {/* <div className="flex items-center gap-1 text-sm">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    {restaurant.rating}
                  </div> */}
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-4">
                  {restaurant.description}
                </p>
                
                <div className="flex items-center justify-between text-sm mb-4">
                  <div className="flex items-center gap-4">
                    {/* <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {restaurant.time}
                    </span> */}
                    <Badge variant="outline">{restaurant.type}</Badge>
                    {/* <span className="font-semibold">{restaurant.price}</span> */}
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
    </div>
  );
};

export default RestaurantSearch;