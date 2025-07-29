// components/CustomAlertModal.tsx

import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Colors from '../constants/Colors';

interface CustomAlertModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const CustomAlertModal: React.FC<CustomAlertModalProps> = ({
  visible,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalText}>{message}</Text>
          <View style={styles.buttonContainer}>
            {cancelText ? (
              <TouchableOpacity
                style={[styles.button, styles.buttonCancel]}
                onPress={onCancel}
              >
                <Text style={styles.textStyle}>{cancelText}</Text>
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity
              style={[
                styles.button,
                styles.buttonConfirm,
                // Si no hay botón de cancelar, el de confirmar ocupa todo el ancho
                !cancelText && { marginHorizontal: 0 },
              ]}
              onPress={onConfirm}
            >
              <Text style={styles.textStyle}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Estilos sin cambios
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '85%',
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 19,
    fontFamily: 'Roboto_700Bold',
  },
  modalText: {
    marginBottom: 25,
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Roboto_400Regular',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center', // Centra los botones
    width: '100%',
  },
  button: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    elevation: 2,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  buttonCancel: {
    backgroundColor: '#B0B0B0',
  },
  buttonConfirm: {
    backgroundColor: Colors.accentPRO,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 15,
  },
});

export default CustomAlertModal;