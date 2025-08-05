'use client';

import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import avatarMap from '../../../lib/avatarMap';
import { useSession } from 'next-auth/react';

export default function DashboardHeader({ title, darkMode, onToggleDarkMode }) {
  const { data: session } = useSession();
  const userEmail = session?.user?.email || 'default';
  const userAvatar = avatarMap[userEmail] || '/default-avatar.png';

  return (
    <header
      className={`w-full flex items-center justify-between py-6 px-4 md:px-8 border-b shadow-sm relative z-20
        ${darkMode ? 'bg-slate-900/90 border-slate-700 text-white' : 'bg-white/80 border-blue-100 text-blue-900'}`}
    >
      {/* Logo a la izquierda */}
      <div className="flex items-center gap-2 min-w-[170px]">
        <Image
          src={darkMode ? '/api-dark23.png' : '/api.jpg'}
          alt="Logo institucional"
          width={400}
          height={120}
          className={darkMode ? 'rounded-2xl shadow-lg' : ''}
          priority
        />
      </div>
      {/* Título centrado */}
      <div className="flex-1 flex justify-center">
        <h1 className={`text-4xl md:text-5xl font-extrabold tracking-tight text-center ${darkMode ? 'text-white' : 'text-blue-900'}`}>{title}</h1>
      </div>
      {/* Icono modo oscuro y avatar a la derecha */}
      <div className="flex items-center gap-5 min-w-[170px] justify-end">
        <button
          className={`rounded-full p-3 border-2 ${darkMode ? 'border-blue-400 bg-slate-800 text-blue-200' : 'border-blue-200 bg-white text-blue-700'} shadow hover:scale-110 transition-all`}
          onClick={onToggleDarkMode}
          title={darkMode ? 'Modo claro' : 'Modo oscuro'}
        >
          <FontAwesomeIcon icon={darkMode ? faSun : faMoon} className="text-2xl" />
        </button>
        <div className="flex items-center gap-2">
          <Image
            src={userAvatar}
            alt={userEmail}
            width={120}
            height={90}
            className={`rounded-full border-2 shadow ${darkMode ? 'border-blue-400' : 'border-blue-200'}`}
          />
        </div>
      </div>
    </header>
  );
}
