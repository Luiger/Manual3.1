// app/terms.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Colors from '../constants/Colors';

const TermsScreen = () => {
  const router = useRouter();
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);

  const handleScroll = ({ nativeEvent }) => {
    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
    const isAtBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20; // 20px buffer
    if (isAtBottom && !isButtonEnabled) {
      setIsButtonEnabled(true);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Términos y Condiciones de Uso</Text>
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
          Bienvenido a <Text style={styles.bold}>Manuales de Contrataciones Públicas</Text>. Le agradecemos por utilizar nuestra plataforma.
        </Text>
        <Text style={styles.paragraph}>
          Estos términos y condiciones ("<Text style={styles.bold}>Términos</Text>") rigen el uso de la aplicación móvil "Manuales de Contrataciones Públicas" (en adelante, la "<Text style={styles.bold}>Aplicación</Text>" o el "<Text style={styles.bold}>Servicio</Text>"), operada por <Text style={styles.bold}>Universitas Services C.A.</Text> (en adelante, "<Text style={styles.bold}>nosotros</Text>", "<Text style={styles.bold}>nos</Text>" o "<Text style={styles.bold}>Universitas</Text>").
        </Text>
        <Text style={styles.paragraph}>
          Al registrarse, acceder o utilizar nuestra Aplicación, usted (en adelante, el "<Text style={styles.bold}>Usuario</Text>") acepta haber leído, entendido y estar de acuerdo con quedar vinculado por estos Términos.
        </Text>
        <Text style={styles.paragraph}>
          Si no está de acuerdo con alguna parte de los términos, no está autorizado para utilizar el Servicio.
        </Text>
        
        <Text style={styles.sectionTitle}>1. Descripción de los servicios</Text>
        <Text style={styles.paragraph}>
          La Aplicación es una plataforma digital que ofrece un conjunto de herramientas y servicios para profesionales del área de contrataciones públicas en Venezuela, que incluyen:{"\n"}
          • <Text style={styles.bold}>Manual Express:</Text> Un servicio gratuito que permite generar una versión de demostración de un manual de contrataciones con funcionalidades limitadas.{"\n"}
          • <Text style={styles.bold}>Manual PRO:</Text> Un servicio de pago único que permite la generación de un manual de contrataciones completo y exhaustivo.{"\n"}
          • <Text style={styles.bold}>Repositorio Legal:</Text> Acceso a una colección de enlaces a contenido jurídico y bibliotecas legales propiedad de Universitas.{"\n"}
          • <Text style={styles.bold}>Asesoría:</Text> Un servicio de pago para agendar consultas personalizadas con expertos en la materia.{"\n"}
          • <Text style={styles.bold}>Formación:</Text> Acceso a un catálogo de cursos virtuales, tanto gratuitos como de pago, alojados en una plataforma externa.{"\n"}
          • <Text style={styles.bold}>Asistente IA:</Text> Una herramienta de inteligencia artificial, exclusiva para usuarios PRO, que ofrece orientación sobre contrataciones públicas.
        </Text>

        <Text style={styles.sectionTitle}>2. Cuentas de usuario</Text>
        <Text style={styles.paragraph}>
          Para acceder a los Servicios, el Usuario debe crear una cuenta proporcionando información veraz, completa y actualizada, incluyendo nombre, apellido, correo electrónico, teléfono, institución y cargo. El Usuario es el único responsable de la actividad que ocurra en su cuenta y de mantener la confidencialidad de su contraseña. El Usuario se compromete a notificar a Universitas de inmediato sobre cualquier violación de seguridad o uso no autorizado de su cuenta.
        </Text>

        <Text style={styles.sectionTitle}>3. Condiciones de compra y pago</Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>a. Manual PRO:</Text> La adquisición del Manual PRO se realiza mediante un pago único. El proceso de compra se inicia en la Aplicación y se finaliza a través de una comunicación directa con un asesor de ventas de Universitas por medio de la plataforma de mensajería WhatsApp. El asesor proporcionará los detalles del pago. El acceso a las funcionalidades PRO se activará manualmente una vez que el pago sea verificado.{"\n\n"}
          <Text style={styles.bold}>b. Asesorías:</Text> Las asesorías son un servicio de pago que se agenda a través de la plataforma de terceros "Calendly". El pago debe realizarse de forma previa, según las instrucciones proporcionadas durante el proceso de agendamiento.{"\n\n"}
          <Text style={styles.bold}>c. Cursos de formación:</Text> Los cursos de pago se rigen por los términos, condiciones y políticas de la plataforma externa https://universitas.academy/
        </Text>

        <Text style={styles.sectionTitle}>4. Política de reembolsos</Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>a. Manual PRO:</Text> Debido a la naturaleza digital del producto y su entrega inmediata, no se realizarán reembolsos por la compra del Manual PRO bajo ninguna circunstancia. Es responsabilidad del Usuario verificar la exactitud de la información proporcionada antes de generar el manual.{"\n\n"}
          <Text style={styles.bold}>b. Asesorías:</Text> No se realizarán reembolsos por la cancelación de asesorías o por la inasistencia del Usuario a la cita agendada. Se ofrecerá la posibilidad de reprogramar la cita siempre que se notifique con una antelación razonable.
        </Text>

        <Text style={styles.sectionTitle}>5. Propiedad intelectual</Text>
        <Text style={styles.paragraph}>
          La Aplicación, su contenido original, características, funcionalidades, plantillas de manuales, textos legales y la estructura de los documentos son y seguirán siendo propiedad exclusiva de Universitas Services C.A. Al adquirir el Manual PRO, Universitas otorga al Usuario una licencia limitada, personal, no exclusiva e intransferible para usar, modificar y adaptar el documento generado para los fines internos y exclusivos de la institución que representa. Queda estrictamente prohibido revender, redistribuir, sublicenciar, compartir o utilizar con fines comerciales tanto la plantilla como el manual generado.
        </Text>

        <Text style={styles.sectionTitle}>6. Uso del asistente IA</Text>
        <Text style={styles.paragraph}>
          El Asistente IA es una herramienta de orientación exclusiva para usuarios PRO. Sus respuestas se basan en un modelo de inteligencia artificial entrenado en la materia y no constituyen asesoría legal formal. Las conversaciones con el Asistente IA podrán ser revisadas de forma anónima para fines de entrenamiento y mejora del servicio.
        </Text>

        <Text style={styles.sectionTitle}>7. Enlaces y servicios de terceros</Text>
        <Text style={styles.paragraph}>
          Nuestra Aplicación puede contener enlaces a sitios web o servicios de terceros que no son propiedad ni están controlados por Universitas (incluyendo, pero no limitado a, WhatsApp, Calendly, Google Docs y universitas.academy). Universitas no tiene control ni asume responsabilidad alguna por el contenido, las políticas de privacidad o las prácticas de los sitios web o servicios de terceros. El Usuario reconoce y acepta que Universitas no será responsable, directa o indirectamente, por ningún daño o pérdida causada o presuntamente causada por o en conexión con el uso o la confianza en dicho contenido o servicios.
        </Text>

        <Text style={styles.sectionTitle}>8. Limitación de responsabilidad y exclusión de garantías</Text>
        <Text style={styles.paragraph}>
          El Servicio se proporciona "TAL CUAL" y "SEGÚN DISPONIBILIDAD". Universitas no garantiza que el servicio será ininterrumpido, seguro o libre de errores. Universitas no se hace responsable de los errores, omisiones o inexactitudes en el manual final que se deriven de la información incorrecta o incompleta proporcionada por el Usuario. La Aplicación es una herramienta de asistencia y no reemplaza el juicio profesional ni la asesoría legal de un abogado.
        </Text>
        
        <Text style={styles.sectionTitle}>9. Terminación</Text>
        <Text style={styles.paragraph}>
          Podemos suspender o cancelar la cuenta de un Usuario de inmediato, sin previo aviso ni responsabilidad, por cualquier motivo, incluido, entre otros, el incumplimiento de estos Términos. El Usuario puede cancelar su cuenta contactando al equipo de soporte.
        </Text>

        <Text style={styles.sectionTitle}>10. Modificaciones a los términos</Text>
        <Text style={styles.paragraph}>
          Nos reservamos el derecho, a nuestra entera discreción, de modificar o reemplazar estos Términos en cualquier momento. Notificaremos a los usuarios sobre cualquier cambio sustancial. El uso continuado de la Aplicación después de que dichas revisiones entren en vigor constituye la aceptación de los nuevos términos.
        </Text>

        <Text style={styles.sectionTitle}>11. Legislación aplicable</Text>
        <Text style={styles.paragraph}>
          Estos Términos se regirán e interpretarán de acuerdo con las leyes de la República Bolivariana de Venezuela, sin tener en cuenta sus disposiciones sobre conflictos de leyes.
        </Text>

        <Text style={styles.sectionTitle}>12. Contacto</Text>
        <Text style={styles.paragraph}>
          Si tiene alguna pregunta sobre estos Términos, puede contactarnos a través de la sección "Soporte" dentro de la Aplicación.
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

export default TermsScreen;