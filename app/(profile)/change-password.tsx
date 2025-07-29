import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity,
  ScrollView, Alert, ActivityIndicator, Platform, KeyboardAvoidingView
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import * as Yup from 'yup';
import { UserService } from '../../services/user.service';
import Colors from '../../constants/Colors';

const Stepper = ({ currentStep }: { currentStep: number }) => (
    <View style={styles.stepperContainer}>
        <View style={styles.step}><View style={[styles.stepCircle, currentStep >= 1 && styles.stepCircleActive]}><Text style={[styles.stepText, currentStep >= 1 && styles.stepTextActive]}>1</Text></View><Text style={[styles.stepLabel, currentStep >= 1 && styles.stepLabelActive]}>Verificar</Text></View>
        <View style={styles.stepperLine} />
        <View style={styles.step}><View style={[styles.stepCircle, currentStep >= 2 && styles.stepCircleActive]}><Text style={[styles.stepText, currentStep >= 2 && styles.stepTextActive]}>2</Text></View><Text style={[styles.stepLabel, currentStep >= 2 && styles.stepLabelActive]}>Establecer</Text></View>
    </View>
);

const step1Schema = Yup.object({ currentPassword: Yup.string().required('La contraseña es requerida') });
const step2Schema = Yup.object({
  newPassword: Yup.string().min(8, 'Mínimo 8 caracteres').required('La contraseña es requerida'),
  confirmPassword: Yup.string().oneOf([Yup.ref('newPassword')], 'Las contraseñas no coinciden').required('Confirma la contraseña'),
});

const ChangePasswordScreen = () => {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isStepValid, setIsStepValid] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        let schema;
        let data;
        if (step === 1) { schema = step1Schema; data = { currentPassword }; }
        else { schema = step2Schema; data = { newPassword, confirmPassword }; }
        
        schema.isValid(data).then(setIsStepValid);
    }, [step, currentPassword, newPassword, confirmPassword]);

    const handleVerify = async () => {
        if (!isStepValid || loading) return;
        setLoading(true);
        setError('');
        const result = await UserService.verifyPassword(currentPassword);
        if (result.success) {
            setStep(2);
        } else {
            setError(result.error || 'La contraseña actual es incorrecta.');
        }
        setLoading(false);
    };

    const handleSaveChanges = async () => {
        if (!isStepValid || loading) return;
        setLoading(true);
        setError('');
        const result = await UserService.changePassword(newPassword);
        if (result.success) {
            Alert.alert('Éxito', 'Tu contraseña ha sido actualizada.', [
                { text: 'OK', onPress: () => router.back() }
            ]);
        } else {
            setError(result.error || 'No se pudo cambiar la contraseña.');
        }
        setLoading(false);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <Stack.Screen options={{ 
                headerShown: true,
                title: step === 1 ? 'Verificar Identidad' : 'Establecer Nueva Contraseña',
            }} />
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{flex: 1}}>
                <ScrollView contentContainerStyle={styles.container}>
                    {step === 1 ? (
                        <>
                            <Text style={styles.subtitle}>Para continuar, ingresa tu contraseña actual.</Text>
                            <Stepper currentStep={1} />
                            <View style={styles.inputGroup}><Text style={styles.label}>Contraseña Actual</Text><TextInput style={styles.input} value={currentPassword} onChangeText={setCurrentPassword} secureTextEntry /></View>
                            {error ? <Text style={styles.errorText}>{error}</Text> : null}
                            <TouchableOpacity style={[styles.button, (!isStepValid || loading) && styles.buttonDisabled]} onPress={handleVerify} disabled={!isStepValid || loading}>
                                {loading ? <ActivityIndicator color={Colors.textLight}/> : <Text style={styles.buttonText}>Verificar</Text>}
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password')}><Text style={styles.link}>¿Olvidaste tu Contraseña? Ingresa aquí</Text></TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <Text style={styles.subtitle}>Tu nueva contraseña debe ser segura.</Text>
                            <Stepper currentStep={2} />
                            <View style={styles.inputGroup}><Text style={styles.label}>Nueva Contraseña</Text><TextInput style={styles.input} placeholder='Mínimo 8 caracteres' value={newPassword} onChangeText={setNewPassword} secureTextEntry /></View>
                            <View style={styles.inputGroup}><Text style={styles.label}>Confirmar Nueva Contraseña</Text><TextInput style={styles.input} placeholder='Confirma tu nueva contraseña' value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry /></View>
                            {error ? <Text style={styles.errorText}>{error}</Text> : null}
                            <TouchableOpacity style={[styles.button, (!isStepValid || loading) && styles.buttonDisabled]} onPress={handleSaveChanges} disabled={!isStepValid || loading}>
                                {loading ? <ActivityIndicator color={Colors.textLight}/> : <Text style={styles.buttonText}>Guardar Cambios</Text>}
                            </TouchableOpacity>
                        </>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  container: { flexGrow: 1, padding: 24, paddingTop: 16 },
  subtitle: { fontFamily: 'Roboto_400Regular', fontSize: 16, color: Colors.textSecondary, textAlign: 'center', marginBottom: 24 },
  inputGroup: { width: '100%', marginBottom: 16 },
  label: { fontFamily: 'Roboto_400Regular', fontSize: 14, color: Colors.textSecondary, marginBottom: 8 },
  input: { height: 56, backgroundColor: '#FFF', borderWidth: 1, borderColor: Colors.border, borderRadius: 8, paddingHorizontal: 16, fontSize: 16, fontFamily: 'Roboto_400Regular' },
  button: { width: '100%', backgroundColor: Colors.primary, height: 56, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 16 },
  buttonDisabled: { backgroundColor: '#cccccc' },
  buttonText: { fontFamily: 'Roboto_500Medium', color: Colors.textLight, fontSize: 16 },
  link: { fontFamily: 'Roboto_500Medium', color: Colors.link, fontSize: 14, textAlign: 'center', marginTop: 24 },
  errorText: { color: Colors.error, textAlign: 'center', marginBottom: 10, fontFamily: 'Roboto_400Regular' },
  stepperContainer: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center', marginBottom: 32, width: '80%', alignSelf: 'center' },
  step: { alignItems: 'center', flex: 1 },
  stepCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center' },
  stepCircleActive: { backgroundColor: Colors.primary },
  stepText: { fontFamily: 'Roboto_700Bold', color: Colors.text },
  stepTextActive: { color: Colors.textLight },
  stepLabel: { fontFamily: 'Roboto_400Regular', marginTop: 8, color: Colors.textSecondary, fontSize: 12, textAlign: 'center' },
  stepLabelActive: { fontFamily: 'Roboto_700Bold', color: Colors.primary },
  stepperLine: { flex: 1, height: 2, backgroundColor: '#E5E7EB', marginTop: 15 },
});

export default ChangePasswordScreen;