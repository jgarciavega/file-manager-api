"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashboardMenu({ items }) {
  const pathname = usePathname();

  const defaultItems = [
    { id: 'bitacora', label: 'Bitácora', href: '/dashboard/bitacora' },
    { id: 'expedientes', label: 'Expedientes', href: '/dashboard/expedientes' },
    { id: 'prestamos', label: 'Préstamos', href: '/dashboard/prestamos-documento' },
    { id: 'reportes', label: 'Reportes', href: '/dashboard/reportes' },
    { id: 'usuarios', label: 'Usuarios', href: '/dashboard/usuarios' }
  ];

  const menu = Array.isArray(items) && items.length > 0 ? items : defaultItems;

  return (
    <nav aria-label="Dashboard menu" className="w-full">
      <div className="max-w-7xl mx-auto px-4">
        <ul className="flex gap-2 overflow-auto py-3">
          {menu.map((it) => {
            const active = pathname === it.href || (it.href !== '/' && pathname?.startsWith(it.href));
            return (
              <li key={it.id} className="list-none">
                <Link
                  href={it.href}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${active ? 'text-blue-600 underline' : 'text-gray-700 dark:text-gray-200 hover:text-blue-600'}`}
                  aria-current={active ? 'page' : undefined}
                >
                  {it.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
