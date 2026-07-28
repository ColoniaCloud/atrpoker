"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { setCookie } from "@/lib/client-cookies";

export const AGE_GATE_COOKIE = "atrpoker_age_ok";

export function AgeGate({
  confirmed,
  onConfirm,
}: {
  confirmed: boolean | null;
  onConfirm: () => void;
}) {
  if (confirmed !== false) return null;

  function confirmAge() {
    setCookie(AGE_GATE_COOKIE, "1", 365);
    onConfirm();
  }

  function exit() {
    window.location.href = "https://www.google.com";
  }

  return (
    <Dialog open onOpenChange={() => {}}>
      <DialogContent
        hideClose
        className="sm:max-w-md"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Verificación de edad</DialogTitle>
          <DialogDescription>
            ATRPoker contiene información sobre juego de póker online y está dirigido
            exclusivamente a personas mayores de 18 años. Jugá responsablemente.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:justify-between">
          <Button variant="outline" onClick={exit}>
            No soy mayor de 18
          </Button>
          <Button onClick={confirmAge}>Sí, soy mayor de 18 años</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
