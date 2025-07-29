import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, Alert, ActivityIndicator, TouchableOpacity,
  Platform, KeyboardAvoidingView, ScrollView, TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Yup from 'yup';
import * as SecureStore from 'expo-secure-store';
import { Feather } from '@expo/vector-icons';

import { AuthService } from '../../services/auth.service';
import Colors from '../../constants/Colors';

// --- Componente Stepper para 3 pasos ---
const Stepper = ({ currentStep }: { currentStep: number }) => {
    const steps = ['Enviar correo', 'Código', 'Nueva Contraseña'];
    return (
      <View style={styles.stepperContainer}>
        {steps.map((label, index) => (
          <React.Fragment key={index}>
            <View style={styles.step}>
              <View style={[styles.stepCircle, currentStep >= index + 1 && styles.stepCircleActive]}>
                <Text style={[styles.stepText, currentStep >= index + 1 && styles.stepTextActive]}>{index + 1}</Text>
              </View>
              <Text style={[styles.stepLabel, currentStep >= index + 1 && styles.stepLabelActive]}>{label}</Text>
            </View>
            {index < steps.length - 1 && <View style={styles.stepperLine} />}
          </React.Fragment>
        ))}
      </View>
    );
};

// --- Esquemas de Validación con Yup ---
const step1Schema = Yup.object({ email: Yup.string().email('Correo no válido').required('El correo es requerido') });
const step2Schema = Yup.object({ otp: Yup.string().length(6, 'El código debe tener 6 dígitos').required('El código es requerido') });
const step3Schema = Yup.object({
  password: Yup.string().min(8, 'Mínimo 8 caracteres').required('La contraseña es requerida'),
  confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Las contraseñas no coinciden').required('Confirma la contraseña'),
});

const ForgotPasswordScreen = () => {
    const router = useRouter();
    
    // --- Lógica de estados y handlers (sin cambios funcionales) ---
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isStepValid, setIsStepValid] = useState(false);

    useEffect(() => {
        let schema;
        let data;
        if (step === 1) { schema = step1Schema; data = { email }; }
        else if (step === 2) { schema = step2Schema; data = { otp }; }
        else { schema = step3Schema; data = { password, confirmPassword }; }
        
        schema.isValid(data).then(setIsStepValid);
    }, [step, email, otp, password, confirmPassword]);

    const handleSendEmail = async () => {
        if (!isStepValid || loading) return;
        setLoading(true);
        setError('');
        await AuthService.forgotPassword(email);
        setLoading(false);
        setStep(2);
    };

    const handleVerifyOtp = async () => {
        if (!isStepValid || loading) return;
        setLoading(true);
        setError('');
        const result = await AuthService.verifyOtp(email, otp);
        if (result.success && result.resetToken) {
            await SecureStore.setItemAsync('resetToken', result.resetToken);
            setStep(3);
        } else {
            setError(result.error || 'Código incorrecto o expirado.');
        }
        setLoading(false);
    };

    const handleResetPassword = async () => {
        if (!isStepValid || loading) return;
        setLoading(true);
        setError('');
        const resetToken = await SecureStore.getItemAsync('resetToken');
        if (!resetToken) {
            setError('Sesión inválida. Por favor, inicia el proceso de nuevo.');
            setLoading(false);
            return;
        }
        const result = await AuthService.resetPassword(password, resetToken);
        if (result.success) {
            await SecureStore.deleteItemAsync('resetToken');
            Alert.alert('Éxito', 'Tu contraseña ha sido actualizada.', [
                { text: 'OK', onPress: () => router.replace('/(auth)/login') }
            ]);
        } else {
            setError(result.error || 'Ocurrió un error.');
        }
        setLoading(false);
    };

    // --- Renderizado de cada paso ---
    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <>
                        <Text style={styles.title}>Recuperar contraseña</Text>
                        <Text style={styles.subtitle}>Ingresa el correo electrónico asociado a tu cuenta.</Text>
                        <Stepper currentStep={1} />
                        <View style={styles.inputContainer}><Text style={styles.label}>Correo electrónico</Text><TextInput style={styles.input} placeholder="Ingresa tu correo" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" /></View>
                        <TouchableOpacity style={[styles.button, !isStepValid && styles.buttonDisabled]} onPress={handleSendEmail} disabled={!isStepValid || loading}>
                            {loading ? <ActivityIndicator color={Colors.textLight} /> : <Text style={styles.buttonText}>Enviar</Text>}
                        </TouchableOpacity>
                    </>
                );
            case 2:
                return (
                    <>
                        <Text style={styles.title}>Verificar código</Text>
                        <Text style={styles.subtitle}>Hemos enviado un código a {'\n'}<Text style={{fontWeight: 'bold'}}>{email}</Text></Text>
                        <Stepper currentStep={2} />
                        <View style={styles.inputContainer}><Text style={styles.label}>Código de Verificación</Text><TextInput style={styles.input} placeholder="123456" value={otp} onChangeText={setOtp} keyboardType="number-pad" maxLength={6} /></View>
                        <TouchableOpacity style={[styles.button, !isStepValid && styles.buttonDisabled]} onPress={handleVerifyOtp} disabled={!isStepValid || loading}>
                            {loading ? <ActivityIndicator color={Colors.textLight} /> : <Text style={styles.buttonText}>Verificar</Text>}
                        </TouchableOpacity>
                    </>
                );
            case 3:
                return (
                    <>
                        <Text style={styles.title}>Establecer nueva contraseña</Text>
                        <Text style={styles.subtitle}>Tu nueva contraseña debe ser segura.</Text>
                        <Stepper currentStep={3} />
                        <View style={styles.inputContainer}><Text style={styles.label}>Nueva Contraseña</Text><View style={styles.passwordWrapper}><TextInput style={styles.passwordInput} placeholder="Mínimo 8 caracteres" value={password} onChangeText={setPassword} secureTextEntry={!isPasswordVisible} /><TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}><Feather name={isPasswordVisible ? 'eye-off' : 'eye'} size={22} color={Colors.textSecondary} /></TouchableOpacity></View></View>
                        <View style={styles.inputContainer}><Text style={styles.label}>Confirmar Nueva Contraseña</Text><View style={styles.passwordWrapper}><TextInput style={styles.passwordInput} placeholder="Confirma tu nueva contraseña" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry={!isConfirmPasswordVisible} /><TouchableOpacity onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}><Feather name={isConfirmPasswordVisible ? 'eye-off' : 'eye'} size={22} color={Colors.textSecondary} /></TouchableOpacity></View></View>
                        <TouchableOpacity style={[styles.button, !isStepValid && styles.buttonDisabled]} onPress={handleResetPassword} disabled={!isStepValid || loading}>
                            {loading ? <ActivityIndicator color={Colors.textLight} /> : <Text style={styles.buttonText}>Actualizar contraseña</Text>}
                        </TouchableOpacity>
                    </>
                );
            default: return null;
        }
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardAvoiding}>
                <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
                    {renderStepContent()}
                    {error ? <Text style={styles.errorText}>{error}</Text> : null}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

