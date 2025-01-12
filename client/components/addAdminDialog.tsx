'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ExtendedUser, Ruolo } from "@/lib/types";
import { SignUpForm } from "./form-signup";

interface AddAdminDialogProps {
    isOpen: boolean;
    onClose: () => void;
    admin: ExtendedUser | null;
  }

const AddAdminDialog = ({ isOpen, onClose, admin }:AddAdminDialogProps) => {
     

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            {/* <DialogTrigger asChild>
                <Button variant="outline">Edit Profile</Button>
            </DialogTrigger> */}
            <DialogContent className="sm:max-w-[425px]" onEscapeKeyDown={(e) => e.preventDefault()} onPointerDownOutside={(e) => e.preventDefault()} >
                <DialogHeader>
                    <DialogTitle>{!admin ? 'Creazione Nuovo Admin' : 'Modifica Admin'}</DialogTitle> 
                    <DialogDescription>
                        {!admin ? 'Creazione nuovo Amministratore con ruolo ADMIN.' : 'Modifica Amministratore con ruolo ADMIN.'}
                    </DialogDescription>                   
                </DialogHeader>

                <SignUpForm 
                    ruolo={Ruolo.ADMIN}
                    admin={admin}
                />
                
            </DialogContent>
        </Dialog>
    )
}

export default AddAdminDialog;




