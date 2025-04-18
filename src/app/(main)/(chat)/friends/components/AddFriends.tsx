"use client";

import React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutationState } from "@/hooks/useMutationState";
import { createFriendRequest } from "@/server-actions/main/chat/friends/actions";
import { useAuthContext } from "@/context/authContext";
import {ShowToast} from "@/components/ShowToast";
import {useProfileContext} from "@/context/profileContext";

const addFriendFormSchema = z.object({
    receiverUsername: z.string()
        .min(1, { message: "Ce champ ne peut être vide" })
});

const AddFriends = () => {
    const { user } = useAuthContext();
    const {activeProfileInStorage} = useProfileContext();

    const form = useForm<z.infer<typeof addFriendFormSchema>>({
        resolver: zodResolver(addFriendFormSchema),
        defaultValues: {
            receiverUsername: ""
        },
    });

    const { mutate: createRequest, pending } = useMutationState(async ({ receiverUsername }: { receiverUsername: string }) => {
        if (!user || !activeProfileInStorage?.username) {
            ShowToast("destructive", "Erreur", "Impossible de récupérer l'email de l'utilisateur.");
            return;
        }

        try {
            const response = await createFriendRequest(activeProfileInStorage?.username, receiverUsername);

            if (!response.success) {
                ShowToast("destructive", "Erreur", response.errorMessage || "Une erreur est survenue.");
                return;
            }

            ShowToast("default", "Succès", "Demande d'ajout envoyée !");
            form.reset();
        } catch (error) {
            ShowToast("destructive", "Erreur", "Une erreur inattendue est survenue.");
        }
    });

    const handleSubmit = form.handleSubmit((values) => {
        void createRequest(values);
    });

    return (
        <Dialog>
            <Tooltip>
                <TooltipTrigger asChild>
                    <DialogTrigger asChild>
                        <Button size="icon" variant="ghost">
                            <UserPlus />
                        </Button>
                    </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Ajouter un(e) ami(e)</p>
                </TooltipContent>
            </Tooltip>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Ajouter un(e) ami(e)
                    </DialogTitle>
                    <DialogDescription>
                        Envoyez une demande de connexion à vos amis !
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="receiverUsername"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username de ton ami(e)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Username de l'ami(e)..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button disabled={pending} type="submit">
                                {pending ? 'Envoi...' : 'Envoyer'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default AddFriends;