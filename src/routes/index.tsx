import { NativeBaseProvider } from 'native-base';
import React, { useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { Loading } from '../components/Loading';
import { useAuth } from '../hooks/AuthContext';
import { SingIn } from '../pages/LogIn';
import { OldLogin } from '../pages/OldLogin';
import { DrawerApp } from './DrawerApp';

export function Route() {
   const { user, loading, firstLogin } = useAuth();

   if (loading) {
      return <Loading />;
   }

   return (
      <>
         {user ? <DrawerApp /> : <>{firstLogin ? <OldLogin /> : <SingIn />}</>}
      </>
   );
}
