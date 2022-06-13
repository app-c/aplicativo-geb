import React, { useState } from 'react';
import { useAuth } from '../hooks/AuthContext';
import { SingIn } from '../pages/LogIn';
import { DrawerApp } from './DrawerApp';

export function Route() {
   const { user } = useAuth();

   return user ? <DrawerApp /> : <SingIn />;
}
