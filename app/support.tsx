import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  LayoutAnimation, Platform, UIManager, Linking
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { useAuth } from '../hooks/useAuth';
import Colors from '../constants/Colors';
import CustomAlertModal from '../components/CustomAlertModal';

const FAQ_DATA = [
  {
    title: 'Acerca de la aplicación',
    subtitle: 'Conoce el propósito, la audiencia y la legalidad de la app.',
    questions: [
      { q: '¿Qué es "Manuales de Contrataciones Públicas"?', a: 'Es una aplicación especializada diseñada para que funcionarios públicos y profesionales del área puedan elaborar, de forma rápida y segura, manuales de contrataciones públicas adaptados a la normativa vigente en Venezuela.' },
      { q: '¿Para quién es esta aplicación?', a: 'La aplicación está diseñada específicamente para los actores involucrados en los procesos de contratación del sector público, tales como el Máximo Jerarca de la institución, los miembros de la Comisión de Contrataciones, y el personal de las unidades contratantes y usuarias.' },
      { q: '¿El manual que genero está 100% actualizado con la última ley?', a: 'Sí. Nuestro equipo de expertos legales actualiza constantemente las plantillas y la lógica de la aplicación para asegurar que todos los manuales generados estén en conformidad con la legislación y normativas más recientes.' },
    ]
  },
  {
    title: 'Manual Express y Manual PRO',
    subtitle: 'Entiende las diferencias y los tipos de pago de nuestras versiones.',
    questions: [
      { q: '¿Cuál es la diferencia entre el Manual Express y el Manual PRO?', a: 'El Manual Express es una versión gratuita que te permite generar una demostración de un manual, limitada a concurso abierto para suministro de bienes. El Manual PRO es la versión completa y de pago, que incluye todas las modalidades de contratación.' },
      { q: '¿El pago del Manual PRO es una suscripción o un pago único?', a: 'Es un pago único. Con cada pago adquieres el derecho a generar un manual completo y personalizado para tu institución.' },
    ]
  },
  {
        title: 'Comprar y activar la versión PRO',
        subtitle: 'Resuelve tus dudas sobre el proceso de pago y activación.',
        questions: [
            { q: '¿Cómo puedo comprar la versión PRO?', a: 'Dentro de la app, presiona el botón "Elaborar" en la opción "Manual PRO". Aparecerá una ventana con un enlace para contactar directamente a un asesor de ventas de Universitas a través de WhatsApp, quien te guiará en el proceso de pago; también puedes hacerlo desde el chat de soporte técnico.' },
            { q: '¿Qué métodos de pago aceptan?', a: 'Nuestro asesor de ventas te indicará a través de WhatsApp las formas de pago disponibles al momento de tu compra.' },
            { q: 'Ya realicé el pago, ¿ahora qué hago?', a: 'Una vez que nuestro asesor confirme la recepción de tu pago, activará manually la versión PRO en tu cuenta. No necesitas introducir ningún código. Recibirás una confirmación y podrás proceder a elaborar tu manual completo.' },
        ]
    },
    {
        title: 'Uso y entrega del Manual',
        subtitle: 'Información sobre el formato, envío y correcciones del documento.',
        questions: [
            { q: '¿En qué formato recibiré el manual?', a: 'Recibirás un enlace a tu manual en formato de Google Docs en el correo electrónico con el que te registraste. Este formato te permite personalizarlo y editarlo fácilmente.' },
            { q: '¿Puedo enviar el manual a otro correo electrónico?', a: 'Sí. Durante el proceso de elaboración del manual PRO, tendrás la opción de indicar una dirección de correo electrónico adicional para que también reciba una copia del documento.' },
            { q: 'Cometí un error al introducir los datos para mi manual PRO. ¿Puedo corregirlo y generarlo de nuevo?', a: 'El pago del plan PRO te da derecho a una (1) generación del manual. Es muy importante que revises cuidadosamente toda la información antes de presionar el botón "Elaborar". Si cometes un error, la generación de un nuevo manual requeriría un nuevo pago.' },
            { q: 'Generé mi manual pero no lo encuentro en mi correo, ¿qué hago?', a: 'Primero, por favor revisa tu carpeta de correo no deseado o "Spam". Si después de unos minutos sigues sin encontrarlo, contacta a nuestro equipo a través del botón "Soporte" en la app y con gusto te lo reenviaremos.' },
            { q: '¿Soy el dueño del manual que genero? ¿Puedo revenderlo?', a: 'Al generar un manual, adquieres una licencia de uso para ese documento específico, para fines internos y exclusivos de tu institución. La propiedad intelectual de la plantilla y su contenido legal base pertenece a Universitas Services. Por lo tanto, no está permitida la reventa ni la redistribución del manual a terceros.' },
        ]
    },
    {
        title: 'Asistente IA',
        subtitle: 'Descubre qué es, quién puede usarlo y sus limitaciones.',
        questions: [
            { q: '¿Qué es el asistente IA?', a: 'El Asistente IA es una herramienta de inteligencia artificial experta en contrataciones públicas. Puedes hacerle preguntas en lenguaje natural sobre la ley, procedimientos y normativas, y te proporcionará respuestas y orientación al instante.' },
            { q: '¿Quién puede usar el Asistente IA?', a: 'El Asistente IA es una funcionalidad exclusiva para nuestros usuarios con el plan PRO activo.' },
            { q: '¿Las respuestas del Asistente IA constituyen asesoría legal formal?', a: 'No. El Asistente IA es una herramienta de orientación e información de gran alcance, pero sus respuestas no constituyen asesoría legal formal ni reemplazan el consejo de un abogado o consultor profesional. Para casos específicos, te recomendamos utilizar nuestro servicio de Asesoría personalizada.' },
        ]
    },
    {
        title: 'Seguridad y privacidad',
        subtitle: 'Cómo protegemos y utilizamos tus datos de forma segura.',
        questions: [
            { q: '¿Mis datos personales y los de mi institución están seguros?', a: 'Absolutamente. En Universitas Services, la seguridad de tu información es nuestra máxima prioridad. Utilizamos medidas de seguridad estándar de la industria, como la encriptación, para proteger tanto tus datos personales como la información institucional que nos proporcionas.' },
            { q: '¿Qué hacen con la información que introduzco para generar el manual?', a: 'La información que proporcionas en el cuestionario se utiliza única y exclusivamente para generar tu manual personalizado. No compartimos, vendemos ni utilizamos los datos específicos de tu institución para ningún otro propósito.' },
            { q: '¿Las conversaciones con el asistente IA son privadas?', a: 'Sí, tus conversaciones son confidenciales. Sin embargo, para mejorar continuamente la precisión y utilidad de nuestro asistente, las conversaciones (de forma anónima y disociada de tu identidad personal) pueden ser revisadas y utilizadas para entrenar el modelo de inteligencia artificial.' },
            { q: '¿Cómo puedo eliminar mi cuenta y mis datos?', a: 'Puedes solicitar la eliminación de tu cuenta y los datos asociados contactando a nuestro equipo de soporte. El proceso se completará de acuerdo con los plazos establecidos en nuestra Política de Privacidad.' },
        ]
    },
    {
        title: 'Otros servicios y políticas',
        subtitle: 'Detalles sobre repositorios, asesorías, cursos y reembolsos.',
        questions: [
            { q: '¿El repositorio legal tiene algún costo?', a: 'No. El acceso al repositorio legal y a los enlaces que contiene es completamente gratuito para todos los usuarios registrados en la aplicación.' },
            { q: '¿Cómo funcionan las Asesorías personalizadas?', a: 'Al seleccionar "Agendar" en la opción "Asesoría", serás redirigido a un enlace de Calendly donde podrás ver la disponibilidad y reservar una cita. Este servicio requiere un pago previo que se realiza durante el proceso de agendamiento.' },
            { q: 'Compré una asesoría pero no puedo asistir, ¿puedo cancelarla?', a: 'En principio no se realizan devoluciones por cancelación de asesorías. Sin embargo, ofrecemos la posibilidad de reprogramar tu cita si nos contactas con antelación. Si un usuario no asiste a su cita sin previo aviso, no habrá posibilidad de reprogramación ni reembolso, ya que el tiempo del asesor fue reservado exclusivamente para atenderle.' },
            { q: '¿Tienen una política de reembolso para el Manual PRO?', a: 'Dado que el Manual PRO es un producto digital que se genera y se entrega de forma inmediata, no se ofrecen reembolsos una vez realizado el pago. Si el manual contiene errores debido a la información que introdujiste, estos no son motivo de reembolso. Si tienes problemas para recibir el archivo, nuestro equipo de soporte te ayudará a obtenerlo.' },
            { q: '¿Los cursos que aparecen en "Formación" son gratuitos?', a: 'La sección de "Formación" contiene tanto cursos gratuitos como cursos de pago. Al hacer clic en un curso, serás dirigido a nuestra plataforma educativa universitas.academy, la cual tiene sus propios términos, condiciones y políticas.' },
        ]
    },
];

