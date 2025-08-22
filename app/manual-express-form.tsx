import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity,
  KeyboardAvoidingView, Platform, Alert, ActivityIndicator
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Yup from 'yup';
import { useAuth } from '../hooks/useAuth';
import { FormService } from '../services/form.service';
import Colors from '../constants/Colors';
import CustomAlertModal from '../components/CustomAlertModal';

// --- DEFINICIONES DEL FORMULARIO ---
interface FormDataState {
  nombreInstitucion: string;
  siglasInstitucion: string;
  unidadGestion: string;
  unidadSistemas: string;
}

const FORM_FIELDS: { key: keyof FormDataState; label: string; }[] = [
  { key: 'nombreInstitucion', label: '1. Indique el Nombre de la Institución / Ente / Órgano.' },
  { key: 'siglasInstitucion', label: '2. Indique el Acrónimo y/o siglas de la Institución / Ente / Órgano.' },
  { key: 'unidadGestion', label: '3. Indique el Nombre de la Unidad / Gerencia y/u Oficina responsable de la Gestión Administrativa y Financiera.' },
  { key: 'unidadSistemas', label: '4. Indique el Nombre de la Unidad / Gerencia y/u Oficina responsable del Área de Sistema y Tecnología.' },
];

const validationSchema = Yup.object().shape({
  nombreInstitucion: Yup.string().required('Campo requerido'),
  siglasInstitucion: Yup.string().required('Campo requerido'),
  unidadGestion: Yup.string().required('Campo requerido'),
  unidadSistemas: Yup.string().required('Campo requerido'),
});

// --- COMPONENTE PRINCIPAL ---
const ManualExpressFormScreen = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();

  const [formData, setFormData] = useState<FormDataState>({
    nombreInstitucion: '',
    siglasInstitucion: '',
    unidadGestion: '',
    unidadSistemas: '',
  });

  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState('');
  const [modalConfig, setModalConfig] = useState({ visible: false, title: '', message: '', onConfirm: () => {} });  

  useEffect(() => {
    const verifyStatus = async () => {
      try {
        const { hasSubmitted, isRestrictionActive } = await FormService.checkExpressSubmissionStatus();
        if (isRestrictionActive && hasSubmitted) {
          setModalConfig({
            visible: true,
            title: 'Límite alcanzado',
            message: 'Ya has llenado este formulario.',
            onConfirm: () => router.back(),
          });
        } else {
          setIsVerifying(false);
        }
      } catch (e) {
        setModalConfig({
          visible: true,
          title: 'Error',
          message: 'No se pudo verificar el estado del formulario.',
          onConfirm: () => router.back(),
        });
      }
    };
    verifyStatus();
  }, []);

  useEffect(() => {
    validationSchema.isValid(formData).then(setIsFormValid);
  }, [formData]);

  const handleInputChange = (name: keyof FormDataState, value: string) => {
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!isFormValid || isSubmitting) return;
    setError('');
    setIsSubmitting(true);
    try {
      // Las claves del payload ahora coinciden EXACTAMENTE con las del backend.
      const payload = {
        'Indique el Nombre de la Institución / Ente / Órgano.': formData.nombreInstitucion,
        'Indique el Acrónimo y/o siglas de la Institución / Ente / Órgano.': formData.siglasInstitucion,
        'Indique el Nombre de la Unidad / Gerencia y/u Oficina responsable de la Gestión Administrativa y Financiera de la Institución / Ente / Órgano.': formData.unidadGestion,
        'Indique el Nombre de la Unidad / Gerencia y/u Oficina responsable del Área de Sistema y Tecnología de la Institución / Ente / Órgano.': formData.unidadSistemas,
      };
      const result = await FormService.submitManualExpress(payload);
      if (result.success) {
        setModalConfig({
            visible: true,
            title: 'Éxito',
            message: 'Formulario generado correctamente. En unos minutos lo recibirás en tu correo.',
            onConfirm: () => {
                setModalConfig(prev => ({ ...prev, visible: false }));
                router.back();
            }
        });
      } else {
        setError(result.error || 'Ocurrió un error al enviar el formulario.');
      }
    } catch (e) {
      setError('Ocurrió un error inesperado.');
    } finally {
      setIsSubmitting(false);
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
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 50}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.title}>Elabora tu manual express</Text>
            <Text style={styles.subtitle}>Ingresa los datos básicos para generar una demostración del manual de concurso abierto. Lo recibirás en tu correo en pocos minutos.</Text>
          </View>

          {FORM_FIELDS.map(field => (
            <View key={field.key} style={styles.inputContainer}>
              <Text style={styles.label}>{field.label}</Text>
              <TextInput style={styles.input} value={formData[field.key]} onChangeText={(val) => handleInputChange(field.key, val)} />
            </View>
          ))}
          
          <View style={styles.footer}>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <TouchableOpacity style={[styles.button, (!isFormValid || isSubmitting) && styles.buttonDisabled, styles.buttonExpress]} onPress={handleSubmit} disabled={!isFormValid || isSubmitting}>
              {isSubmitting ? <ActivityIndicator color={Colors.primary} /> : <Text style={styles.buttonTextExpress}>Elaborar manual</Text>}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {modalConfig.visible && (
        <View style={styles.overlay} />
      )}
      <CustomAlertModal
        visible={modalConfig.visible}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText="OK"
        onConfirm={modalConfig.onConfirm}
        onCancel={modalConfig.onConfirm}
      />
    </SafeAreaView>
  );
};

// --- ESTILOS ---
const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: Colors.background },
  scrollContainer: { 
    padding: 20,
    paddingBottom: 40,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    zIndex: 1,
  },
  footer: {
    marginTop: 12, // Margen para separar del último campo
  },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },
  loadingText: { fontFamily: 'Roboto_400Regular', marginTop: 16, fontSize: 16, color: Colors.textSecondary },
  header: { marginBottom: 32, alignItems: 'center' },
  title: { fontFamily: 'Roboto_700Bold', fontSize: 22, color: Colors.text, textAlign: 'center' },
  subtitle: { fontFamily: 'Roboto_400Regular', fontSize: 15, color: Colors.textSecondary, textAlign: 'center', marginTop: 12, lineHeight: 22 },
  inputContainer: { marginBottom: 20 },
  label: { fontFamily: 'Roboto_500Medium', fontSize: 16, color: Colors.text, marginBottom: 8, lineHeight: 22 },
  input: {
    height: 56, backgroundColor: '#FFF', borderWidth: 1, borderColor: Colors.border,
    borderRadius: 8, paddingHorizontal: 16, fontSize: 16, fontFamily: 'Roboto_400Regular'
  },
  button: {
    width: '100%', height: 56, borderRadius: 8,
    justifyContent: 'center', alignItems: 'center', marginTop: 16,
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
  },
  buttonExpress: {
    backgroundColor: Colors.accentExpress,
  },
  buttonTextExpress: {
    fontFamily: 'Roboto_500Medium',
    color: Colors.primary,
    fontSize: 16
  },
  errorText: { color: Colors.error, textAlign: 'center', marginBottom: 12, fontFamily: 'Roboto_400Regular' },
});

export default ManualExpressFormScreen;