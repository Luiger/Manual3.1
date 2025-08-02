import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AuthService } from '../services/auth.service';
import Colors from '../constants/Colors';

const VerifyAccountScreen = () => {
    const router = useRouter();
    // 1. Obtiene el 'token' que viene en el enlace profundo (ej: manualesapp://verify-account?token=...)
    const { token } = useLocalSearchParams<{ token: string }>();

    useEffect(() => {
        const verify = async () => {
            if (!token) {
                // Si no hay token, redirige al login con un error
                router.replace('/(auth)/login?error=invalid_token');
                return;
            }

            // 2. Llama al servicio de autenticación para verificar el token en el backend
            const result = await AuthService.verifyAccount(token);

            // 3. Redirige al login con el resultado
            if (result.success) {
                // Si es exitoso, añade el parámetro ?verified=true
                router.replace('/(auth)/login?verified=true');
            } else {
                // Si falla, añade el parámetro ?error=verification_failed
                router.replace('/(auth)/login?error=verification_failed');
            }
        };

        verify();
    }, [token]);

    // Muestra una pantalla de carga mientras se realiza la verificación
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color={Colors.primary} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: Colors.background 
    }
});

export default VerifyAccountScreen;