
"use client"

import { MenuIcon } from 'lucide-react';
import { useSidebar } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button';

export default function Navbar() {
    const sidebar = useSidebar();
    return (
        <div className='p-4 border-b-2 h-full flex items-center justify-between'>
            {sidebar.isMobile && (
                <Button variant={"ghost"} className="md:hidden hover:opacity-75 transition" onClick={() => sidebar.setOpenMobile(true)}>
                    <MenuIcon size={32} />
                </Button>
            )}
        </div>
    )
}
