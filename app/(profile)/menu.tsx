import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons, Feather } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { useAuth } from '../../hooks/useAuth';
import Colors from '../../constants/Colors';
import CustomAlertModal from '../../components/CustomAlertModal';

const MenuItem = ({ onPress, iconName, text, isLast = false, variant = 'default' }) => {
  const isExternalLink = variant === 'external';
  const itemColor = isExternalLink ? Colors.accentPRO : Colors.text;
  const leftIconColor = isExternalLink ? Colors.accentPRO : Colors.textSecondary;
  const rightIconName = isExternalLink ? 'open-outline' : 'chevron-forward';

  return (
    <TouchableOpacity style={[styles.menuItem, isLast && { borderBottomWidth: 0 }]} onPress={onPress}>
      <View style={styles.menuItemContent}>
        <Feather name={iconName} size={22} color={leftIconColor} />
        <Text style={[styles.menuItemText, { color: itemColor }]}>{text}</Text>
      </View>
      <Ionicons name={rightIconName} size={22} color={itemColor} />
    </TouchableOpacity>
  );
};

export default function ProfileMenuScreen() {
    const router = useRouter();
    const { user, logout } = useAuth();
    const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
    // <-- 1. AÑADIMOS UN NUEVO ESTADO PARA EL MODAL DE ELIMINACIÓN
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

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

    const handleDeleteAccount = () => {
        const url = 'https://universitas.legal/eliminar-cuenta-app-mcp/';
        Linking.openURL(url).catch(err => 
            console.error("No se pudo abrir la página", err)
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={28} color={Colors.text} />
                </TouchableOpacity>
            </View>

            <View style={styles.container}>
                <View>
                    <View style={styles.userInfoSection}>
                        <View style={styles.avatar}><Text style={styles.avatarText}>{getInitials()}</Text></View>
                        <Text style={styles.userName}>{user ? `${user.Nombre} ${user.Apellido}` : 'Usuario'}</Text>
                        <Text style={styles.userAccountType}>Cuenta personal</Text>
                    </View>
                    <View style={styles.menuSection}>
                        <MenuItem 
                            onPress={() => router.push('/(profile)/edit')} 
                            iconName="edit-3" 
                            text="Editar perfil" 
                        />
                        <MenuItem 
                            onPress={() => router.push('/(profile)/change-password')} 
                            iconName="key" 
                            text="Cambiar contraseña"
                        />
                        <MenuItem 
                            onPress={() => router.push('/(profile)/about')} 
                            iconName="info" 
                            text="Acerca de la App"
                        />
                        <MenuItem
                            onPress={() => setIsDeleteModalVisible(true)} 
                            iconName="trash-2"
                            text="Eliminar cuenta"
                            variant="external"
                        />
                    </View>
                </View>

                <TouchableOpacity style={styles.logoutButton} onPress={() => setIsLogoutModalVisible(true)}>
                    <Ionicons name="log-out-outline" size={22} color={Colors.accentPRO} />
                    <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
                </TouchableOpacity>
            </View>

            {(isLogoutModalVisible || isDeleteModalVisible) && <View style={styles.overlay} />}

            {/* Modal para Cerrar Sesión */}
            <CustomAlertModal
                visible={isLogoutModalVisible}
                title="Cerrar Sesión"
                message="¿Estás seguro de que deseas cerrar sesión?"
                confirmText="Sí"
                cancelText="No"
                onConfirm={() => {
                    setIsLogoutModalVisible(false);
                    handleLogout();
                }}
                onCancel={() => setIsLogoutModalVisible(false)}
            />

            {/* Modal para Eliminar Cuenta*/}
            <CustomAlertModal
                visible={isDeleteModalVisible}
                title="Eliminar Cuenta"
                message="¿Estás seguro de que deseas eliminar tu cuenta?"
                confirmText="Sí"
                cancelText="No"
                onConfirm={() => {
                    setIsDeleteModalVisible(false);
                    handleDeleteAccount();
                }}
                onCancel={() => setIsDeleteModalVisible(false)}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  backButton: {
    padding: 8,
    alignSelf: 'flex-start',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 16,
    justifyContent: 'space-between',
  },
  userInfoSection: {
    alignItems: 'center',
    paddingTop: 16,
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
  menuItemText: { fontFamily: 'Roboto_400Regular', fontSize: 16 },
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
    zIndex: 1,
  },
});