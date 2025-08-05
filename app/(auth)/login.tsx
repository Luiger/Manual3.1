import React, { useEffect, useState } from 'react';
import {
  View, Text, Image, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, Alert, ActivityIndicator, ScrollView
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import Colors from '../../constants/Colors';
import { useAuth } from '../../hooks/useAuth';
import CustomAlertModal from '../../components/CustomAlertModal';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  // CAMBIO: Se pide 'isLoginLoading' en lugar de 'isLoading'
  const { login, isLoginLoading } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [emailIsFocused, setEmailIsFocused] = useState(false);
  const [passwordIsFocused, setPasswordIsFocused] = useState(false);
  const params = useLocalSearchParams();
  const [alertConfig, setAlertConfig] = useState({ visible: false, title: '', message: '' });
  // Estado para manejar alertas
  const [hasShownAlert, setHasShownAlert] = useState(false);
  const [error, setError] = useState('');

  // Este useEffect escucha los parámetros de la URL
    useEffect(() => {
        if (params.verified === 'true' && !hasShownAlert) {
            setAlertConfig({
                visible: true,
                title: '¡Cuenta verificada!',
                message: 'Tu cuenta ha sido verificada exitosamente. Ya puedes iniciar sesión.',
            });
            setHasShownAlert(true);
        } else if (params.error && !hasShownAlert) {
            setAlertConfig({
                visible: true,
                title: 'Error de Verificación',
                message: 'El enlace de activación es inválido o ha expirado. Por favor, intenta registrarte de nuevo.',
            });
            setHasShownAlert(true);
        }
    }, [params, hasShownAlert]);

  const handleLogin = async () => {
    if (isLoginLoading) return;
    // Limpiamos el error previo
    setError('');
    // Validamos que los campos no estén vacíos
    if (!email || !password) {
        setError('Por favor, ingresa tu correo y contraseña.');
        return;
    }

    const result = await login(email, password);

    // LÓGICA DE NAVEGACIÓN
    if (result.success) {
      // Si el login es exitoso, navegamos a la pantalla de Home.
      // Usamos 'replace' para que el usuario no pueda volver atrás.
      router.replace('/(tabs)/home');
    } else {
      // Si falla, mostramos el error que viene del backend.
      setError(result.error || 'Ocurrió un error inesperado.');
    }
  };
  
  return (
    <SafeAreaView style={{
      flex: 1,
      paddingTop: 0,
      paddingBottom: 0,
      backgroundColor: Colors.background,
    }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior="padding"                                
        keyboardVerticalOffset={0} 
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"          
        >
          {/* Logo y título */}
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <View style={styles.header}>
            <Text style={styles.title}>
              Manuales de Contrataciones Públicas
            </Text>
            <Text style={styles.subtitle}>Inicia sesión para continuar</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Correo electrónico</Text>
              <TextInput
                style={[styles.input, emailIsFocused && styles.inputFocused]}
                placeholder="Ingresa tu correo"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isLoginLoading}
                onFocus={() => setEmailIsFocused(true)}
                onBlur={() => setEmailIsFocused(false)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Contraseña</Text>
              <View style={[styles.passwordContainer, passwordIsFocused && styles.inputFocused]}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!isPasswordVisible}
                  editable={!isLoginLoading}
                  onFocus={() => setPasswordIsFocused(true)}
                  onBlur={() => setPasswordIsFocused(false)}
                />
                <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)} disabled={isLoginLoading}>
                  <Feather name={isPasswordVisible ? 'eye-off' : 'eye'} size={22} color={Colors.textSecondary} />
                </TouchableOpacity>
              </View>
            </View>
            <Link href="/(auth)/forgot-password" asChild>
                <TouchableOpacity disabled={isLoginLoading}>
                    <Text style={styles.forgotLink}>¿Olvidaste tu contraseña?</Text>
                </TouchableOpacity>
            </Link>
          </View>

          <View style={styles.footer}>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <TouchableOpacity
              onPress={handleLogin}
              style={[styles.button, isLoginLoading && styles.buttonInactive]}
              activeOpacity={0.8}
              disabled={isLoginLoading}
            >
              {isLoginLoading ? (
                <ActivityIndicator size="small" color={Colors.textLight} />
              ) : (
                <Text style={styles.buttonText}>Iniciar sesión</Text>
              )}
            </TouchableOpacity>
            
            <View style={styles.registerLinkContainer}>
                <Text style={styles.registerText}>¿No tienes cuenta? </Text>
                <Link href="/(auth)/register" asChild>
                    <TouchableOpacity disabled={isLoginLoading}>
                        <Text style={styles.registerLink}>Regístrate AQUÍ</Text>
                    </TouchableOpacity>
                </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* COMPONENTE DE ALERTA */}
            <CustomAlertModal
                visible={alertConfig.visible}
                title={alertConfig.title}
                message={alertConfig.message}
                confirmText="OK"
                onConfirm={() => setAlertConfig(prevState => ({ ...prevState, visible: false }))}
                onCancel={() => setAlertConfig(prevState => ({ ...prevState, visible: false }))}
            />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: Colors.background 
  },
  scrollContainer: { 
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 0,
  },
  header: { 
    width: '100%', 
    marginBottom: 32, 
    alignItems: 'center' 
  },
  title: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 24,
    color: Colors.text,
    textAlign: 'center',
  },
  logo: {
    width: 400, // Ajusta el tamaño según tu preferencia
    height: 200,  // Ajusta el tamaño según tu preferencia
    alignSelf: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 8,
  },
  form: { width: '100%' },
  inputGroup: { width: '100%', marginBottom: 16 },
  label: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  input: {
    height: 56,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  inputFocused: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  passwordInput: { 
    flex: 1,
    fontSize: 16,    
    color: Colors.text,
  },
  forgotLink: {
    fontFamily: 'Roboto_500Medium',
    color: Colors.link,
    textAlign: 'right',
    fontSize: 14,
  },
  footer: { 
    width: '100%', 
    marginTop: 20 
  },
  errorText: {
    color: Colors.error,
    fontFamily: 'Roboto_400Regular',
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 15,
  },
  button: {
    width: '100%',
    backgroundColor: Colors.primary,
    height: 56,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonInactive: { backgroundColor: '#9CA3AF' },
  buttonText: {
    fontFamily: 'Roboto_700Bold',
    color: Colors.textLight,
    fontSize: 16,
  },
  registerLinkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  registerText: {
    fontFamily: 'Roboto_400Regular',
    color: Colors.textSecondary,
    fontSize: 14,
  },
  registerLink: {
    fontFamily: 'Roboto_500Medium',
    color: Colors.link,
    fontSize: 14,
  },
});