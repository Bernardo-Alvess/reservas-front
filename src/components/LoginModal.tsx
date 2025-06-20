'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import Link from "next/link";
import { useUser } from "@/app/hooks/useUser";
import { useLogin } from "@/app/hooks/useLogin";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Schemas de validação
const clientEmailSchema = z.object({
  email: z.string().email("Email inválido")
});

const clientOTPSchema = z.object({
  otpCode: z.string().length(6, "Código deve ter 6 dígitos")
});

const restaurantLoginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória")
});

type ClientEmailForm = z.infer<typeof clientEmailSchema>;
type ClientOTPForm = z.infer<typeof clientOTPSchema>;
type RestaurantLoginForm = z.infer<typeof restaurantLoginSchema>;

export const LoginModal = ({ open, onOpenChange }: LoginModalProps) => {
  const [clientLoginStep, setClientLoginStep] = useState<"email" | "otp">("email");
  const [clientEmail, setClientEmail] = useState("");
  const [loginType, setLoginType] = useState<'client' | 'restaurant'>('client');
  
  const { createOrUpdateOtp } = useUser();
  const { login } = useLogin(loginType);

  const clientEmailForm = useForm<ClientEmailForm>({
    resolver: zodResolver(clientEmailSchema),
    defaultValues: {
      email: ""
    }
  });

  // Formulário para OTP do cliente
  const clientOTPForm = useForm<ClientOTPForm>({
    resolver: zodResolver(clientOTPSchema),
    defaultValues: {
      otpCode: ""
    }
  });

  // Formulário para login do restaurante
  const restaurantForm = useForm<RestaurantLoginForm>({
    resolver: zodResolver(restaurantLoginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const handleClientEmailSubmit = (data: ClientEmailForm) => {
    setClientEmail(data.email);
    createOrUpdateOtp(data.email);
    setClientLoginStep("otp");
  };

  const handleClientOTPSubmit = async (data: ClientOTPForm) => {
    const success = await login(clientEmail, data.otpCode);
    if (success) {
      onOpenChange(false);
      resetClientLogin();
    }
  };

  const handleRestaurantLogin = async (data: RestaurantLoginForm) => {
    setLoginType('restaurant');
    const success = await login(data.email, data.password);
    if (success) {
      onOpenChange(false);
    }
  };

  const resetClientLogin = () => {
    setClientLoginStep("email");
    setClientEmail("");
    clientEmailForm.reset();
    clientOTPForm.reset();
  };

  const resetRestaurantLogin = () => {
    restaurantForm.reset();
  };

  return (
    <Dialog open={open} onOpenChange={(open) => {
      onOpenChange(open);
      if (!open) {
        resetClientLogin();
        resetRestaurantLogin();
      }
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Acesse sua conta</DialogTitle>
          <DialogDescription>
            Entre como cliente ou restaurante
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="cliente" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="cliente">Cliente</TabsTrigger>
            <TabsTrigger value="restaurante">Restaurante</TabsTrigger>
          </TabsList>

          <TabsContent value="cliente" className="space-y-4">
            {clientLoginStep === "email" ? (
              <form onSubmit={clientEmailForm.handleSubmit(handleClientEmailSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="client-email">Email</Label>
                  <Controller
                    name="email"
                    control={clientEmailForm.control}
                    render={({ field }) => (
                      <Input
                        id="client-email"
                        type="email"
                        placeholder="seu@email.com"
                        {...field}
                        required
                      />
                    )}
                  />
                  {clientEmailForm.formState.errors.email && (
                    <span className="text-sm text-red-500">
                      {clientEmailForm.formState.errors.email.message}
                    </span>
                  )}
                </div>
                <Button type="submit" className="w-full">
                  Enviar código
                </Button>
                <div className="text-center">
                  <Link 
                    href="/forgot-password" 
                    className="text-sm text-primary hover:underline"
                    onClick={() => onOpenChange(false)}
                  >
                    Esqueci minha senha
                  </Link>
                </div>
              </form>
            ) : (
              <form onSubmit={clientOTPForm.handleSubmit(handleClientOTPSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label>Código de verificação</Label>
                  <p className="text-sm text-muted-foreground">
                    Digite o código de 6 dígitos enviado para {clientEmail}
                  </p>
                  <div className="flex justify-center">
                    <Controller
                      name="otpCode"
                      control={clientOTPForm.control}
                      render={({ field }) => (
                        <InputOTP maxLength={6} value={field.value} onChange={field.onChange}>
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      )}
                    />
                  </div>
                  {clientOTPForm.formState.errors.otpCode && (
                    <span className="text-sm text-red-500 text-center block">
                      {clientOTPForm.formState.errors.otpCode.message}
                    </span>
                  )}
                </div>
                <Button type="submit" className="w-full">
                  Entrar
                </Button>
                <Button 
                  type="button" 
                  variant="ghost" 
                  className="w-full"
                  onClick={resetClientLogin}
                >
                  Voltar
                </Button>
              </form>
            )}
          </TabsContent>

          <TabsContent value="restaurante" className="space-y-4">
            <form onSubmit={restaurantForm.handleSubmit(handleRestaurantLogin)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="restaurant-email">Email</Label>
                <Controller
                  name="email"
                  control={restaurantForm.control}
                  render={({ field }) => (
                    <Input
                      id="restaurant-email"
                      type="email"
                      placeholder="restaurante@email.com"
                      {...field}
                      required
                    />
                  )}
                />
                {restaurantForm.formState.errors.email && (
                  <span className="text-sm text-red-500">
                    {restaurantForm.formState.errors.email.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="restaurant-password">Senha</Label>
                <Controller
                  name="password"
                  control={restaurantForm.control}
                  render={({ field }) => (
                    <Input
                      id="restaurant-password"
                      type="password"
                      placeholder="Sua senha"
                      {...field}
                      required
                    />
                  )}
                />
                {restaurantForm.formState.errors.password && (
                  <span className="text-sm text-red-500">
                    {restaurantForm.formState.errors.password.message}
                  </span>
                )}
              </div>
              <Button type="submit" className="w-full">
                Entrar
              </Button>
              <div className="text-center">
                <Link 
                  href="/forgot-password" 
                  className="text-sm text-primary hover:underline"
                  onClick={() => onOpenChange(false)}
                >
                  Esqueci minha senha
                </Link>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};