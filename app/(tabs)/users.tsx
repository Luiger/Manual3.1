import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Switch, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { UserService } from '../../services/user.service';
import Colors from '../../constants/Colors';

// --- Componente para cada ítem de la lista de usuarios ---
const UserItem = ({ user, onRoleChange }) => {
  const getInitials = (nombre, apellido) => `${nombre ? nombre[0] : ''}${apellido ? apellido[0] : ''}`.toUpperCase();
  const isPago = user.Rol === 'Usuario Pago';

  return (
    <View style={styles.itemContainer}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{getInitials(user.Nombre, user.Apellido)}</Text>
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{user.Nombre} {user.Apellido}</Text>
        <Text style={styles.userEmail}>{user.Usuario}</Text>
      </View>
      <Switch
        trackColor={{ false: '#E5E7EB', true: Colors.primary }}
        thumbColor={isPago ? Colors.accentPRO : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={() => onRoleChange(user.Usuario, isPago ? 'Usuario Gratis' : 'Usuario Pago')}
        value={isPago}
      />
    </View>
  );
};

// --- Pantalla Principal de Usuarios ---
const UsersScreen = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filter, setFilter] = useState('Todos'); // Opciones: Todos, Gratis, Pago
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    const response = await UserService.getAllUsers();
    if (response.success && response.data) {
      setUsers(response.data);
      // Aplicamos el filtro actual a los nuevos datos
      applyFilter(filter, response.data);
    }
    setLoading(false);
  };
  
  // useFocusEffect recarga los datos cada vez que la pantalla obtiene el foco
  useFocusEffect(
    useCallback(() => {
      fetchUsers();
    }, [])
  );

  const applyFilter = (newFilter, userList) => {
    setFilter(newFilter);
    if (newFilter === 'Todos') setFilteredUsers(userList);
    else if (newFilter === 'Gratis') setFilteredUsers(userList.filter(u => u.Rol === 'Usuario Gratis'));
    else if (newFilter === 'Pago') setFilteredUsers(userList.filter(u => u.Rol === 'Usuario Pago'));
  };

  const handleRoleChange = async (email, newRole) => {
    // Actualizamos el estado localmente para una respuesta visual instantánea
    const updatedUsers = users.map(u => u.Usuario === email ? { ...u, Rol: newRole } : u);
    setUsers(updatedUsers);
    applyFilter(filter, updatedUsers);

    // Enviamos la petición al backend
    await UserService.updateUserRole(email, newRole);
    // Opcional: podrías volver a llamar a fetchUsers() para re-sincronizar,
    // pero la actualización local suele ser suficiente para una buena UX.
  };

  if (loading) {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
            <ActivityIndicator size="large" color={Colors.primary} />
        </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.title}>Usuarios</Text>
      <View style={styles.filterContainer}>
        {['Todos', 'Gratis', 'Pago'].map(f => (
          <TouchableOpacity 
            key={f} 
            onPress={() => applyFilter(f, users)} 
            style={[styles.filterButton, filter === f && styles.filterButtonActive]}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.Usuario}
        renderItem={({ item }) => <UserItem user={item} onRoleChange={handleRoleChange} />}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      />
    </SafeAreaView>
  );
};

// --- ESTILOS PARA LA PANTALLA DE USUARIOS ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  title: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 24,
    color: Colors.text,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    textAlign: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    margin: 16,
    padding: 4,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
  },
  filterButtonActive: {
    backgroundColor: Colors.background,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  filterText: {
    fontFamily: 'Roboto_400Regular',
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  filterTextActive: {
    fontFamily: 'Roboto_500Medium',
    color: Colors.text,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontFamily: 'Roboto_500Medium',
    color: Colors.textLight,
    fontSize: 18,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
    color: Colors.text,
  },
  userEmail: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 14,
    color: Colors.textSecondary,
  },
});

export default UsersScreen;