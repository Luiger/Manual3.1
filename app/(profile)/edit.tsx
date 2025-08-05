import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { UserService } from '../../services/user.service';
import Colors from '../../constants/Colors';
import CustomAlertModal from '../../components/CustomAlertModal';

const EditProfileScreen = () => {
  const router = useRouter();
  const { user, refreshUser  } = useAuth(); // Usamos 'token' para asegurar que el usuario esté cargado

  const [formData, setFormData] = useState({
    Nombre: '',
    Apellido: '',
    Telefono: '',
    Institucion: '',
    Cargo: ''
  });
  const [loading, setLoading] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ visible: false, title: '', message: '', onConfirm: () => {} });

  useEffect(() => {
    // Pre-rellenamos el formulario con los datos del usuario del contexto
    if (user) {
      setFormData({
        Nombre: user.Nombre,
        Apellido: user.Apellido,
        Telefono: user.Telefono || '',
        Institucion: user.Institucion || '',
        Cargo: user.Cargo || '',
      });
    }
  }, [user]);

  const handleInputChange = (name: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    setLoading(true);
    try {
      const result = await UserService.updateProfile(formData);
      if (result.success) {
        // ✅ 4. Refresca los datos del usuario en toda la app
        await refreshUser();
        // Muestra la alerta personalizada de éxito
        setAlertConfig({
            visible: true,
            title: 'Éxito',
            message: 'Tu perfil ha sido actualizado.',
            onConfirm: () => router.back(),
        });
      } else {
        // Muestra la alerta personalizada de error
        setAlertConfig({
            visible: true,
            title: 'Error',
            message: result.error || 'No se pudo actualizar el perfil.',
            onConfirm: () => setAlertConfig({ ...alertConfig, visible: false }),
        });
      }
    } catch (e) {
      setAlertConfig({
        visible: true,
        title: 'Error de Conexión',
        message: 'Ocurrió un error al conectar con el servidor.',
        onConfirm: () => setAlertConfig({ ...alertConfig, visible: false }),
      });
    } finally {
      setLoading(false);
    }
  };

  // Muestra una carga si los datos del usuario aún no están disponibles
  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 65}
      >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre</Text>
            <TextInput 
              style={styles.input} 
              value={formData.Nombre} 
              onChangeText={(val) => handleInputChange('Nombre', val)} />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Apellido</Text>
            <TextInput 
              style={styles.input} 
              value={formData.Apellido} 
              onChangeText={(val) => handleInputChange('Apellido', val)} />
            </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Teléfono</Text>
            <TextInput 
            style={styles.input} 
            value={formData.Telefono} 
            onChangeText={(val) => handleInputChange('Telefono', val)} 
            keyboardType="phone-pad" />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Institución</Text>
            <TextInput 
            style={styles.input} 
            value={formData.Institucion} 
            onChangeText={(val) => handleInputChange('Institucion', val)} />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Cargo</Text>
            <TextInput 
            style={styles.input} 
            value={formData.Cargo} 
            onChangeText={(val) => handleInputChange('Cargo', val)} />
          </View>
        </View>
        <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleSaveChanges} disabled={loading}>
          {loading ? (
            <ActivityIndicator color={Colors.textLight} />
          ) : (
            <Text style={styles.buttonText}>Guardar Cambios</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
      </KeyboardAvoidingView>

      <CustomAlertModal
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        confirmText="OK"
        onConfirm={alertConfig.onConfirm}
        onCancel={alertConfig.onConfirm}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  container: { padding: 24 },
  form: { width: '100%', gap: 20 },
  inputGroup: {},
  label: { fontFamily: 'Roboto_400Regular', fontSize: 14, color: Colors.textSecondary, marginBottom: 8 },
  input: {
    height: 56, backgroundColor: '#FFF', borderWidth: 1, borderColor: Colors.border,
    borderRadius: 8, paddingHorizontal: 16, fontSize: 16, fontFamily: 'Roboto_400Regular'
  },
  button: {
    width: '100%', backgroundColor: Colors.primary, height: 56, borderRadius: 8,
    justifyContent: 'center', alignItems: 'center', marginTop: 32
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
  },
  buttonText: { fontFamily: 'Roboto_500Medium', color: Colors.textLight, fontSize: 16 },
});

export default EditProfileScreen;