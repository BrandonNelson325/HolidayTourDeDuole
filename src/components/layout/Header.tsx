import React from 'react';
import { AdminLogin } from '../AdminLogin';

interface HeaderProps {
  isAuthenticated: boolean;
  onLogin: (isAuth: boolean) => void;
}

export function Header({ isAuthenticated, onLogin }: HeaderProps) {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold text-gray-900">Holiday Tour de Duole</h1>
      <AdminLogin isAuthenticated={isAuthenticated} onLogin={onLogin} />
    </div>
  );
}