"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth-client"; //import the auth client
import { useState } from 'react';
import { useRouter } from "next/navigation"

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const router = useRouter();

  const signUp = async () => {
    const { data, error } = await authClient.signUp.email({
      email,
      password,
      name,
      image: undefined,
    }, {
      onRequest: (ctx) => {
        //show loading
        console.log("loading");
      },
      onSuccess: (ctx) => {
        return router.push("/dashboard");
      },
      onError: (ctx) => {
        alert(ctx.error.message);
      },
    });
  };

  return (
    <div>
      <Input type="name" value={name} onChange={(e) => setName(e.target.value)} />
      <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Button onClick={signUp}>Sign Up</Button>
    </div>
  );
}