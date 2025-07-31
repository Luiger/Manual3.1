// app/privacy.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Colors from '../constants/Colors';

const PrivacyScreen = () => {
  const router = useRouter();
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);

  const handleScroll = ({ nativeEvent }) => {
    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
    const isAtBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
    if (isAtBottom && !isButtonEnabled) {
      setIsButtonEnabled(true);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Política de Privacidad</Text>
      </View>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.contentContainer}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <View style={styles.updateDateContainer}>
            <Text style={[styles.bold]}>Última actualización:</Text>
            <Text style={styles.updateDate}> Julio de 2025</Text>
        </View>
        <Text style={styles.paragraph}>
          Su privacidad es de suma importancia para nosotros.
        </Text>
        <Text style={styles.paragraph}>
          Esta Política de privacidad describe cómo <Text style={styles.bold}>Universitas Services C.A.</Text> ("<Text style={styles.bold}>nosotros</Text>", "<Text style={styles.bold}>nos</Text>" o "<Text style={styles.bold}>Universitas</Text>") recopila, utiliza, protege y comparte su información cuando utiliza nuestra aplicación móvil <Text style={styles.bold}>"Manuales de Contrataciones Públicas"</Text> (la "<Text style={styles.bold}>Aplicación</Text>").
        </Text>
        <Text style={styles.paragraph}>
          Al utilizar la Aplicación, usted acepta la recopilación y el uso de información de acuerdo con esta política.
        </Text>
        
        <Text style={styles.sectionTitle}>1. Información que recopilamos</Text>
        <Text style={styles.paragraph}>
          Para proporcionarle y mejorar nuestros servicios, recopilamos diferentes tipos de información:
          {"\n\n"}
          <Text style={styles.bold}>a. Datos de creación de cuenta:</Text> Cuando se registra en nuestra Aplicación, le solicitamos que nos proporcione cierta información de identificación personal, que incluye:
          {"\n"}• Nombre y Apellido
          {"\n"}• Dirección de correo electrónico
          {"\n"}• Número de teléfono
          {"\n"}• Nombre de la Institución a la que pertenece
          {"\n"}• Cargo que ocupa
          {"\n\n"}
          <Text style={styles.bold}>b. Datos para la generación de Manuales:</Text> Para generar su manual de contrataciones, recopilamos información específica de la institución, que incluye:
          {"\n"}• Nombre completo de la institución, ente u órgano.
          {"\n"}• Acrónimo y/o siglas de la institución.
          {"\n"}• Nombres de las unidades responsables (gestión administrativa, sistemas, unidad contratante, etc.).
          {"\n"}• Opcionalmente, una dirección de correo electrónico adicional para el envío del manual generado.
          {"\n\n"}
          <Text style={styles.bold}>c. Datos de comunicación:</Text> Si se pone en contacto con nuestro equipo de soporte o con nuestros asesores de ventas a través de WhatsApp o cualquier otro medio, podemos recopilar y almacenar un registro de esa comunicación.
          {"\n\n"}
          <Text style={styles.bold}>d. Datos del asistente IA:</Text> Para los usuarios del plan PRO, almacenamos las conversaciones mantenidas con nuestro Asistente IA.
        </Text>

        <Text style={styles.sectionTitle}>2. Cómo utilizamos su información</Text>
        <Text style={styles.paragraph}>
          Utilizamos la información recopilada para diversos fines:{"\n"}
          • <Text style={styles.bold}>Para proporcionar y mantener nuestro Servicio:</Text> Gestionar su cuenta, generar los manuales Express y PRO, y permitir el acceso a todas las funcionalidades de la Aplicación.{"\n"}
          • <Text style={styles.bold}>Para comunicarnos con usted:</Text> Enviarle el manual generado, responder a sus solicitudes de soporte, notificarle sobre cambios en nuestros servicios y gestionar el proceso de venta del plan PRO.{"\n"}
          • <Text style={styles.bold}>Para mejorar nuestro Servicio:</Text> Utilizamos las conversaciones con el Asistente IA, de forma anónima y disociada de su identidad, para entrenar y mejorar la precisión de nuestro modelo de inteligencia artificial. También analizamos el uso general de la Aplicación para identificar áreas de mejora.{"\n"}
          • <Text style={styles.bold}>Para procesar transacciones:</Text> La información de contacto se utiliza para facilitar la comunicación con nuestros asesores de ventas para la gestión de pagos de los servicios PRO y de Asesoría.
        </Text>

        <Text style={styles.sectionTitle}>3. Con quién compartimos su información</Text>
        <Text style={styles.paragraph}>
          No vendemos ni alquilamos su información personal a terceros. Solo compartimos su información en las siguientes circunstancias:{"\n\n"}
          • <Text style={styles.bold}>Con proveedores de servicios de terceros:</Text> Utilizamos servicios de terceros para facilitar nuestra Aplicación. Estos proveedores solo tienen acceso a su información para realizar tareas específicas en nuestro nombre y están obligados a no divulgarla ni utilizarla para ningún otro propósito. Estos incluyen: Google (Google Docs), WhatsApp, y Calendly.{"\n"}
          • <Text style={styles.bold}>Con asesores de Universitas:</Text> Su información de contacto es compartida con nuestro equipo de ventas para gestionar la compra de los servicios de pago.{"\n"}
          • <Text style={styles.bold}>Por requerimientos legales:</Text> Podemos divulgar su información si así lo exige la ley o en respuesta a solicitudes válidas de las autoridades públicas.
        </Text>

        <Text style={styles.sectionTitle}>4. Seguridad de su información</Text>
        <Text style={styles.paragraph}>
          La seguridad de sus datos es una prioridad. Implementamos medidas de seguridad administrativas, técnicas y físicas para proteger su información personal contra el acceso, uso o divulgación no autorizados. Sin embargo, ningún método de transmisión por Internet o de almacenamiento electrónico es 100% seguro.
        </Text>

        <Text style={styles.sectionTitle}>5. Retención de datos</Text>
        <Text style={styles.paragraph}>
          Conservaremos su información personal solo durante el tiempo que sea necesario para los fines establecidos en esta Política de Privacidad, principalmente mientras su cuenta permanezca activa. Conservaremos y utilizaremos su información en la medida necesaria para cumplir con nuestras obligaciones legales, resolver disputas y hacer cumplir nuestros acuerdos.
        </Text>

        <Text style={styles.sectionTitle}>6. Sus derechos de privacidad</Text>
        <Text style={styles.paragraph}>
          Usted tiene derecho a acceder, rectificar, cancelar u oponerse al tratamiento de su información personal. Para ejercer estos derechos, puede ponerse en contacto con nuestro equipo de soporte. Atenderemos su solicitud de acuerdo con la legislación aplicable.
        </Text>
        
        <Text style={styles.sectionTitle}>7. Privacidad de menores</Text>
        <Text style={styles.paragraph}>
          Nuestro Servicio no está dirigido a ninguna persona menor de 18 años. No recopilamos conscientemente información de identificación personal de menores de 18 años.
        </Text>

        <Text style={styles.sectionTitle}>8. Cambios en esta política de privacidad</Text>
        <Text style={styles.paragraph}>
          Podemos actualizar nuestra Política de privacidad periódicamente. Le notificaremos cualquier cambio publicando la nueva Política de Privacidad en esta página y actualizando la fecha de "Última actualización".
        </Text>

        <Text style={styles.sectionTitle}>9. Contacto</Text>
        <Text style={styles.paragraph}>
          Si tiene alguna pregunta sobre esta Política de privacidad, puede contactarnos a través de la sección "Soporte" dentro de la Aplicación.
        </Text>
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, !isButtonEnabled && styles.buttonDisabled]}
          disabled={!isButtonEnabled}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>Acepto</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// Se usan los mismos estilos que en la pantalla de Términos y Condiciones
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.surface },
  header: {
    padding: 16,
    paddingTop: 20,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 20,
    color: Colors.text,
  },
  scrollView: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    padding: 24,
  },
  updateDateContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  updateDate: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 16,
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  paragraph: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: 12,
  },
  bold: {
    fontFamily: 'Roboto_700Bold',
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.background,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    fontFamily: 'Roboto_500Medium',
    color: Colors.textLight,
    fontSize: 16,
  },
});

export default PrivacyScreen;