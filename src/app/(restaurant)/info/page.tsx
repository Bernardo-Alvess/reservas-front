'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useRestaurant } from '@/app/hooks/useRestaurant';
import { toast } from 'react-toastify';
import { Upload, X, ImageIcon, FileText } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import Sidemenu from '@/app/components/Sidemenu';
import { useForm } from 'react-hook-form';
import { CreateRestaurantDto, WorkHoursDto } from '@/types/restaurant';
import { Checkbox } from "@/components/ui/checkbox";

const DAYS_OF_WEEK = [
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado',
    'Domingo',
];

const Restaurante = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [newGalleryImageUrl, setNewGalleryImageUrl] = useState('');
    const [id, setId] = useState<string>();
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [selectedMenu, setSelectedMenu] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string>('');
    const [previewMenu, setPreviewMenu] = useState<string>('');
    const [previewGallery, setPreviewGallery] = useState<File[]>([]);
    const [selectedDays, setSelectedDays] = useState<string[]>([]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
        getValues,
    } = useForm<CreateRestaurantDto>();

    const { 
      getRestaurantById,
      updateRestaurant,
      uploadProfileImage,
      uploadMenu,
      uploadGalleryImage,
  } = useRestaurant();

    useEffect(() => {
        const id = localStorage.getItem('restauranteSelecionado');
        setId(id as string);
    }, []);

    const { data: restaurant, isLoading: isLoadingRestaurant } = useQuery({
        queryKey: ['restaurant', id],
        queryFn: () => getRestaurantById(id as string),
        enabled: !!id,
    });

    useEffect(() => {
        if (restaurant) {
            setValue('name', restaurant.name);
            setValue('phone', restaurant.phone);
            setValue('description', restaurant.description);
            setValue('type', restaurant.type);
            setValue('maxClients', restaurant.maxClients);
            setValue('maxReservationTime', restaurant.maxReservationTime);
            setValue('address', restaurant.address);
            setValue('workHours', restaurant.workHours);
            setSelectedDays(restaurant.workHours.map((wh: WorkHoursDto) => wh.day));
        }
    }, [restaurant, setValue]);

    const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        console.log(file)
        if (file) {
            setSelectedImage(file);
            setPreviewImage(URL.createObjectURL(file));

            try {
                if (id) {
                    await uploadProfileImage(id, file);
                    toast.success('Foto de perfil atualizada com sucesso!');
                }
            } catch (error) {
                toast.error('Erro ao fazer upload da imagem');
            }
        }
    };

    const handleMenuUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedMenu(file);
            setPreviewMenu(URL.createObjectURL(file));

            try {
                if (id) {
                    await uploadMenu(id, file);
                    toast.success('Cardápio atualizado com sucesso!');
                }
            } catch (error) {
                toast.error('Erro ao fazer upload do cardápio');
            }
        }
    };

    const addGalleryImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      console.log(files)
      if (files.length > 0) {
          setPreviewGallery((prev) => [...prev, ...files]);

          try {
              if (id) {
                  await uploadGalleryImage(id, files);
                  toast.success('Foto de perfil atualizada com sucesso!');
              }
          } catch (error) {
              toast.error('Erro ao fazer upload da imagem');
          }
      }
    };

    const removeGalleryImage = async (index: number) => {
        try {
            const newGallery = restaurant?.gallery.filter((_: any, i: number) => i !== index);
            await updateRestaurant(id as string, { gallery: newGallery });
            toast.success('Imagem removida da galeria!');
        } catch (error) {
            toast.error('Erro ao remover imagem da galeria');
        }
    };

    const onSubmit = async (data: CreateRestaurantDto) => {
        setIsLoading(true);

        try {
            await updateRestaurant(id as string, data);
            toast.success('Informações do restaurante atualizadas com sucesso!');
        } catch (error) {
            toast.error('Erro ao salvar alterações');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGalleryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            setPreviewGallery((prev) => [...prev, ...files]);

            try {
                if (id) {
                    await uploadGalleryImage(id, files);
                    toast.success('Imagem salva com sucesso.');
                }
            } catch (error) {
                toast.error('Erro ao fazer upload da imagem');
            }
        }
    };

    const removePreviewImage = (index: number) => {
        setPreviewGallery((prev) => prev.filter((_, i) => i !== index));
    };

    const handleDayToggle = (day: string, checked: boolean) => {
        const newSelectedDays = checked
            ? [...selectedDays, day]
            : selectedDays.filter((d) => d !== day);
        setSelectedDays(newSelectedDays);

        const currentWorkHours = getValues("workHours") || [];
        if (checked) {
            setValue("workHours", [...currentWorkHours, { day, open: "", close: "" }]);
        } else {
            setValue("workHours", currentWorkHours.filter((wh: WorkHoursDto) => wh.day !== day));
        }
    };

    if (isLoadingRestaurant) return <div>Carregando...</div>;
    if (!id) return <div>Carregando por conta do id...</div>;

    return (
        <div className="flex h-screen">
            <Sidemenu />
            <main className="flex-1 p-6 space-y-6 overflow-auto bg-zinc-100">
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Configurações do Restaurante
                        </h1>
                        <p className="text-muted-foreground">
                            Gerencie as informações e configurações do seu restaurante.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Informações Básicas */}
                        <Card className="p-2">
                            <CardHeader>
                                <CardTitle>Informações Básicas</CardTitle>
                                <CardDescription>Dados principais do restaurante</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Nome do Restaurante</Label>
                                        <Input
                                            id="name"
                                            {...register('name', {
                                                required: 'Nome é obrigatório',
                                            })}
                                        />
                                        {errors.name && (
                                            <p className="text-sm text-red-500">
                                                {errors.name.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Telefone</Label>
                                        <Input
                                            id="phone"
                                            {...register('phone', {
                                                required: 'Telefone é obrigatório',
                                            })}
                                        />
                                        {errors.phone && (
                                            <p className="text-sm text-red-500">
                                                {errors.phone.message}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Descrição</Label>
                                    <Textarea
                                        id="description"
                                        {...register('description', {
                                            required: 'Descrição é obrigatória',
                                        })}
                                        rows={3}
                                    />
                                    {errors.description && (
                                        <p className="text-sm text-red-500">
                                            {errors.description.message}
                                        </p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="type">Tipo de Culinária</Label>
                                        <Input
                                            id="type"
                                            {...register('type', {
                                                required: 'Tipo é obrigatório',
                                            })}
                                        />
                                        {errors.type && (
                                            <p className="text-sm text-red-500">
                                                {errors.type.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="maxClients">Capacidade Máxima</Label>
                                        <Input
                                            id="maxClients"
                                            type="number"
                                            {...register('maxClients', {
                                                required: 'Capacidade é obrigatória',
                                                valueAsNumber: true,
                                            })}
                                        />
                                        {errors.maxClients && (
                                            <p className="text-sm text-red-500">
                                                {errors.maxClients.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="maxReservationTime">
                                            Tempo Máximo de Reserva (min)
                                        </Label>
                                        <Input
                                            id="maxReservationTime"
                                            type="number"
                                            {...register('maxReservationTime', {
                                                valueAsNumber: true,
                                            })}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Endereço */}
                        <Card className="p-2">
                            <CardHeader>
                                <CardTitle>Endereço</CardTitle>
                                <CardDescription>Localização do restaurante</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="md:col-span-3 space-y-2">
                                        <Label htmlFor="street">Rua</Label>
                                        <Input
                                            id="street"
                                            {...register('address.street', {
                                                required: 'Rua é obrigatória',
                                            })}
                                        />
                                        {errors.address?.street && (
                                            <p className="text-sm text-red-500">
                                                {errors.address.street.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="number">Número</Label>
                                        <Input
                                            id="number"
                                            {...register('address.number', {
                                                required: 'Número é obrigatório',
                                            })}
                                        />
                                        {errors.address?.number && (
                                            <p className="text-sm text-red-500">
                                                {errors.address.number.message}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="neighborhood">Bairro</Label>
                                        <Input
                                            id="district"
                                            {...register('address.district', {
                                                required: 'Bairro é obrigatório',
                                            })}
                                        />
                                        {errors.address?.district && (
                                            <p className="text-sm text-red-500">
                                                {errors.address.district.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="complement">Complemento</Label>
                                        <Input
                                            id="complement"
                                            {...register('address.complement')}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="city">Cidade</Label>
                                        <Input
                                            id="city"
                                            {...register('address.city', {
                                                required: 'Cidade é obrigatória',
                                            })}
                                        />
                                        {errors.address?.city && (
                                            <p className="text-sm text-red-500">
                                                {errors.address.city.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="state">Estado</Label>
                                        <Input
                                            id="state"
                                            {...register('address.state', {
                                                required: 'Estado é obrigatório',
                                            })}
                                        />
                                        {errors.address?.state && (
                                            <p className="text-sm text-red-500">
                                                {errors.address.state.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="zipCode">CEP</Label>
                                        <Input
                                            id="zipCode"
                                            {...register('address.zipCode', {
                                                required: 'CEP é obrigatório',
                                            })}
                                        />
                                        {errors.address?.zipCode && (
                                            <p className="text-sm text-red-500">
                                                {errors.address.zipCode.message}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Horários de Funcionamento */}
                        <Card className="p-2">
                            <CardHeader>
                                <CardTitle>Horários de Funcionamento</CardTitle>
                                <CardDescription>
                                    Selecione os dias e defina os horários de funcionamento
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {DAYS_OF_WEEK.map((day) => (
                                        <div key={day} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={day}
                                                checked={selectedDays.includes(day)}
                                                onCheckedChange={(checked) => handleDayToggle(day, checked as boolean)}
                                            />
                                            <label
                                                htmlFor={day}
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                                {day}
                                            </label>
                                        </div>
                                    ))}
                                </div>

                                {selectedDays.map((day, index) => {
                                    const workHourIndex = getValues("workHours")?.findIndex(wh => wh.day === day) ?? -1;
                                    if (workHourIndex === -1) return null;

                                    return (
                                        <div key={day} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                                            <div className="space-y-2">
                                                <Label>{day}</Label>
                                                <Input value={day} disabled />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor={`open-${index}`}>Abertura</Label>
                                                <Input
                                                    id={`open-${index}`}
                                                    type="time"
                                                    {...register(`workHours.${workHourIndex}.open` as const, {
                                                        required: 'Horário de abertura é obrigatório',
                                                    })}
                                                    value={getValues(`workHours.${workHourIndex}.open`) || ""}
                                                />
                                                {errors.workHours?.[workHourIndex]?.open && (
                                                    <p className="text-sm text-red-500">
                                                        {errors.workHours[workHourIndex]?.open?.message}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor={`close-${index}`}>Fechamento</Label>
                                                <Input
                                                    id={`close-${index}`}
                                                    type="time"
                                                    {...register(`workHours.${workHourIndex}.close` as const, {
                                                        required: 'Horário de fechamento é obrigatório',
                                                    })}
                                                    value={getValues(`workHours.${workHourIndex}.close`) || ""}
                                                />
                                                {errors.workHours?.[workHourIndex]?.close && (
                                                    <p className="text-sm text-red-500">
                                                        {errors.workHours[workHourIndex]?.close?.message}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </CardContent>
                        </Card>

                        {/* Foto de Perfil */}
                        <Card className="p-2">
                            <CardHeader>
                                <CardTitle>Foto de Perfil</CardTitle>
                                <CardDescription>Imagem principal do restaurante</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center space-x-4">
                                    {(previewImage || restaurant?.profileImage) && (
                                        <img
                                            src={
                                                restaurant?.profileImage?.url ||
                                                '/images/image-placeholder.jpg'
                                            }
                                            alt="Foto de perfil"
                                            className="w-20 h-20 rounded-lg object-cover"
                                        />
                                    )}
                                    <div>
                                        <Label htmlFor="profile-image" className="cursor-pointer">
                                        <span className="inline-flex items-center space-x-2 border border-input bg-background hover:bg-accent px-4 py-2 rounded-md text-sm">                                                <Upload className="w-4 h-4 mr-2" />
                                            {restaurant?.profileImage
                                                ? 'Alterar Foto de Perfil'
                                                : 'Adicionar Foto de Perfil'}
                                            </span>
                                            <input
                                                id="profile-image"
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleProfileImageUpload}
                                            />
                                        </Label>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Galeria de Imagens */}
                        <Card className="p-2">
                            <CardHeader>
                                <CardTitle>Galeria de Imagens</CardTitle>
                                <CardDescription>
                                    Adicione ou remova fotos do restaurante
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* <div className="flex space-x-2">
                  <Input
                    placeholder="URL da imagem"
                    value={newGalleryImageUrl}
                    onChange={(e) => setNewGalleryImageUrl(e.target.value)}
                  />
                  <Button type="button" variant="outline" onClick={() => addGalleryImage(newGalleryImageUrl)}>
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Adicionar
                  </Button>
                </div> */}
                                <div className="space-y-2">
                                    <input
                                        id="gallery-upload"
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        className="hidden"
                                        onChange={handleGalleryImageUpload}
                                    />
                                    <Label htmlFor="gallery-upload" className="cursor-pointer">
                                        <span className="inline-flex items-center space-x-2 border border-input bg-background hover:bg-accent px-4 py-2 rounded-md text-sm">
                                            <Upload className="w-4 h-4" />
                                            <span>Selecionar Imagens</span>
                                        </span>
                                    </Label>

                                    {previewGallery.length > 0 && (
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                            {previewGallery.map((img, index) => (
                                                <div key={index} className="relative group">
                                                    <img
                                                        src={URL.createObjectURL(img)}
                                                        alt={`Preview ${index}`}
                                                        className="w-full h-24 rounded-lg object-cover"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="icon"
                                                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6"
                                                        onClick={() => removePreviewImage(index)}
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {restaurant?.gallery?.map((image: any, index: number) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={image.url}
                                                alt={`Galeria ${index + 1}`}
                                                className="w-full h-24 rounded-lg object-cover"
                                            />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6"
                                                onClick={() => removeGalleryImage(index)}
                                            >
                                                <X className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Cardápio */}
                        <Card className="p-2">
                            <CardHeader>
                                <CardTitle>Cardápio</CardTitle>
                                <CardDescription>Upload do cardápio em formato PDF</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center space-x-4">
                                    {(previewMenu || restaurant?.menu) && (
                                        <div className="flex items-center space-x-2 p-2 border rounded-lg">
                                            <FileText className="w-4 h-4" />
                                            <span className="text-sm">
                                                {selectedMenu?.name || restaurant?.menu?.url}
                                            </span>
                                        </div>
                                    )}
                                    <div>
                                        <Label htmlFor="menu-upload" className="cursor-pointer">
                                        <span className="inline-flex items-center space-x-2 border border-input bg-background hover:bg-accent px-4 py-2 rounded-md text-sm">
                                                <Upload className="w-4 h-4 mr-2" />
                                                {restaurant?.menu
                                                    ? 'Alterar Cardápio'
                                                    : 'Adicionar Cardápio'}
                                            </span>
                                            <input
                                                id="menu-upload"
                                                type="file"
                                                accept=".pdf"
                                                className="hidden"
                                                onChange={handleMenuUpload}
                                            />
                                        </Label>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex justify-end">
                            <Button type="submit" size="lg" disabled={isLoading}>
                                {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                            </Button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default Restaurante;
