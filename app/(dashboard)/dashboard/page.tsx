"use client"

import React from 'react'
import { authClient } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';

export default function MainDasboard() {
    const { data: session, isPending, error } = authClient.useSession();

    return (
        <div>
            <h1>MainDasboard</h1>
            {isPending && <p>Loading...</p>}
            {error && <p>{error.message}</p>}
            {session && (
                <div>
                    <p>{session.user?.email}</p>
                    <p>{session.user?.name}</p>
                </div>
            )}
            <Button onClick={() => authClient.signOut()}>Sign Out</Button>
        </div>
    )
}