// ✅ Estilos actualizados con la nueva paleta y tipografía
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  keyboardAvoiding: { flex: 1 },
  scrollContainer: { flexGrow: 1, padding: 24, paddingTop: 16 },
  title: { fontFamily: 'Roboto_700Bold', fontSize: 24, textAlign: 'center', color: Colors.text, marginBottom: 8 },
  subtitle: { fontFamily: 'Roboto_400Regular', fontSize: 16, color: Colors.textSecondary, textAlign: 'center', marginBottom: 24 },
  stepperContainer: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center', marginBottom: 32, width: '100%' },
  step: { alignItems: 'center', flex: 1 },
  stepCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center' },
  stepCircleActive: { backgroundColor: Colors.primary },
  stepText: { fontFamily: 'Roboto_700Bold', color: Colors.text },
  stepTextActive: { color: Colors.textLight },
  stepLabel: { fontFamily: 'Roboto_400Regular', marginTop: 8, color: Colors.textSecondary, fontSize: 12, textAlign: 'center' },
  stepLabelActive: { fontFamily: 'Roboto_700Bold', color: Colors.primary },
  stepperLine: { flex: 1, height: 2, backgroundColor: '#E5E7EB', marginTop: 15 },
  inputContainer: { marginBottom: 20 },
  label: { fontFamily: 'Roboto_400Regular', fontSize: 14, color: Colors.textSecondary, marginBottom: 8 },
  input: { height: 56, backgroundColor: '#FFF', borderWidth: 1, borderColor: Colors.border, borderRadius: 8, paddingHorizontal: 16, fontSize: 16, fontFamily: 'Roboto_400Regular' },
  passwordWrapper: { flexDirection: 'row', alignItems: 'center', height: 56, backgroundColor: '#FFF', borderWidth: 1, borderColor: Colors.border, borderRadius: 8, paddingHorizontal: 16 },
  passwordInput: { flex: 1, fontSize: 16, fontFamily: 'Roboto_400Regular' },
  button: { width: '100%', height: 56, backgroundColor: Colors.primary, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  buttonDisabled: { backgroundColor: '#cccccc' },
  buttonText: { fontFamily: 'Roboto_500Medium', color: Colors.textLight, fontSize: 16 },
  errorText: { fontFamily: 'Roboto_400Regular', color: Colors.error, textAlign: 'center', marginTop: 20, fontSize: 14 },
});

export default ForgotPasswordScreen;