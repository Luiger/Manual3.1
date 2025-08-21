import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';
import Colors from '../../constants/Colors';
import CustomAlertModal from '../../components/CustomAlertModal'; // Importar el componente de alerta

const MenuItem = ({ onPress, iconName, text, isLast = false }) => (
  <TouchableOpacity style={[styles.menuItem, isLast && { borderBottomWidth: 0 }]} onPress={onPress}>
    <View style={styles.menuItemContent}>
      <Feather name={iconName} size={22} color={Colors.textSecondary} />
      <Text style={styles.menuItemText}>{text}</Text>
    </View>
    <Ionicons name="chevron-forward" size={22} color={Colors.textSecondary} />
  </TouchableOpacity>
);

export default function ProfileMenuScreen() {
    const router = useRouter();
    const { user, logout } = useAuth();
    const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false); // Estado para controlar la visibilidad del modal

    const getInitials = () => {
        if (user?.Nombre && user?.Apellido) {
            return `${user.Nombre[0]}${user.Apellido[0]}`.toUpperCase();
        }
        return 'US';
    };

    const handleLogout = async () => {
        await logout();
        if (router.canGoBack()) {
            router.dismissAll();
        }
        router.replace('/(auth)/login');
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* 1. El Header ahora es un componente estático en el flujo normal del layout */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={28} color={Colors.text} />
                </TouchableOpacity>
            </View>

            {/* 2. Un nuevo contenedor principal que usa flexbox para posicionar el footer */}
            <View style={styles.container}>
                {/* Contenido superior (Avatar, nombre y opciones) */}
                <View>
                    <View style={styles.userInfoSection}>
                        <View style={styles.avatar}><Text style={styles.avatarText}>{getInitials()}</Text></View>
                        <Text style={styles.userName}>{user ? `${user.Nombre} ${user.Apellido}` : 'Usuario'}</Text>
                        <Text style={styles.userAccountType}>Cuenta Personal</Text>
                    </View>
                    <View style={styles.menuSection}>
                        <MenuItem 
                            onPress={() => router.push('/(profile)/edit')} 
                            iconName="edit-3" 
                            text="Editar Perfil" 
                        />
                        <MenuItem 
                            onPress={() => router.push('/(profile)/change-password')} 
                            iconName="key" 
                            text="Cambiar Contraseña"
                        />
                        <MenuItem 
                            onPress={() => router.push('/(profile)/about')} 
                            iconName="info" 
                            text="Acerca de la App"
                            //isLast={true}
                        />
                    </View>
                </View>

                {/* Contenido inferior (Botón de logout) */}
                <TouchableOpacity style={styles.logoutButton} onPress={() => setIsLogoutModalVisible(true)}>
                    <Ionicons name="log-out-outline" size={22} color={Colors.accentPRO} />
                    <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
                </TouchableOpacity>
            </View>

            {/* Popup for Logout Confirmation */}
            {isLogoutModalVisible && <View style={styles.overlay} />}
            <CustomAlertModal
                visible={isLogoutModalVisible}
                title="Cerrar Sesión"
                message="¿Estás seguro de que deseas cerrar sesión?"
                confirmText="Sí"
                cancelText="No"
                onConfirm={() => {
                    setIsLogoutModalVisible(false); // Oculta el modal
                    handleLogout(); // Procede con el logout
                }}
                onCancel={() => setIsLogoutModalVisible(false)} // Simplemente oculta el modal
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  // 3. El Header ya no tiene 'position: absolute'
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  backButton: {
    padding: 8,
    alignSelf: 'flex-start',
  },
  // 4. El contenedor principal ahora gestiona el layout vertical
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 16, // Pequeño padding para que no quede pegado al borde
    justifyContent: 'space-between',
  },
  userInfoSection: {
    alignItems: 'center',
    paddingTop: 16, // Espacio reducido
  },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: 'center', alignItems: 'center', marginBottom: 16
  },
  avatarText: { fontFamily: 'Roboto_700Bold', color: Colors.textLight, fontSize: 32 },
  userName: { fontFamily: 'Roboto_700Bold', fontSize: 22, color: Colors.text },
  userAccountType: { fontFamily: 'Roboto_400Regular', fontSize: 16, color: Colors.textSecondary, marginTop: 4 },
  menuSection: {
    marginTop: 32,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  menuItemContent: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  menuItemText: { fontFamily: 'Roboto_400Regular', fontSize: 16, color: Colors.text },
  logoutButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 16, gap: 8, alignSelf: 'center'
  },
  logoutButtonText: {
    fontFamily: 'Roboto_500Medium',
    color: Colors.accentPRO,
    fontSize: 16
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    zIndex: 1, // Asegura que esté por encima del contenido pero debajo del modal
  },
});
