import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Link } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import * as Yup from 'yup';
import Colors from '../../constants/Colors';
import * as Linking from 'expo-linking';

// Componente Stepper con estilos actualizados según la guía
const Stepper = ({ currentStep }: { currentStep: number }) => (
  <View style={styles.stepperContainer}>
    <View style={styles.step}>
      <View style={[styles.stepCircle, currentStep >= 1 && styles.stepCircleActive]}>
        <Text style={[styles.stepText, currentStep >= 1 && styles.stepTextActive]}>1</Text>
      </View>
      <Text style={[styles.stepLabel, currentStep >= 1 && styles.stepLabelActive]}>Credenciales</Text>
    </View>
    <View style={styles.stepperLine} />
    <View style={styles.step}>
      <View style={[styles.stepCircle, currentStep >= 2 && styles.stepCircleActive]}>
        <Text style={[styles.stepText, currentStep >= 2 && styles.stepTextActive]}>2</Text>
      </View>
      <Text style={[styles.stepLabel, currentStep >= 2 && styles.stepLabelActive]}>Datos personales</Text>
    </View>
  </View>
);

// --- Esquema de Validación ---
const validationSchema = Yup.object().shape({
  email: Yup.string().email('Introduce un correo válido').required('El correo es requerido'),
  password: Yup.string().min(8, 'La contraseña debe tener al menos 8 caracteres').required('La contraseña es requerida'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Las contraseñas no coinciden')
    .required('Confirma tu contraseña'),
});

// --- Componente Principal ---
const RegisterCredentialsScreen = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '' });
  const [isFormValid, setIsFormValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  // Estado para los mensajes de validación en tiempo real.
  const [validationMessages, setValidationMessages] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    validationSchema.isValid(formData).then(setIsFormValid);
  }, [formData]);

  const handleInputChange = (name: keyof typeof formData, value: string) => {
    setFormData(prevState => {
      const newState = { ...prevState, [name]: value };
      
      // Valida la confirmación de contraseña cada vez que cualquiera de las dos cambia.
      if (name === 'password' || name === 'confirmPassword') {
        if (newState.confirmPassword && newState.password !== newState.confirmPassword) {
          setValidationMessages(prev => ({ ...prev, confirmPassword: 'Las contraseñas deben coincidir' }));
        } else {
          setValidationMessages(prev => ({ ...prev, confirmPassword: '' }));
        }
      }
      
      // Valida el largo de la contraseña principal
      if (name === 'password') {
          if (value.length > 0 && value.length < 8) {
              setValidationMessages(prev => ({ ...prev, password: 'La contraseña debe poseer mínimo 8 caracteres' }));
          } else {
              setValidationMessages(prev => ({ ...prev, password: '' }));
          }
      }
      return newState;
    });
  };

  const handleNextStep = () => {
    // 1. Verifica si el formulario es válido (email y contraseñas coinciden).
    // Ya no necesita ser 'async' ni manejar un estado de 'loading'
    // porque no se comunica con el backend en este paso.
    if (!isFormValid) {
      return;
    }

    // 2. Navega a la siguiente pantalla ('register-profile')
    //    y pasa el email y la contraseña como parámetros para ser usados en el siguiente paso.
    router.push({
      pathname: '/(auth)/register-profile',
      params: { 
        email: formData.email, 
        password: formData.password 
      }
    });
  };

  // Función para abrir URLs externas.
  const handleOpenURL = (url: string) => {
    Linking.openURL(url).catch(err => console.error("No se pudo abrir la página", err));
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoiding}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View>
            <View style={styles.header}>
              <Text style={styles.title}>Crea tu cuenta</Text>
              <Text style={styles.subtitle}>Por favor, introduce tus datos para iniciar sesión</Text>
            </View>
            <Stepper currentStep={1} />

            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Correo electrónico</Text>
                <TextInput style={styles.input} 
                placeholder="Ingresa tu correo" 
                value={formData.email} 
                onChangeText={(val) => handleInputChange('email', val)} 
                keyboardType="email-address" 
                autoCapitalize="none"
                // Añadimos onFocus y onBlur para el mensaje de ayuda.
                  onFocus={() => setValidationMessages(prev => ({ ...prev, email: 'Ej. correo@example.com' }))}
                  onBlur={() => setValidationMessages(prev => ({ ...prev, email: '' }))}
                />
                {/* Mostramos el mensaje de validación si existe. */}
                {validationMessages.email && <Text style={styles.validationText}>{validationMessages.email}</Text>}               
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Contraseña</Text>
                <View style={styles.passwordWrapper}>
                  <TextInput 
                    style={styles.passwordInput} 
                    placeholder="Mínimo 8 caracteres" 
                    value={formData.password} 
                    onChangeText={(val) => handleInputChange('password', val)} 
                    secureTextEntry={!isPasswordVisible}
                    onFocus={() => {
                    if (formData.password.length < 8) {
                      setValidationMessages(prev => ({ ...prev, password: 'La contraseña debe poseer mínimo 8 caracteres' }));
                    }
                    }}
                  />
                  <TouchableOpacity 
                    onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                      <Feather 
                        name={isPasswordVisible ? 'eye-off' : 'eye'} 
                        size={22} 
                        color={Colors.textSecondary} 
                      />
                  </TouchableOpacity>
                </View>
                {validationMessages.password && <Text style={styles.validationText}>{validationMessages.password}</Text>}
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Confirmar Contraseña</Text>
                <View style={styles.passwordWrapper}>
                  <TextInput 
                  style={styles.passwordInput} 
                  placeholder="Repite tu contraseña" 
                  value={formData.confirmPassword} 
                  onChangeText={(val) => handleInputChange('confirmPassword', val)} 
                  secureTextEntry={!isConfirmPasswordVisible}
                  onFocus={() => {
                    if (formData.password !== formData.confirmPassword) {
                      setValidationMessages(prev => ({ ...prev, confirmPassword: 'Las contraseñas deben coincidir' }));
                    }
                  }}
                  />
                  <TouchableOpacity 
                    onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}>
                      <Feather 
                        name={isConfirmPasswordVisible ? 'eye-off' : 'eye'} 
                        size={22} 
                        color={Colors.textSecondary} 
                      />
                  </TouchableOpacity>
                </View>
                {validationMessages.confirmPassword && <Text style={styles.validationText}>{validationMessages.confirmPassword}</Text>}
              </View>
            </View>
          </View>

          <View style={styles.footer}>

            <View style={styles.legalContainer}>
              <Text style={styles.legalText}>Al crear una cuenta, aceptas los </Text>
              <TouchableOpacity onPress={() => handleOpenURL('https://universitas.legal/manuales-de-contrataciones-publicas-terminos-y-condiciones/')}>
                <Text style={styles.linkText}>Términos y Condiciones</Text>
              </TouchableOpacity>
              <Text style={styles.legalText}> y la </Text>
              <TouchableOpacity onPress={() => handleOpenURL('https://universitas.legal/manuales-de-contrataciones-publicas-politicas-de-privacidad/')}>
                <Text style={styles.linkText}>Política de Privacidad</Text>
              </TouchableOpacity>
              <Text style={styles.legalText}>.</Text>
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <TouchableOpacity style={[styles.button, (!isFormValid || loading) && styles.buttonDisabled]} onPress={handleNextStep} disabled={!isFormValid || loading}>
              {loading ? <ActivityIndicator color={Colors.textLight} /> : <Text style={styles.buttonText}>Siguiente</Text>}
            </TouchableOpacity>
            <View style={styles.loginLinkContainer}>
              <Text style={styles.loginText}>¿Ya tienes una cuenta? </Text>
              <Link href="/(auth)/login" asChild><TouchableOpacity><Text style={styles.loginLink}>Inicia sesión</Text></TouchableOpacity></Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// Estilos completamente actualizados con la nueva paleta y tipografía
