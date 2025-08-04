import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AuthService } from '../services/auth.service';
import Colors from '../constants/Colors';

const VerifyAccountScreen = () => {
    const router = useRouter();
    const { token } = useLocalSearchParams<{ token: string }>();

    useEffect(() => {
        const verify = async () => {
            // Usamos try/catch para manejar cualquier error
            try {
                if (!token) {
                    // Si no hay token en la URL, es un error
                    throw new Error('invalid_token');
                }
                
                const result = await AuthService.verifyAccount(token);
                
                if (result.success) {
                    // Si todo va bien, redirige con el parámetro de éxito
                    router.replace('/(auth)/login?verified=true');
                } else {
                    // Si el backend devuelve un error (ej. token expirado), lo lanzamos
                    throw new Error('verification_failed');
                }
            } catch (e: any) {
                // Si ocurre CUALQUIER error, redirigimos al login con un parámetro de error
                router.replace(`/(auth)/login?error=${e.message}`);
            }
        };

        // Damos un pequeño respiro para que el loader se vea antes de la llamada
        setTimeout(verify, 500);

    }, [token]);

    // El return no cambia, sigue mostrando un loader
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.text}>Verificando tu cuenta...</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: Colors.background 
    },
    text: {
        marginTop: 16,
        fontFamily: 'Roboto_400Regular',
        fontSize: 16,
        color: Colors.textSecondary,
    }
});

export default VerifyAccountScreen;