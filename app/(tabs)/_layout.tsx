import React from 'react';
import { Tabs, useRouter } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, FontAwesome6 } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../constants/Colors';
import { useAuth } from '../../hooks/useAuth';

// COMPONENTE DE BARRA DE PESTAÑAS PERSONALIZADO
const CustomTabBar = ({ state, descriptors, navigation }) => {
  const { user } = useAuth(); // Obtenemos el usuario (y su rol)

  // Filtramos las rutas que el usuario puede ver
  const visibleRoutes = state.routes.filter(route => {
    if (route.name === 'assistant' && user?.Rol === 'Usuario Gratis') return false;
    if (route.name === 'users' && user?.Rol !== 'Admin') return false;
    return true;
  });

  return (
    // SafeAreaView para respetar los bordes inferiores
    <SafeAreaView edges={['bottom']} style={{ backgroundColor: Colors.primary }}>
      <View style={styles.tabBarContainer}>
        {visibleRoutes.map((route) => {
          const { options } = descriptors[route.key];

          const isFocused = state.routes[state.index].name === route.name;

          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          // Define el ícono y el color según la pestaña y si está activa
          let IconComponent;
          let iconName;
          let tabStyle;
          let textColor;

          if (route.name === 'home') {
            IconComponent = Ionicons;
            iconName = isFocused ? 'home' : 'home';
            tabStyle = isFocused ? styles.tabLeft : styles.tabRight;
            textColor = isFocused ? Colors.primary : Colors.textLight;
          } 
          else if (route.name === 'assistant') {
            IconComponent = Ionicons;
            iconName = isFocused ? 'chatbubble-ellipses' : 'chatbubble-ellipses';
            tabStyle = isFocused ? styles.tabLeft : styles.tabRight;
            textColor = isFocused ? Colors.primary : Colors.textLight;
          }
          else if (route.name === 'users') {
            IconComponent = FontAwesome6;
            iconName = isFocused ? 'user-group' : 'user-group';
            tabStyle = isFocused ? styles.tabLeft : styles.tabRight;
            textColor = isFocused ? Colors.primary : Colors.textLight;
          }

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={[styles.tabButton, tabStyle]}
            >
              {IconComponent && <IconComponent name={iconName} size={24} color={textColor} />}

              <Text style={[styles.tabLabel, { color: textColor }]}>
                {options.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

// --- LAYOUT PRINCIPAL DE LAS PESTAÑAS ---
export default function TabsLayout() {
  return (
    // ✅ 2. USAMOS LA PROPIEDAD 'tabBar' PARA RENDERIZAR NUESTRO COMPONENTE PERSONALIZADO
    <Tabs
      screenOptions={{ 
        headerShown: false     
       }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen
        name="home"
        options={{ title: 'Inicio' }}
      />
      <Tabs.Screen
        name="assistant"
        options={{ title: 'Asistente IA' }}
      />
      <Tabs.Screen 
        name="users" 
        options={{ title: 'Usuarios' }} 
      />
    </Tabs>
  );
}

// ✅ 4. ESTILOS PARA LA BARRA DE PESTAÑAS PERSONALIZADA
const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    height: 60,    
    // Añadimos un borde superior con el color primario
    borderTopWidth: 1,
    borderTopColor: Colors.primary, 
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabLeft: {
    backgroundColor: Colors.background,
  },
  tabRight: {
    backgroundColor: Colors.primary,
  },
  tabLabel: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 12,
    marginTop: 4,
  },
});