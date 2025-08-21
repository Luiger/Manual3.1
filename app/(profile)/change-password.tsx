import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity,
  ScrollView, Alert, ActivityIndicator, Platform, KeyboardAvoidingView
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import * as Yup from 'yup';
import { UserService } from '../../services/user.service';
import Colors from '../../constants/Colors';
import { Feather } from '@expo/vector-icons';

const Stepper = ({ currentStep }: { currentStep: number }) => (
    <View style={styles.stepperContainer}>
        <View style={styles.step}><View style={[styles.stepCircle, currentStep >= 1 && styles.stepCircleActive]}><Text style={[styles.stepText, currentStep >= 1 && styles.stepTextActive]}>1</Text></View><Text style={[styles.stepLabel, currentStep >= 1 && styles.stepLabelActive]}>Verificar</Text></View>
        <View style={styles.stepperLine} />
        <View style={styles.step}><View style={[styles.stepCircle, currentStep >= 2 && styles.stepCircleActive]}><Text style={[styles.stepText, currentStep >= 2 && styles.stepTextActive]}>2</Text></View><Text style={[styles.stepLabel, currentStep >= 2 && styles.stepLabelActive]}>Establecer</Text></View>
    </View>
);

const step1Schema = Yup.object({ currentPassword: Yup.string().required('La contraseña es requerida') });
const step2Schema = Yup.object({
  newPassword: Yup.string().min(8, 'La contraseña debe tener al menos 8 caracteres').required('La nueva contraseña es requerida'),
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
    // Unificamos todos los errores en un solo estado.
    const [error, setError] = useState({ step1: '', step2: '' });
    // Validación de mensajes para cada campo
    const [validationMessages, setValidationMessages] = useState({ current: '', new: '', confirm: '' });
    // Estados para la visibilidad de las contraseñas
    const [isCurrentVisible, setIsCurrentVisible] = useState(false);
    const [isNewVisible, setIsNewVisible] = useState(false);
    const [isConfirmVisible, setIsConfirmVisible] = useState(false);

    // Lógica para validar los formularios en tiempo real
    useEffect(() => {
        if (step === 1) {
            step1Schema.isValid({ currentPassword }).then(setIsStepValid);
        } else {
            step2Schema.isValid({ newPassword, confirmPassword }).then(setIsStepValid);
        }
    }, [step, currentPassword, newPassword, confirmPassword]);

    // Lógica para los mensajes de validación del paso 2
    useEffect(() => {
        if (step === 2) {
            if (newPassword.length > 0 && newPassword.length < 8) {
                setValidationMessages(prev => ({ ...prev, new: 'La contraseña debe poseer mínimo 8 caracteres' }));
            } else {
                setValidationMessages(prev => ({ ...prev, new: '' }));
            }
            if (confirmPassword.length > 0 && newPassword !== confirmPassword) {
                setValidationMessages(prev => ({ ...prev, confirm: 'Las contraseñas deben coincidir' }));
            } else {
                setValidationMessages(prev => ({ ...prev, confirm: '' }));
            }
        }
    }, [newPassword, confirmPassword, step]);

    // Función de verificación actualizada para usar el nuevo estado de error.
    const handleVerify = async () => {
        if (loading) return; // Permitimos verificar aunque el campo esté vacío
        setLoading(true);
        setValidationMessages({ current: '', new: '', confirm: '' }); // Limpia errores
        
        const result = await UserService.verifyPassword(currentPassword);
        if (result.success) {
            setStep(2);
        } else {
            setValidationMessages(prev => ({ ...prev, current: result.error || 'Contraseña incorrecta' }));
        }
        setLoading(false);
    };

    const handleSaveChanges = async () => {
        if (!isStepValid || loading) return;
        setLoading(true);
        setError({ ...error, step2: '' }); // Limpia el error del paso 2
        const result = await UserService.changePassword(newPassword);
        if (result.success) {
            Alert.alert('Éxito', 'Tu contraseña ha sido actualizada.', [
                { text: 'OK', onPress: () => router.back() }
            ]);
        } else {
            // Aquí se mostrará el error "contraseña usada anteriormente"
            setError(prev => ({ ...prev, step2: result.error || 'No se pudo cambiar la contraseña.' }));
        }
        setLoading(false);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <Stack.Screen options={{ 
                headerShown: true,
                title: step === 1 ? 'Verificar Identidad' : 'Establecer Nueva Contraseña',
            }} />
            <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"} 
            style={{flex: 1}}>
                <ScrollView 
                style={{ flex: 1 }}
                  contentContainerStyle={styles.container}
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}  
                >
                    {step === 1 ? (
                        <>
                            <Text style={styles.subtitle}>Para continuar, ingresa tu contraseña actual.</Text>
                            <Stepper currentStep={1} />
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Contraseña Actual</Text>
                                <TextInput 
                                style={styles.input} 
                                value={currentPassword} 
                                placeholder='Mínimo 8 caracteres'
                                onChangeText={(text) => {
                                        setCurrentPassword(text);
                                        if (validationMessages.current) setValidationMessages(prev => ({...prev, current: ''}));
                                    }}
                                    secureTextEntry
                                    onFocus={() => setValidationMessages(prev => ({...prev, current: 'Debe escribir su contraseña actual'}))}
                                    onBlur={() => setValidationMessages(p => ({...p, current: ''}))}
                                
                                />
                                
                                {/* Mensaje de validación */}
                                {validationMessages.current && <Text style={styles.validationText}>{validationMessages.current}</Text>}
                                
                            </View>
                            {error.step1 ? <Text style={styles.errorText}>{error.step1}</Text> : null}
                            <TouchableOpacity style={[styles.button, (!isStepValid || loading) && styles.buttonDisabled]} onPress={handleVerify} disabled={!isStepValid || loading}>
                                {loading ? <ActivityIndicator color={Colors.textLight}/> : <Text style={styles.buttonText}>Verificar</Text>}                                
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password')}><Text style={styles.link}>¿Olvidaste tu Contraseña? Ingresa aquí</Text></TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <Text style={styles.subtitle}>Tu nueva contraseña debe ser segura.</Text>
                            <Stepper currentStep={2} />
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Nueva Contraseña</Text>
                                <TextInput 
                                style={styles.input} 
                                placeholder='Mínimo 8 caracteres' 
                                value={newPassword} 
                                onChangeText={setNewPassword} 
                                secureTextEntry 
                                onFocus={() => {
                                        if (newPassword.length < 8) setValidationMessages(prev => ({...prev, new: 'La contraseña debe poseer mínimo 8 caracteres'}));
                                    }}
                                />
                                {validationMessages.new && <Text style={styles.validationText}>{validationMessages.new}</Text>}
                            </View>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Confirmar Nueva Contraseña</Text>
                                <TextInput 
                                style={styles.input} 
                                placeholder='Confirma tu nueva contraseña' 
                                value={confirmPassword} 
                                onChangeText={setConfirmPassword} 
                                secureTextEntry 
                                onFocus={() => {
                                        if (newPassword !== confirmPassword) setValidationMessages(prev => ({...prev, confirm: 'Las contraseñas deben coincidir'}));
                                    }}
                                />
                                {validationMessages.confirm && <Text style={styles.validationText}>{validationMessages.confirm}</Text>}
                            </View>
                            {/* Mostramos el error del Paso 2 encima del botón */}
                            {error.step2 ? <Text style={styles.submissionErrorText}>{error.step2}</Text> : null}
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
  container: { 
    flexGrow: 1, 
    padding: 24, 
    paddingTop: 16,
},
  subtitle: { fontFamily: 'Roboto_400Regular', fontSize: 16, color: Colors.textSecondary, textAlign: 'center', marginBottom: 24 },
  inputGroup: { width: '100%', marginBottom: 16 },
  label: { fontFamily: 'Roboto_400Regular', fontSize: 14, color: Colors.text, marginBottom: 8 },
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
  validationText: {
    fontFamily: 'Roboto_400Regular',
    color: Colors.error,
    fontSize: 13,
    marginTop: 6,
    paddingLeft: 4,
  },
  submissionErrorText: { 
    color: Colors.error, 
    textAlign: 'center', 
    marginTop: 16, // Espacio entre el botón y el error
    fontFamily: 'Roboto_400Regular' 
  },
});

export default ChangePasswordScreen;