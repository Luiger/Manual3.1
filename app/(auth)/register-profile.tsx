import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ActivityIndicator,
  Platform, Alert, KeyboardAvoidingView, ScrollView, TextInput
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, Link } from 'expo-router';
import * as Yup from 'yup';
import * as SecureStore from 'expo-secure-store';
import { AuthService } from '../../services/auth.service';
import Colors from '../../constants/Colors';
import CustomAlertModal from '../../components/CustomAlertModal';

// --- Componente Stepper y Esquema de Validación (sin cambios) ---
const Stepper = ({ currentStep }: { currentStep: number }) => (
  <View style={styles.stepperContainer}><View style={styles.step}><View style={[styles.stepCircle, currentStep >= 1 && styles.stepCircleActive]}><Text style={[styles.stepText, currentStep >= 1 && styles.stepTextActive]}>1</Text></View><Text style={[styles.stepLabel, currentStep >= 1 && styles.stepLabelActive]}>Credenciales</Text></View><View style={styles.stepperLine} /><View style={styles.step}><View style={[styles.stepCircle, currentStep >= 2 && styles.stepCircleActive]}><Text style={[styles.stepText, currentStep >= 2 && styles.stepTextActive]}>2</Text></View><Text style={[styles.stepLabel, currentStep >= 2 && styles.stepLabelActive]}>Datos personales</Text></View></View>
);
const validationSchema = Yup.object().shape({
  Nombre: Yup.string().required('El nombre es requerido'),
  Apellido: Yup.string().required('El apellido es requerido'),
  Telefono: Yup.string().required('El teléfono es requerido'),
  Institucion: Yup.string().required('La institución es requerida'),
  Cargo: Yup.string().required('El cargo es requerido'),
});

