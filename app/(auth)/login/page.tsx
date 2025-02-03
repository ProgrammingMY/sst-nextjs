"use client"

import React from "react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth-client"; //import the auth client
import { useState } from 'react';
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const signIn = async () => {
        const { data, error } = await authClient.signIn.email({
            email,
            password,
        }, {
            onRequest: (ctx) => {
                setLoading(true);
            },
            onSuccess: (ctx) => {
                return router.push("/user");
            },
            onError: (ctx) => {
                setLoading(false);
                alert(ctx.error.message);
            },
        });
    };

    return (
        <div>
            <h1 className="text-2xl font-bold my-4">Login</h1>
            <div className="flex flex-col gap-4">
                <Label>Email</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <Label>Password</Label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <Button onClick={signIn} disabled={loading}>
                    {
                        loading ?
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span className="ml-2">Loading...</span>
                            </>
                            :
                            "Login"
                    }
                </Button>
                <Link href="/forgot-password" className="underline text-sm text-blue-500 hover:text-blue-700">Forgot password?</Link>
            </div>
        </div>
    );
}