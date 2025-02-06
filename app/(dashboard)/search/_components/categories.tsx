"use client";

import { CategoryType } from '@/drizzle/app-schema';
import {
    SiJavascript,
    SiPython,
    SiReact,
    SiTypescript,
    SiAngular,
    SiInternetcomputer,
} from "react-icons/si";
import { IconType } from 'react-icons/lib';
import { CategoryItem } from './categoryitem';

const iconMap: Record<CategoryType["name"], IconType> = {
    "JavaScript": SiJavascript,
    "Python": SiPython,
    "React": SiReact,
    "TypeScript": SiTypescript,
    "Angular": SiAngular,
    "Programming": SiInternetcomputer,
}

export const Categories = ({
    items,
}: { items: CategoryType[] }) => {
    return (
        <div className='flex items-center gap-x-2 overflow-x-auto pb-2'>
            {items.map((item) => (
                <CategoryItem
                    key={item.id}
                    label={item.name}
                    icon={iconMap[item.name]}
                    value={item.id.toString()}
                />
            ))}
        </div>
    )
}
