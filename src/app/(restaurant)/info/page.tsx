'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useRestaurant } from '@/app/hooks/useRestaurant';
import { toast } from 'react-toastify';
import { Upload, X, FileText, Download } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Sidemenu from '@/components/Sidemenu';
import { useForm, Controller } from 'react-hook-form';
import { CreateRestaurantDto, WorkHoursDto } from '@/types/restaurant';
import { Checkbox } from "@/components/ui/checkbox";
import "react-datepicker/dist/react-datepicker.css";
import { TimeInput } from '@/components/TimeInput';
import { mapDay, reverseMapDay } from '@/lib/mapDay';
import { MenuModal } from '@/components/MenuModal';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DAYS_OF_WEEK = [
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado',
    'Domingo',
];

// Função para validar formato de hora (hh:mm)
const validateTimeFormat = (value: string) => {
    if (!value) return 'Horário é obrigatório';
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(value)) {
        return 'Formato deve ser hh:mm (ex: 08:30, 18:45)';
    }
    return true;
};

// Função para validar horários de funcionamento
const validateWorkHours = (workHours: WorkHoursDto[]) => {
    if (!workHours || workHours.length === 0) {
        return 'Pelo menos um dia de funcionamento deve ser selecionado';
    }
    
    for (const wh of workHours) {
        const openValidation = validateTimeFormat(wh.open);
        const closeValidation = validateTimeFormat(wh.close);
        
        if (openValidation !== true) return openValidation;
        if (closeValidation !== true) return closeValidation;
    }
    
    return true;
};