const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: Colors.background },
  keyboardAvoiding: { flex: 1 },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 60,
  },
  header: { marginBottom: 10},
  title: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 8,
    color: Colors.text,
  },
  subtitle: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 16,
    textAlign: 'center',
    color: Colors.textSecondary,
  },
  form: { marginTop: 32 },
  inputContainer: { marginBottom: 20 },
  validationText: {
    fontFamily: 'Roboto_400Regular',
    color: Colors.error,
    fontSize: 13,
    marginTop: 6,
    paddingLeft: 4,
  },
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
    fontFamily: 'Roboto_400Regular',
  },
  passwordWrapper: {
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
    fontFamily: 'Roboto_400Regular' },
  footer: { marginTop: 5},
  errorText: { color: Colors.error, textAlign: 'center', marginBottom: 10, fontFamily: 'Roboto_400Regular' },
  button: {
    width: '100%',
    height: 56,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: { backgroundColor: '#cccccc' },
  buttonText: {
    fontFamily: 'Roboto_500Medium',
    color: Colors.textLight,
    fontSize: 16,
  },
  loginLinkContainer: {
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginText: {
    fontFamily: 'Roboto_400Regular',
    color: Colors.textSecondary,
    fontSize: 14,
  },
  loginLink: {
    fontFamily: 'Roboto_500Medium',
    color: Colors.link,
    fontSize: 14,
  },
  legalContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  legalText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 13,
    color: Colors.textSecondary,
  },
  linkText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 13,
    color: Colors.link,
    textDecorationLine: 'underline',
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginTop: 24,
    width: '80%',
    alignSelf: 'center',
  },
  step: { alignItems: 'center', flex: 1 },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5E7EB', // Gris claro para inactivo
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepCircleActive: {
    backgroundColor: Colors.primary, // Azul principal para activo
  },
  stepText: {
    fontFamily: 'Roboto_700Bold',
    color: Colors.text, // Texto oscuro para inactivo
  },
  stepTextActive: {
    color: Colors.textLight, // Texto blanco para activo
  },
  stepLabel: {
    fontFamily: 'Roboto_400Regular',
    marginTop: 8,
    color: Colors.textSecondary,
    fontSize: 12,
    textAlign: 'center',
  },
  stepLabelActive: { fontFamily: 'Roboto_700Bold', color: Colors.primary },
  stepperLine: { flex: 1, height: 2, backgroundColor: '#E5E7EB', marginTop: 15 },
});

export default RegisterCredentialsScreen;