import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, ScrollView,
  TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useNavigation } from 'expo-router';
import * as Yup from 'yup';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';
import { FormService } from '../services/form.service';
import Colors from '../constants/Colors';
import * as Linking from 'expo-linking';
import CustomAlertModal from '../components/CustomAlertModal';

const validationSchema = Yup.object().shape({
  nombreInstitucion: Yup.string().required('Campo requerido'),
  siglasInstitucion: Yup.string().required('Campo requerido'),
  unidadGestion: Yup.string().required('Campo requerido'),
  unidadSistemas: Yup.string().required('Campo requerido'),
  unidadContratante: Yup.string().required('Campo requerido'),
  emailAdicional: Yup.string().email('Formato de email no válido'),
});

const ManualProFormScreen = () => {
  const router = useRouter();
  const { user } = useAuth();
  const navigation = useNavigation();

  const [formData, setFormData] = useState({
    nombreInstitucion: '',
    siglasInstitucion: '',
    unidadGestion: '',
    unidadSistemas: '',
    unidadContratante: '',
    emailAdicional: ''
  });
  
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState<boolean | null>(null);
  const [modalConfig, setModalConfig] = useState({ visible: false, title: '', message: '', confirmText: '', cancelText: '', onConfirm: () => {}, onCancel: () => {} });

  // Este useEffect ahora oculta el header si el modal está visible O si está cargando.
  useEffect(() => {
    const isLoading = hasSubmitted === null;
    navigation.setOptions({
      headerShown: !modalConfig.visible && !isLoading,
    });
  }, [modalConfig.visible, hasSubmitted, navigation]);

  useEffect(() => {
    const handleUpgrade = () => {
      setModalConfig(prev => ({ ...prev, visible: false }));
      router.replace('/(tabs)/home');
      Linking.openURL('https://api.whatsapp.com/send?phone=+584145051716&text=Hola%20%F0%9F%91%8B%20Quiero%20adquirir%20la%20versi%C3%B3n%20PRO%20del%20Manual%20de%20Contrataciones%20P%C3%BAblicas');
    };

    const handleGoBack = () => {
      setModalConfig(prev => ({ ...prev, visible: false }));
      router.back();
    };

    if (user?.Rol === 'Usuario Gratis') {
      setModalConfig({
        visible: true,
        title: '¿Quieres adquirir la versión Pro?',
        message: 'Obtén acceso a todas las modalidades y asegura el cumplimiento total.',
        confirmText: 'Adquirir Pro',
        cancelText: 'Volver',
        onConfirm: handleUpgrade,
        onCancel: handleGoBack,
      });
      return;
    }

    const checkStatus = async () => {
      try {
        const status = await FormService.checkSubmissionStatus();
        if (status.hasSubmitted) {
          setHasSubmitted(true);
          setModalConfig({
            visible: true,
            title: 'Formulario ya enviado',
            message: 'Ya has completado este manual. Puedes encontrarlo en tu correo o en la sección de Repositorio.',
            confirmText: 'OK',
            cancelText: '',
            onConfirm: handleGoBack,
            onCancel: handleGoBack,
          });
        } else {
          setHasSubmitted(false);
        }
      } catch (e) {
        setError('No se pudo verificar el estado del formulario.');
        setHasSubmitted(false);
      }
    };

    checkStatus();
  }, [user, router]);

  useEffect(() => {
    validationSchema.isValid(formData).then(valid => setIsFormValid(valid));
  }, [formData]);

  const handleInputChange = (name: keyof typeof formData, value: string) => {
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!isFormValid || isSubmitting) return;
    setIsSubmitting(true);
    setError('');
    try {
        const payload = {
            nombreInstitucion: formData.nombreInstitucion,
            siglasInstitucion: formData.siglasInstitucion,
            unidadGestion: formData.unidadGestion,
            unidadSistemas: formData.unidadSistemas,
            unidadContratante: formData.unidadContratante,
            emailAdicional: formData.emailAdicional,
        };
        const result = await FormService.submitManualContrataciones(payload);
        if (result.success) {
            Alert.alert('Éxito', 'Formulario enviado correctamente.', [{ text: 'OK', onPress: () => router.back() }]);
        } else {
            setError(result.error || 'Ocurrió un error al enviar el formulario.');
        }
    } catch (e) {
        setError('Ocurrió un error inesperado al conectar con el servidor.');
    } finally {
        setIsSubmitting(false);
    }
  };

  const renderContent = () => {
    if (hasSubmitted === null && user?.Rol !== 'Usuario Gratis') {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      );
    }

    if (user?.Rol === 'Usuario Gratis' || hasSubmitted === true) {
      return null; // Render nothing, the modal will be the only thing visible
    }

    return (
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20} >
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" >
          <View style={styles.header}>
            <Text style={styles.title}>Elabora tu manual PRO</Text>
            <Text style={styles.subtitle}>Completa los siguientes campos para generar la base de tu manual. Una vez elaborado, lo recibirás en tu correo en formato de Google Docs, listo para que lo personalices.</Text>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>1. Indique el nombre de la institución, ente u órgano.</Text>
            <TextInput style={styles.input} value={formData.nombreInstitucion} onChangeText={(val) => handleInputChange('nombreInstitucion', val)} />
            <Text style={styles.legalRef}>Referencia legal: Art. 18.2 LOPA.</Text>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>2. Indique el acrónimo y/o siglas de la institución.</Text>
            <TextInput style={styles.input} value={formData.siglasInstitucion} onChangeText={(val) => handleInputChange('siglasInstitucion', val)} />
            <Text style={styles.legalRef}>Referencia legal: Art. 18.2 LOPA.</Text>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>3. Indique el nombre de la unidad responsable de la gestión administrativa y financiera.</Text>
            <TextInput style={styles.input} value={formData.unidadGestion} onChangeText={(val) => handleInputChange('unidadGestion', val)} />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>4. Indique el nombre de la unidad responsable del área de sistema y tecnología.</Text>
            <TextInput style={styles.input} value={formData.unidadSistemas} onChangeText={(val) => handleInputChange('unidadSistemas', val)} />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>5. Indique el nombre de la unidad que cumple funciones de unidad contratante.</Text>
            <TextInput style={styles.input} value={formData.unidadContratante} onChangeText={(val) => handleInputChange('unidadContratante', val)} />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>¿A qué otra dirección de correo electrónico deseas que enviemos el manual? (Opcional)</Text>
            <TextInput style={styles.input} value={formData.emailAdicional} onChangeText={(val) => handleInputChange('emailAdicional', val)} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} textContentType="none" autoComplete="off" />
          </View>
          <View style={styles.warningBox}>
            <Feather name="alert-triangle" size={20} color={Colors.textSecondary} />
            <Text style={styles.warningText}>Asegúrate de la dirección de correo ingresada. Eres responsable del acceso que compartes a este documento.</Text>
          </View>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <TouchableOpacity style={[styles.button, isFormValid ? styles.buttonPro : styles.buttonDisabled]} onPress={handleSubmit} disabled={!isFormValid || isSubmitting} >
            {isSubmitting ? <ActivityIndicator color={Colors.textLight} /> : <Text style={styles.buttonTextPro}>Elaborar manual</Text>}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {renderContent()}

      {/* ✅ INICIO DEL CAMBIO: Renderizado condicional del fondo oscuro */}
      {modalConfig.visible && (
        <View style={styles.overlay} />
      )}
      {/* FIN DEL CAMBIO */}

      <CustomAlertModal
        visible={modalConfig.visible}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText={modalConfig.confirmText}
        cancelText={modalConfig.cancelText}
        onConfirm={modalConfig.onConfirm}
        onCancel={modalConfig.onCancel}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    zIndex: 1, // Asegura que esté por encima del contenido pero por debajo del modal
  },
  container: { padding: 20, paddingBottom: 40 },
  header: { marginBottom: 32, alignItems: 'center' },
  title: { fontFamily: 'Roboto_700Bold', fontSize: 22, color: Colors.text, textAlign: 'center' },
  subtitle: { fontFamily: 'Roboto_400Regular', fontSize: 15, color: Colors.textSecondary, textAlign: 'center', marginTop: 12, lineHeight: 22 },
  inputGroup: { marginBottom: 24 },
  label: { fontFamily: 'Roboto_500Medium', fontSize: 16, color: Colors.text, marginBottom: 8, lineHeight: 22 },
  input: { height: 56, backgroundColor: '#FFF', borderWidth: 1, borderColor: Colors.border, borderRadius: 8, paddingHorizontal: 16, fontSize: 16, fontFamily: 'Roboto_400Regular' },
  legalRef: { fontFamily: 'Roboto_400Regular', fontSize: 12, color: Colors.textSecondary, marginTop: 4, fontStyle: 'italic' },
  warningBox: { flexDirection: 'row', backgroundColor: Colors.accentExpress, padding: 12, borderRadius: 8, alignItems: 'center', gap: 10, marginTop: 16 },
  warningText: { fontFamily: 'Roboto_400Regular', color: Colors.textSecondary, fontSize: 13, flex: 1, lineHeight: 18 },
  button: { width: '100%', height: 56, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 16 },
  buttonDisabled: { backgroundColor: '#cccccc' },
  buttonPro: { backgroundColor: Colors.accentPRO },
  buttonTextPro: { fontFamily: 'Roboto_500Medium', color: Colors.textLight, fontSize: 16 },
  errorText: { color: Colors.error, textAlign: 'center', marginBottom: 16, fontFamily: 'Roboto_400Regular' },
});

export default ManualProFormScreen;
