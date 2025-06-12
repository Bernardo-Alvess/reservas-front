'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, Phone, Globe, Users, ArrowLeft, ChefHat, BookOpenText } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useRestaurant } from "@/app/hooks/useRestaurant";
import { useQuery } from "@tanstack/react-query";
import { ReservationModal } from "@/components/ReservationModal";
import { useUserContext } from "@/app/context/user/useUserContext";

const RestaurantPage = () => {
  const { id } = useParams();
  const [reservationModalOpen, setReservationModalOpen] = useState(false);
  const { user } = useUserContext();

  const { getRestaurantById } = useRestaurant();

  const { data: restaurant, isLoading } = useQuery({
    queryKey: ['restaurant', id],
    queryFn: () => getRestaurantById(id as string),
  });

  const restaurantMock = {
    id: 1,
    name: "Bella Vista",
    cuisine: "Italiana",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    location: "Centro, São Paulo",
    address: "Rua Augusta, 123 - Centro, São Paulo - SP",
    phone: "(11) 3333-4444",
    website: "www.bellavista.com.br",
    price: "$$",
    time: "30-45 min",
    availability: "Disponível hoje",
    description: "Autêntica cozinha italiana em ambiente aconchegante. Nossa tradição familiar se reflete em cada prato, preparado com ingredientes frescos e receitas transmitidas por gerações.",
    hours: {
      "Segunda": "Fechado",
      "Terça": "18:00 - 23:00",
      "Quarta": "18:00 - 23:00", 
      "Quinta": "18:00 - 23:00",
      "Sexta": "18:00 - 00:00",
      "Sábado": "12:00 - 00:00",
      "Domingo": "12:00 - 22:00"
    },
    specialties: ["Risotto de Cogumelos", "Osso Buco", "Tiramisu", "Pasta Carbonara"],
    amenities: ["Wi-Fi", "Estacionamento", "Ar Condicionado", "Aceita Cartão", "Delivery"],
    gallery: [
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1481833761820-0509d3217039?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      {isLoading ? (<div>Carregando...</div>) : (
        <>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Link href="/">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar à busca
        </Button>
      </Link>

      {/* Hero Section */}
      <div className="relative h-96 rounded-xl overflow-hidden mb-8">
        <img
          src={'https://images.unsplash.com/photo-1721322800607-8c38375eef04?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-end">
          <div className="p-8 text-white">
            <div className="flex items-center gap-2 mb-2">
              {/* <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="text-lg font-semibold">{restaurant.rating}</span> */}
              <Badge variant="secondary" className="ml-2">{restaurant.type}</Badge>
            </div>
            <h1 className="text-4xl font-bold mb-2">{restaurant.name}</h1>
            <p className="text-lg opacity-90 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              {restaurant.address.city}, {restaurant.address.district}, {restaurant.address.street}, {restaurant.address.number}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* About */}
          <Card>
            <CardHeader>
              <CardTitle>Sobre o Restaurante</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">{restaurant.description}</p>
              
              <div className="flex gap-10">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4" />
                  {restaurant.phone}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <ChefHat className="w-4 h-4" />
                  {restaurant.type}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <BookOpenText className="w-4 h-4" />
                  <Link href={'#'} target="_blank">Acessar cardápio</Link>
                </div>
              </div>

              <Separator className="my-6" />

              <div>
                <h3 className="font-semibold mb-3">Especialidades</h3>
                <div className="flex flex-wrap gap-2">
                  {restaurantMock.specialties.map((specialty: string) => (
                    <Badge key={specialty} variant="outline">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Gallery */}
          <Card>
            <CardHeader>
              <CardTitle>Galeria</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {restaurantMock.gallery.map((image: string, index: number) => (
                  <div key={index} className="aspect-video rounded-lg overflow-hidden">
                    <img
                      src={image}
                      alt={`${restaurant.name} - Foto ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Hours */}
          {/* <Card>
            <CardHeader>
              <CardTitle>Horário de Funcionamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(restaurant.hours).map(([day, hours]) => (
                  <div key={day} className="flex justify-between">
                    <span className="font-medium">{day}</span>
                    <span className={hours === "Fechado" ? "text-muted-foreground" : ""}>
                      {hours}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card> */}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Reservation Card */}
          <Card>
            <CardHeader>
              <CardTitle>Fazer Reserva</CardTitle>
              <CardDescription>
                Reserve sua mesa agora mesmo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full" 
                size="lg"
                onClick={() => setReservationModalOpen(true)}
                disabled={(!user || restaurant.tables.length === 0)}
              >
                <Users className="w-4 h-4 mr-2" />
                {restaurant.tables.length === 0 ? 'Não há mesas disponíveis' : user ? 'Reservar Mesa' : 'Faça login para reservar'}
              </Button>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle>Informações de Contato</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{restaurant.address.city}, {restaurant.address.district}, {restaurant.address.street}, {restaurant.address.number}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{restaurant.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{restaurant.website || 'Não possui site'}</span>
              </div>
            </CardContent>
          </Card>

          {/* Amenities */}
          {/* <Card>
            <CardHeader>
              <CardTitle>Comodidades</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {restaurant.amenities.map((amenity) => (
                  <Badge key={amenity} variant="secondary">
                    {amenity}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card> */}
        </div>
      </div>
    </div>

      <ReservationModal
        open={reservationModalOpen}
        onOpenChange={setReservationModalOpen}
        restaurant={{ id: restaurant._id, name: restaurant.name, image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" }}
      />
    </>
    )}

    </div>
  );
};

export default RestaurantPage;
