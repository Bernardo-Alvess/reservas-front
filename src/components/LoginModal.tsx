'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "react-toastify";
import Link from "next/link";
import { useUser } from "@/app/hooks/useUser";
import { useLogin } from "@/app/hooks/useLogin";
interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const LoginModal = ({ open, onOpenChange }: LoginModalProps) => {
  const [clientLoginStep, setClientLoginStep] = useState<"email" | "otp">("email");
  const [clientEmail, setClientEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [loginType, setLoginType] = useState<'client' | 'restaurant'>('client')
  const [restaurantData, setRestaurantData] = useState({
    email: "",
    password: ""
  });
  
  const { createOrUpdateOtp } = useUser();
  const { login } = useLogin(loginType)

  const handleClientEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientEmail) return;
    createOrUpdateOtp(clientEmail);
    // Simular envio do código OTP
    setClientLoginStep("otp");
  };

  const handleClientOTPSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length !== 6) {
      toast.error("Digite o código de 6 dígitos");
      return;
    }
    login(clientEmail, otpCode)
    // Simular verificação do OTP
    toast.success("Login realizado com sucesso!");
    onOpenChange(false);
    setClientLoginStep("email");
    setClientEmail("");
    setOtpCode("");
  };

  const handleRestaurantLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginType('restaurant')
    login(restaurantData.email, restaurantData.password)
    // Simular login do restaurante
    toast.success("Login do restaurante realizado com sucesso!");
    onOpenChange(false);
  };

  const resetClientLogin = () => {
    setClientLoginStep("email");
    setClientEmail("");
    setOtpCode("");
  };

  return (
    <Dialog open={open} onOpenChange={(open) => {
      onOpenChange(open);
      if (!open) resetClientLogin();
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
              <form onSubmit={handleClientEmailSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="client-email">Email</Label>
                  <Input
                    id="client-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    required
                  />
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
              <form onSubmit={handleClientOTPSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Código de verificação</Label>
                  <p className="text-sm text-muted-foreground">
                    Digite o código de 6 dígitos enviado para {clientEmail}
                  </p>
                  <div className="flex justify-center">
                    <InputOTP maxLength={6} value={otpCode} onChange={setOtpCode}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
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
            <form onSubmit={handleRestaurantLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="restaurant-email">Email</Label>
                <Input
                  id="restaurant-email"
                  type="email"
                  placeholder="restaurante@email.com"
                  value={restaurantData.email}
                  onChange={(e) => setRestaurantData({...restaurantData, email: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="restaurant-password">Senha</Label>
                <Input
                  id="restaurant-password"
                  type="password"
                  placeholder="Sua senha"
                  value={restaurantData.password}
                  onChange={(e) => setRestaurantData({...restaurantData, password: e.target.value})}
                  required
                />
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