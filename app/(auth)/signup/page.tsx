"use client"

import React from "react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth-client"; //import the auth client
import { useState } from 'react';
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react";

export default function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const router = useRouter();

    const signUp = async () => {
        const { data, error } = await authClient.signUp.email({
            email,
            password,
            name,
            image: undefined,
        }, {
            onRequest: (ctx) => {
                setIsSubmitting(true);
            },
            onSuccess: (ctx) => {
                return router.push("/dashboard");
            },
            onError: (ctx) => {
                setIsSubmitting(false);
                alert(ctx.error.message);
            },
        });
    };

    return (
        <div>
            <h1 className="text-2xl font-bold my-4">Sign Up</h1>
            <div className="flex flex-col gap-4">
                <Label>Username</Label>
                <Input type="name" value={name} onChange={(e) => setName(e.target.value)} />
                <Label>Email</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <Label>Password</Label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <Button onClick={signUp} disabled={isSubmitting}>
                    {isSubmitting ?
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Signing Up...</span>
                        </>
                        :
                        "Sign Up"
                    }
                </Button>
            </div>
        </div>
    );
}