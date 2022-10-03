import { NativeBaseProvider } from 'native-base';
import React, { useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { Loading } from '../components/Loading';
import { useAuth } from '../hooks/AuthContext';
import { SingIn } from '../pages/LogIn';
import { DrawerApp } from './DrawerApp';

export function Route() {
   const { user, loading } = useAuth();

   if (loading && !user) {
      return (
         <NativeBaseProvider>
            <Loading />
         </NativeBaseProvider>
      );
   }

   return user ? <DrawerApp /> : <SingIn />;
}
