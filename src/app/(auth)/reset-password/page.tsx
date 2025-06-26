'use client'

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import { toast } from "react-toastify";
import Link from "next/link";
import { useLogin } from "@/app/hooks/useLogin";
const ResetPassword = () => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);
  
  const router = useRouter();
  const { token } = useParams();
  const { resetPassword } = useLogin();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token') || token;
    
    if (!tokenFromUrl) {
      setTokenValid(false);
      toast.error("Link de redefinição inválido ou expirado");
    }
  }, [token]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.password || !formData.confirmPassword) {
      toast.error("Preencha todos os campos");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const resetToken = urlParams.get('token') || token;

    if (!resetToken) {
      toast.error("Token de redefinição não encontrado");
      return;
    }

    setIsLoading(true);
    
    try {
      await resetPassword(resetToken as string, formData.password);
      setResetSuccess(true);
      
      // Redirecionar para a página inicial após 3 segundos
      setTimeout(() => {
        router.push("/");
      }, 3000);
    } catch (error) {
      console.error('Erro ao redefinir senha:', error);
      setTokenValid(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (!tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
        <Card className="w-full max-w-md p-3">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-red-600" />
            </div>
            <CardTitle className="text-2xl text-red-600">Link inválido</CardTitle>
            <CardDescription>
              Este link de redefinição de senha é inválido ou expirou
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Solicite um novo link de redefinição de senha.
            </p>
            <div className="space-y-2">
              <Link href="/forgot-password" className="block">
                <Button className="w-full">
                  Solicitar novo link
                </Button>
              </Link>
              <Link href="/" className="block">
                <Button variant="ghost" className="w-full">
                  Voltar para o login
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (resetSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
        <Card className="w-full max-w-md p-3">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-600">Senha alterada!</CardTitle>
            <CardDescription>
              Sua senha foi redefinida com sucesso
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Você será redirecionado para a página de login em alguns segundos...
            </p>
            <Link href="/" className="block">
              <Button className="w-full">
                Ir para o login
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md p-3">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <Link href="/forgot-password">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <CardTitle className="text-2xl">Nova senha</CardTitle>
              <CardDescription>
                Digite sua nova senha
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Nova senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua nova senha"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                A senha deve ter pelo menos 6 caracteres
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirme sua nova senha"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Alterando senha...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  Redefinir senha
                </>
              )}
            </Button>
            
            <div className="text-center">
              <Link href="/" className="text-sm text-primary hover:underline">
                Voltar para o login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;