const SupportScreen = () => {
  const { user } = useAuth();
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const toggleSection = (title: string) => {
    setOpenSection(openSection === title ? null : title);
  };

  const handlePersonalizedSupportPress = () => {
    if (user?.Rol === 'Usuario Gratis') {
      setModalVisible(true);
    } else {
      const url = 'https://api.whatsapp.com/send?phone=+584145051716&text=Hola%20%F0%9F%91%8B%20necesito%20ayuda%20con%20la%20APP%20del%20Manual%20de%20Contrataciones%20P%C3%BAblicas';
      Linking.openURL(url);
    }
  };
  
  const handleAcquirePro = () => {
    const url = 'https://api.whatsapp.com/send?phone=+584145051716&text=Hola%20%F0%9F%91%8B%20Quiero%20adquirir%20la%20versi%C3%B3n%20PRO%20del%20Manual%20de%20Contrataciones%20P%C3%BAblicas';
    Linking.openURL(url);
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Tarjeta de Soporte Personalizado */}
        <TouchableOpacity style={styles.card} onPress={handlePersonalizedSupportPress} activeOpacity={0.7}>
          <View style={styles.cardContent}>
            <FontAwesome5 name="whatsapp" size={24} color={Colors.whatsapp} style={styles.icon} />
            <Text style={styles.cardTitle}>Soporte técnico personalizado</Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color={Colors.textSecondary} />
        </TouchableOpacity>
{/*"\n"*/}
        {/* Acordeón de FAQ */}
        {FAQ_DATA.map((section) => {
          const isExpanded = openSection === section.title;
          return (
            // Usamos Animatable.View como contenedor de la tarjeta
            <Animatable.View 
              key={section.title} 
              style={[styles.card, isExpanded && styles.cardExpanded]}
              transition="borderColor" // Animamos el cambio de color del borde
            >
              <TouchableOpacity style={styles.accordionHeader} onPress={() => toggleSection(section.title)} activeOpacity={0.7}>
                               
                    {/* ESTRUCTURA PARA MOSTRAR TÍTULO Y SUBTÍTULO */}
                    <View style={styles.cardTextContainer}>
                        <Text style={styles.cardTitle}>{section.title}</Text>                        
                        <Text style={styles.cardSubtitle}>{section.subtitle}</Text>                        
                    </View>
                  <Ionicons name={isExpanded ? "chevron-down" : "chevron-forward"} size={22} color={Colors.textSecondary} />
                
              </TouchableOpacity>
              
              {/* contenido expandible también se anima */}
              {isExpanded && (
                <Animatable.View 
                  animation="fadeIn" // Animación de entrada
                  duration={400}
                >
                  <View style={styles.faqContainer}>
                    {section.questions.map((item, index) => (
                      <View key={index} style={styles.faqItem}>
                        <Text style={styles.faqQuestion}>{item.q}</Text>
                        <Text style={styles.faqAnswer}>{item.a}</Text>
                      </View>
                    ))}
                  </View>
                </Animatable.View>
              )}
            </Animatable.View>
          );
        })}
      </ScrollView>
      

      <CustomAlertModal
        visible={modalVisible}
        title="Función PRO"
        message="El soporte técnico personalizado es exclusivo para usuarios PRO. ¡Actualiza tu plan para recibir ayuda de nuestros expertos!"
        confirmText="Adquirir Pro"
        cancelText="Volver"
        onConfirm={handleAcquirePro}
        onCancel={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  accordionHeader: {
  flexDirection: 'row',
  alignItems: 'center', // permite que el ícono se alinee arriba si subtítulo es más largo
  minHeight: 64,
  justifyContent: 'space-between',
},
  container: {
    padding: 16,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  icon: {
    marginRight: 0,
  },
  cardExpanded: {
    borderColor: Colors.primary,
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTextContainer: {
    flex: 1,
    marginRight: 10,
    
  },
  cardTitle: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
    color: Colors.text,
    marginLeft: 12,
  },
  cardSubtitle: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 13,
    color: Colors.textSecondary,
    marginLeft: 12,
    marginTop: 2,
  },
  faqContainer: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 8,
  },
  faqItem: {
    paddingVertical: 8,
    backgroundColor: Colors.accentExpress,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  faqQuestion: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 15,
    color: Colors.text,
    marginBottom: 4,
  },
  faqAnswer: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});

export default SupportScreen;