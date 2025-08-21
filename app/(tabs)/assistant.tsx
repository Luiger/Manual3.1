import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  FlatList, KeyboardAvoidingView, Platform, ActivityIndicator, Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
// Se reemplaza la importación de 'uuid' por 'react-native-uuid'
import uuid from 'react-native-uuid';
import { AIService } from '../../services/ai.service';
import Colors from '../../constants/Colors';

const AssistantScreen = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  
  // La función uuid.v4() de la nueva librería funciona igual
  const [sessionId] = useState(uuid.v4());

  useEffect(() => {
    setMessages([
      { id: uuid.v4(), text: '¡Hola! Soy tu asistente de contrataciones públicas. ¿En qué puedo ayudarte hoy?', sender: 'bot' }
    ]);
  }, []);
  
  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const handleSend = async () => {
    if (input.trim().length === 0 || loading) return;

    const userMessage = { id: uuid.v4(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    const response = await AIService.detectIntent(input, sessionId as string);
    
    const botMessage = {
      id: uuid.v4(),
      text: response.success ? response.reply : response.error,
      sender: 'bot'
    };
    setMessages(prev => [...prev, botMessage]);
    setLoading(false);
  };

  const renderMessage = ({ item }) => (
    <View style={[
      styles.messageContainer,
      item.sender === 'user' ? styles.userMessageContainer : styles.botMessageContainer
    ]}>
      <Text style={item.sender === 'user' ? styles.userMessageText : styles.botMessageText}>
        {item.text}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      >
        <View style={styles.header}>
        <Image source={require('../../assets/images/Julio AI.jpeg')} style={styles.headerLogo} resizeMode='contain' />
        <Text style={styles.headerTitle}>Julio AI</Text>
        </View>

        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.chatContainer}
        />
        {loading && <Text style={styles.typingIndicator}>Asistente está escribiendo...</Text>}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Escribe tu mensaje..."
            editable={!loading}
          />
          <TouchableOpacity onPress={handleSend} style={styles.sendButton} disabled={loading}>
            <Ionicons name="send" size={24} color={Colors.textLight} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  headerLogo: {
    width: 40, 
    height: 40, 
    borderRadius: 30
  },
  header: {
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 16,
    paddingVertical: 5, 
    backgroundColor: Colors.background,
    justifyContent: 'center'
  },
  headerTitle: {
    fontFamily: 'Roboto_700Bold', fontSize: 22, color: Colors.text,
    textAlign: 'center', padding: 16
  },
  chatContainer: {
    flexGrow: 1, paddingHorizontal: 16, paddingBottom: 16
  },
  messageContainer: {
    padding: 12, borderRadius: 18, maxWidth: '80%', marginBottom: 12
  },
  userMessageContainer: {
    backgroundColor: Colors.primary, alignSelf: 'flex-end'
  },
  botMessageContainer: {
    backgroundColor: '#FFF', alignSelf: 'flex-start',
    borderWidth: 1, borderColor: Colors.border
  },
  userMessageText: {
    fontFamily: 'Roboto_400Regular', fontSize: 16, color: Colors.textLight
  },
  botMessageText: {
    fontFamily: 'Roboto_400Regular', fontSize: 16, color: Colors.text
  },
  typingIndicator: {
    fontFamily: 'Roboto_400Regular', fontStyle: 'italic',
    color: Colors.textSecondary, paddingHorizontal: 16, paddingBottom: 8
  },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center', padding: 8,
    borderTopWidth: 1, borderTopColor: Colors.border,
    backgroundColor: Colors.background,
    paddingBottom: 3
  },
  input: {
    flex: 1, height: 48, backgroundColor: '#FFF',
    borderRadius: 24, paddingHorizontal: 16,
    borderWidth: 1, borderColor: Colors.border, fontSize: 16
  },
  sendButton: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: Colors.primary, justifyContent: 'center',
    alignItems: 'center', marginLeft: 8
  },
});

export default AssistantScreen;
