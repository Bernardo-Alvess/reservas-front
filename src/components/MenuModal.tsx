'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink, Download } from "lucide-react";

interface MenuModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  menuUrl: string,
  restaurantName: string
}

export const MenuModal = ({ open, onOpenChange, menuUrl, restaurantName }: MenuModalProps) => {
  
  if (!menuUrl) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cardápio</DialogTitle>
            <DialogDescription>
              {restaurantName}
            </DialogDescription>
          </DialogHeader>
          <div className="p-6 text-center">
            <p className="text-muted-foreground">Cardápio não disponível no momento.</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const handleOpenInNewTab = () => {
    window.open(menuUrl, '_blank');
  };

  // const handleDownload = () => {
  //   const link = document.createElement('a');
  //   link.href = menuUrl;
  //   link.download = `cardapio-${restaurantName.toLowerCase().replace(/\s+/g, '-')}.pdf`;
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Cardápio</DialogTitle>
          <DialogDescription>
            Veja o cardápio do {restaurantName}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Botões de ação */}
          <div className="flex gap-3 justify-center">
            <Button 
              onClick={handleOpenInNewTab}
              className="flex items-center gap-2"
              variant="outline"
            >
              <ExternalLink className="w-4 h-4" />
              Abrir em Nova Aba
            </Button>
          </div>

          {/* Iframe para visualização */}
          <div className="h-[600px] w-full border rounded-lg overflow-hidden">
            <iframe
              src={`${menuUrl}#toolbar=1&navpanes=1&scrollbar=1`}
              className="w-full h-full"
              title={`Cardápio do ${restaurantName}`}
              onError={() => {
                console.log('Erro ao carregar PDF no iframe, abrindo em nova aba...');
                handleOpenInNewTab();
              }}
            />
          </div>
          
          <p className="text-xs text-muted-foreground text-center">
            Se o cardápio não carregar, clique em "Abrir em Nova Aba"
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