// --- Componente Principal ---
const RegisterProfileScreen = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [profile, setProfile] = useState({ Nombre: '', Apellido: '', Telefono: '', Institucion: '', Cargo: '' });
  const [isFormValid, setIsFormValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modalConfig, setModalConfig] = useState({ visible: false, title: '', message: '', onConfirm: () => {} });

  useEffect(() => { validationSchema.isValid(profile).then(setIsFormValid); }, [profile]);
  const handleInputChange = (name: keyof typeof profile, value: string) => { setProfile(prevState => ({ ...prevState, [name]: value })); };
  const handleCompleteProfile = async () => {
    if (!isFormValid || loading) return;
    setLoading(true);
    setError('');
    const tempToken = await SecureStore.getItemAsync('tempRegToken');
    if (!tempToken) {
      Alert.alert('Sesión Expirada', 'Por favor, inicia el proceso de registro nuevamente.', [{ text: 'OK', onPress: () => router.replace('/(auth)/register') }]);
      setLoading(false);
      return;
    }
    // 1. Llama al backend. Ahora esta función enviará el correo.
        const result = await AuthService.registerProfile(profile, tempToken);
        setLoading(false);

        if (result.success) {
            // 2. Si el backend responde bien, muestra la alerta
            setModalConfig({
                visible: true,
                title: '¡Revisa tu correo!',
                message: 'Hemos enviado un enlace a tu dirección para que confirmes tu cuenta. Por favor, revisa tu bandeja de entrada y spam.',
                onConfirm: () => {
                    setModalConfig({ ...modalConfig, visible: false });
                    router.replace('/(auth)/login');
                },
            });
        } else {
            setError(result.error || 'Ocurrió un error al completar el perfil.');
        }
    };

  return (
    <SafeAreaView style={{flex: 1,
      paddingTop: insets.top - 60,
      paddingBottom: insets.bottom - 48,
      backgroundColor: Colors.background,}} >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20} 
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"          
        >
        
          <View style={styles.header}>
            <Text style={styles.title}>Completa tus datos</Text>
            <Text style={styles.subtitle}>Por favor, introduce tus datos personales</Text>
          </View>
          <Stepper currentStep={2} />
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nombre</Text>
              <TextInput 
              style={styles.input} 
              placeholder="Ingresa tu nombre" 
              value={profile.Nombre} 
              onChangeText={(val) => handleInputChange('Nombre', val)} /></View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Apellido</Text>
              <TextInput 
              style={styles.input} 
              placeholder="Ingresa tu apellido" 
              value={profile.Apellido} 
              onChangeText={(val) => handleInputChange('Apellido', val)} /></View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Teléfono</Text>
              <TextInput 
              style={styles.input} 
              placeholder="Ingresa tu número" 
              value={profile.Telefono} 
              onChangeText={(val) => handleInputChange('Telefono', val)} keyboardType="phone-pad" /></View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Institución</Text>
              <TextInput 
              style={styles.input} 
              placeholder="Ingresa tu institución" 
              value={profile.Institucion} 
              onChangeText={(val) => handleInputChange('Institucion', val)} /></View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Cargo</Text>
              <TextInput 
              style={styles.input} 
              placeholder="Ingresa tu cargo" 
              value={profile.Cargo} 
              onChangeText={(val) => handleInputChange('Cargo', val)} /></View>
          </View>
        
          <View style={styles.footer}>

            <View style={styles.legalContainer}>
              <Text style={styles.legalText}>Al crear una cuenta, aceptas los </Text>
              <TouchableOpacity onPress={() => router.push('/terms')}>
                <Text style={styles.linkText}>Términos y Condiciones</Text>
              </TouchableOpacity>
              <Text style={styles.legalText}> y la </Text>
              <TouchableOpacity onPress={() => router.push('/privacy')}>
                <Text style={styles.linkText}>Política de Privacidad</Text>
              </TouchableOpacity>
              <Text style={styles.legalText}>.</Text>
            </View>            

            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <TouchableOpacity style={[styles.button, (!isFormValid || loading) && styles.buttonDisabled]} onPress={handleCompleteProfile} disabled={!isFormValid || loading}>
              {loading ? <ActivityIndicator color={Colors.textLight} /> : <Text style={styles.buttonText}>Crear cuenta</Text>}
            </TouchableOpacity>
            <View style={styles.loginLinkContainer}>
              <Text style={styles.loginText}>¿Ya tienes una cuenta? </Text>
              <Link href="/(auth)/login" asChild><TouchableOpacity><Text style={styles.loginLink}>Inicia sesión</Text></TouchableOpacity></Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* COMPONENTE DE ALERTA */}
            <CustomAlertModal
                visible={modalConfig.visible}
                title={modalConfig.title}
                message={modalConfig.message}
                confirmText="OK"
                onConfirm={modalConfig.onConfirm}
                onCancel={modalConfig.onConfirm} // El botón de fondo hace lo mismo que OK
            />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: Colors.background },
  keyboardAvoiding: { flex: 1 },
  // Un estilo simple solo con padding.
  // Se elimina 'flexGrow' y 'justifyContent'.
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: { marginBottom: 24 },
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
  title: { fontFamily: 'Roboto_700Bold', fontSize: 24, textAlign: 'center', marginBottom: 8, color: Colors.text },
  subtitle: { fontFamily: 'Roboto_400Regular', fontSize: 16, textAlign: 'center', color: Colors.textSecondary },
  form: { marginTop: 32 },
  inputContainer: { marginBottom: 20 },
  label: { fontFamily: 'Roboto_400Regular', fontSize: 14, color: Colors.textSecondary, marginBottom: 8 },
  input: { height: 56, backgroundColor: '#FFF', borderWidth: 1, borderColor: Colors.border, borderRadius: 8, paddingHorizontal: 16, fontSize: 16, fontFamily: 'Roboto_400Regular' },
  footer: { marginTop: 10 }, // Margen para separar del último campo
  errorText: { color: Colors.error, textAlign: 'center', marginBottom: 10, fontFamily: 'Roboto_400Regular' },
  button: { width: '100%', height: 56, backgroundColor: Colors.primary, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  buttonDisabled: { backgroundColor: '#cccccc' },
  buttonText: { fontFamily: 'Roboto_500Medium', color: Colors.textLight, fontSize: 16 },
  loginLinkContainer: { marginTop: 24, flexDirection: 'row', justifyContent: 'center' },
  loginText: { fontFamily: 'Roboto_400Regular', color: Colors.textSecondary, fontSize: 14 },
  loginLink: { fontFamily: 'Roboto_500Medium', color: Colors.link, fontSize: 14 },
  stepperContainer: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center', width: '80%', alignSelf: 'center' },
  step: { alignItems: 'center', flex: 1 },
  stepCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center' },
  stepCircleActive: { backgroundColor: Colors.primary },
  stepText: { fontFamily: 'Roboto_700Bold', color: Colors.text },
  stepTextActive: { color: Colors.textLight },
  stepLabel: { fontFamily: 'Roboto_400Regular', marginTop: 8, color: Colors.textSecondary, fontSize: 12, textAlign: 'center' },
  stepLabelActive: { fontFamily: 'Roboto_700Bold', color: Colors.primary },
  stepperLine: { flex: 1, height: 2, backgroundColor: '#E5E7EB', marginTop: 15 },
});

export default RegisterProfileScreen;