const Restaurante = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [id, setId] = useState<string>();
    const [menuUrl, setMenuUrl] = useState<string>('');
    const [previewImage, setPreviewImage] = useState<File>();
    const [previewMenu, setPreviewMenu] = useState<string>('');
    const [previewGallery, setPreviewGallery] = useState<File[]>([]);
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const [openMenuModal, setOpenMenuModal] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        getValues,
        control,
        trigger,
        reset
    } = useForm<CreateRestaurantDto>({
        mode: 'onChange'
    });

    const { 
      getRestaurantById,
      updateRestaurant,
      uploadProfileImage,
      uploadMenu,
      uploadGalleryImage,
      deleteGalleryImage
  } = useRestaurant();

    const queryClient = useQueryClient();

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
            reset({
                name: restaurant.name,
                phone: restaurant.phone,
                description: restaurant.description,
                // type: restaurant.type,
                maxClients: restaurant.maxClients,
                maxReservationTime: restaurant.maxReservationTime,
                address: restaurant.address,
                workHours: restaurant.workHours
            });
            setSelectedDays(restaurant.workHours.map((wh: WorkHoursDto) => wh.day));
            setMenuUrl(restaurant?.menu?.url);
            console.log(restaurant.type)
            setValue('type', restaurant.type);
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [restaurant, reset]);

    const downloadQrCode = () => {
        const qrCodeUrl = restaurant?.qrCode;
        if (qrCodeUrl) {
            const link = document.createElement('a');
            link.href = qrCodeUrl;
            link.download = 'qr-code.png';
            link.click();
        }
    }

    const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validar tipo de arquivo
            if (!file.type.startsWith('image/')) {
                toast.error('Por favor, selecione apenas arquivos de imagem');
                return;
            }
            
            // Validar tamanho (máximo 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('A imagem deve ter no máximo 5MB');
                return;
            }
            
            setPreviewImage(file);
            try {
                if (id) {
                    await uploadProfileImage(id, file);
                    
                    queryClient.invalidateQueries({ queryKey: ['restaurant', id] });
                    
                    toast.success('Foto de perfil atualizada com sucesso!');
                }
            } catch (error) {
                console.log(error)
                toast.error('Erro ao fazer upload da imagem');
            }
        }
    };

    const handleMenuUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validar tipo de arquivo
            if (file.type !== 'application/pdf') {
                toast.error('Por favor, selecione apenas arquivos PDF');
                return;
            }
            
            // Validar tamanho (máximo 10MB)
            if (file.size > 10 * 1024 * 1024) {
                toast.error('O arquivo PDF deve ter no máximo 10MB');
                return;
            }
            
            setPreviewMenu(URL.createObjectURL(file));

            try {
                if (id) {
                    const upload = await uploadMenu(id, file);
                    setMenuUrl(upload.url);
                    
                    queryClient.invalidateQueries({ queryKey: ['restaurant', id] });
                    
                    toast.success('Cardápio atualizado com sucesso!');
                }
            } catch (error) {
                console.log(error)
                toast.error('Erro ao fazer upload do cardápio');
            }
        }
    };

    const removeGalleryImage = async (index: number) => {
        try {
            const publicId = restaurant?.gallery[index].publicId;
            await deleteGalleryImage(publicId);
            
            queryClient.invalidateQueries({ queryKey: ['restaurant', id] });
            
        } catch (error) {
            console.log(error);
            toast.error('Erro ao remover imagem da galeria');
        }
    };

    const onSubmit = async (data: CreateRestaurantDto) => {
        setIsLoading(true);

        // Validar horários de funcionamento
        const workHoursValidation = validateWorkHours(data.workHours);
        if (workHoursValidation !== true) {
            toast.error(workHoursValidation);
            setIsLoading(false);
            return;
        }

        try {
            await updateRestaurant(id as string, data);
            toast.success('Informações do restaurante atualizadas com sucesso!');
        } catch (error) {
            console.log(error)
            toast.error('Erro ao salvar alterações');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGalleryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            // Validar tipos de arquivo
            const invalidFiles = files.filter(file => !file.type.startsWith('image/'));
            if (invalidFiles.length > 0) {
                toast.error('Por favor, selecione apenas arquivos de imagem');
                return;
            }
            
            // Validar tamanhos (máximo 5MB cada)
            const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);
            if (oversizedFiles.length > 0) {
                toast.error('Cada imagem deve ter no máximo 5MB');
                return;
            }
            
            // Validar quantidade máxima (10 imagens)
            const currentGalleryCount = restaurant?.gallery?.length || 0;
            if (currentGalleryCount + files.length > 10) {
                toast.error('Máximo de 10 imagens na galeria');
                return;
            }
            
            setPreviewGallery((prev) => [...prev, ...files]);

            try {
                if (id) {
                    await uploadGalleryImage(id, files);
                    
                    queryClient.invalidateQueries({ queryKey: ['restaurant', id] });
                    
                    setPreviewGallery([]);
                    
                    toast.success('Imagem salva com sucesso.');
                }
            } catch (error) {
                console.log(error)
                toast.error('Erro ao fazer upload da imagem');
            }
        }
    };

    const handleDayToggle = async (day: string, checked: boolean) => {
        const dayInEnglish = reverseMapDay(day);
        
        const newSelectedDays = checked
            ? [...selectedDays, dayInEnglish]
            : selectedDays.filter((d) => d !== dayInEnglish);
        setSelectedDays(newSelectedDays);

        const currentWorkHours = getValues("workHours") || [];
        if (checked) {
            setValue("workHours", [...currentWorkHours, { day: dayInEnglish, open: "", close: "" }]);
        } else {
            setValue("workHours", currentWorkHours.filter((wh: WorkHoursDto) => wh.day !== dayInEnglish));
        }
        
        // Trigger validation para workHours
        await trigger("workHours");
    };

    if (isLoadingRestaurant) return (
        <div className="flex min-h-screen w-full">
            <Sidemenu />
            <main className="flex p-6 bg-zinc-100 w-full justify-start">
                <LoadingSpinner 
                    text="Carregando informações do restaurante..." 
                    size="lg"
                    fullScreen
                />
            </main>
        </div>
    );
    
    if (!id) return (
        <div className="flex min-h-screen w-full">
            <Sidemenu />
            <main className="flex p-6 bg-zinc-100 w-full justify-start">
                <LoadingSpinner 
                    text="Inicializando..." 
                    size="lg"
                    fullScreen
                />
            </main>
        </div>
    );

    const getMenuName = (menuName?: string) => {
        if (!menuName) return 'Cardápio';

        const menuNameWithoutExtension = menuName.split('/').pop();
        return menuNameWithoutExtension;
    }

    return (
        <div className="flex min-h-screen w-full">
            <Sidemenu />
            <main className="flex p-6 bg-zinc-100 w-full justify-start">
                <div className="flex flex-col space-y-6 w-full">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Configurações do Restaurante
                        </h1>
                        <p className="text-muted-foreground">
                            Gerencie as informações e configurações do seu restaurante.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 space-y-6 pb-8">
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
                                                minLength: {
                                                    value: 2,
                                                    message: 'Nome deve ter pelo menos 2 caracteres'
                                                },
                                                maxLength: {
                                                    value: 100,
                                                    message: 'Nome deve ter no máximo 100 caracteres'
                                                }
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
                                            placeholder="(11) 99999-9999"
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
                                            minLength: {
                                                value: 10,
                                                message: 'Descrição deve ter pelo menos 10 caracteres'
                                            },
                                            maxLength: {
                                                value: 500,
                                                message: 'Descrição deve ter no máximo 500 caracteres'
                                            }
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
                                        <Controller
                                            name="type"
                                            control={control}
                                            rules={{
                                                required: 'Tipo de culinária é obrigatório'
                                            }}
                                            render={({ field }) => (
                                                <Select 
                                                    defaultValue={restaurant?.type}
                                                    onValueChange={field.onChange} 
                                                    value={field.value} 
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione o tipo de culinária" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Italiana">Italiana</SelectItem>
                                                        <SelectItem value="Japonesa">Japonesa</SelectItem>
                                                        <SelectItem value="Brasileira">Brasileira</SelectItem>
                                                        <SelectItem value="Francesa">Francesa</SelectItem>
                                                        <SelectItem value="Steakhouse">Steakhouse</SelectItem>
                                                        <SelectItem value="Vegetariana">Vegetariana</SelectItem>
                                                        <SelectItem value="Mexicana">Mexicana</SelectItem>
                                                        <SelectItem value="Chinesa">Chinesa</SelectItem>
                                                        <SelectItem value="Tailandesa">Tailandesa</SelectItem>
                                                        <SelectItem value="Indiana">Indiana</SelectItem>
                                                        <SelectItem value="Árabe">Árabe</SelectItem>
                                                        <SelectItem value="Outro">Outro</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            )}
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
                                            min="1"
                                            max="1000"
                                            {...register('maxClients', {
                                                required: 'Capacidade é obrigatória',
                                                valueAsNumber: true,
                                                min: {
                                                    value: 1,
                                                    message: 'Capacidade deve ser pelo menos 1'
                                                },
                                                max: {
                                                    value: 1000,
                                                    message: 'Capacidade deve ser no máximo 1000'
                                                }
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
                                            min="30"
                                            max="480"
                                            {...register('maxReservationTime', {
                                                valueAsNumber: true,
                                                min: {
                                                    value: 30,
                                                    message: 'Tempo mínimo é 30 minutos'
                                                },
                                                max: {
                                                    value: 480,
                                                    message: 'Tempo máximo é 480 minutos (8 horas)'
                                                }
                                            })}
                                        />
                                        {errors.maxReservationTime && (
                                            <p className="text-sm text-red-500">
                                                {errors.maxReservationTime.message}
                                            </p>
                                        )}
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
                                                minLength: {
                                                    value: 5,
                                                    message: 'Rua deve ter pelo menos 5 caracteres'
                                                }
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
                                                pattern: {
                                                    value: /^[0-9]+[A-Za-z]*$/,
                                                    message: 'Número inválido'
                                                }
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
                                                minLength: {
                                                    value: 2,
                                                    message: 'Bairro deve ter pelo menos 2 caracteres'
                                                }
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
                                            {...register('address.complement', {
                                                maxLength: {
                                                    value: 100,
                                                    message: 'Complemento deve ter no máximo 100 caracteres'
                                                }
                                            })}
                                        />
                                        {errors.address?.complement && (
                                            <p className="text-sm text-red-500">
                                                {errors.address.complement.message}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="city">Cidade</Label>
                                        <Input
                                            id="city"
                                            {...register('address.city', {
                                                required: 'Cidade é obrigatória',
                                                minLength: {
                                                    value: 2,
                                                    message: 'Cidade deve ter pelo menos 2 caracteres'
                                                }
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
                                            placeholder="SP"
                                            maxLength={2}
                                            {...register('address.state', {
                                                required: 'Estado é obrigatório',
                                                pattern: {
                                                    value: /^[A-Z]{2}$/,
                                                    message: 'Estado deve ter 2 letras maiúsculas (ex: SP)'
                                                }
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
                                            placeholder="12345-678"
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
                                                checked={selectedDays.includes(reverseMapDay(day))}
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

                                {selectedDays.map((day) => {
                                    const workHourIndex = getValues("workHours")?.findIndex(wh => wh.day === day) ?? -1;
                                    if (workHourIndex === -1) return null;
                                    return (
                                        <div key={day} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                                            <div className="space-y-2">
                                                <Label>{mapDay(day)}</Label>
                                                <Input value={mapDay(day)} disabled />
                                            </div>
                                          <TimeInput
                                            label="Abertura"
                                            fieldName={`workHours.${workHourIndex}.open`}
                                            control={control}
                                            error={errors.workHours?.[workHourIndex]?.open}
                                          />
                                          <TimeInput
                                            label="Fechamento"
                                            fieldName={`workHours.${workHourIndex}.close`}
                                            control={control}
                                            error={errors.workHours?.[workHourIndex]?.close}
                                          />
                                        </div>
                                    );
                                })}
                            </CardContent>
                        </Card>

                        {/* Foto de Perfil */}
                        <div className="flex flex-row gap-4 w-full justify-evenly">
                            <Card className="p-2 flex flex-col justify-between w-full h-full">
                                    <CardHeader>
                                        <CardTitle>Foto de Perfil</CardTitle>
                                        <CardDescription>Imagem principal do restaurante</CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex flex-col flex-1 justify-center items-center gap-4">
                                        <div className="flex flex-col items-center gap-3 flex-1 justify-center">
                                            {(previewImage || restaurant?.profileImage ) && (
                                                <img
                                                    src={
                                                        previewImage
                                                            ? URL.createObjectURL(previewImage)
                                                            : restaurant?.profileImage?.url ||
                                                            '/images/image-placeholder.jpg'
                                                    }
                                                    alt="Foto de perfil"
                                                    className="w-48 h-48 rounded-lg object-cover"
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
                            <Card className="p-2 flex flex-col justify-start w-full">
                                <CardHeader className="w-full">
                                        <CardTitle>Qr Code para Check-in</CardTitle>
                                        <CardDescription>Apresente esse qr code para o cliente</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4 flex flex-col gap-4">
                                    <img
                                        src={restaurant?.qrCode} alt="Qr Code"
                                        className="w-3xs h-full rounded-lg object-cover border"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        onClick={() => downloadQrCode()}
                                        className="flex items-center gap-2 w-fit p-2"
                                    >
                                        <Download className="w-4 h-4" />
                                        <span>Baixar Qr Code</span>
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Galeria de Imagens */}
                        <Card className="p-2">
                            <CardHeader>
                                <CardTitle>Galeria de Imagens</CardTitle>
                                <CardDescription>
                                    Adicione ou remova fotos do restaurante
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
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
                                        <div className="flex flex-wrap gap-4">
                                            {previewGallery.map((img, index) => (
                                                <div key={index} className="relative group">
                                                    <img
                                                        src={URL.createObjectURL(img)}
                                                        alt={`Preview ${index}`}
                                                        className="w-full h-24 rounded-lg object-cover"
                                                    />
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
                                            <span className="text-sm" onClick={() => setOpenMenuModal(true)}>
                                                {getMenuName(menuUrl)}
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

                        <div className="flex justify-end pb-4">
                            <Button type="submit" size="lg" disabled={isLoading}>
                                {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                            </Button>
                        </div>
                    </form>
                </div>
            </main>
            <MenuModal
                open={openMenuModal}
                onOpenChange={setOpenMenuModal}
                menuUrl={menuUrl}
                restaurantName={restaurant?.name}
            />
        </div>
    );
};

export default Restaurante;
