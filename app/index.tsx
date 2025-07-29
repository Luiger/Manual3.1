// app/index.tsx
import { Redirect } from 'expo-router';
import React from 'react';

// El componente 'Redirect' de expo-router se utiliza para navegar
// automáticamente al usuario a una ruta específica.
// En este caso, al abrir la app, lo llevamos directamente al flujo de autenticación.
const StartPage = () => {
  return <Redirect href="/(auth)/login" />;
};

export default StartPage;