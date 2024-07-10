'use client'
import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { name: 'Hombres', 
    href: '/gender/men', 
    icon: HomeIcon },
  {
    name: 'Mujeres',
    href: '/gender/women',
    icon: DocumentDuplicateIcon,
  },
  { 
    name: 'Niños', 
    href: '/gender/kid', 
    icon: UserGroupIcon },
];

export default function NavLinks() {
  const pathname = usePathname()
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={`flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-800 p-3 text-sm font-medium hover:bg-gray-900 hover:text-white md:flex-none md:justify-start md:p-2 md:px-3
            ${pathname === link.href ? 'text-white  border-2 border-sky-100' : ''}
          `}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
