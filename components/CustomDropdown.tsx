import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';

interface DropdownProps {
  placeholder?: string;
  options: { label: string; value: string }[];
  value: string | null;
  onSelect: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const CustomDropdown: React.FC<DropdownProps> = ({
  placeholder,
  options,
  value,
  onSelect,
  open,
  setOpen,
}) => {
  const handleSelect = (optionValue: string) => {
    onSelect(optionValue);
    setOpen(false);
  };

  const selectedLabel = options.find(opt => opt.value === value)?.label || placeholder;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setOpen(!open)}
        style={styles.selectBtn}
      >
        <Text style={styles.selectedText}>
          {selectedLabel}
        </Text>
        <Ionicons name={open ? "chevron-up" : "chevron-down"} color={Colors.textSecondary} size={20} />
      </TouchableOpacity>
      {open && (
        <View style={styles.optionsContainer}>
          {options.map((option, index) => (
            <TouchableWithoutFeedback
              key={index}
              onPress={() => handleSelect(option.value)}
            >
              <View
                style={[
                  styles.option,
                  {
                    backgroundColor:
                      option.value === value
                        ? Colors.primary
                        : '#FFF',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.optionText,
                    {
                      color:
                        option.value === value
                          ? '#FFF'
                          : Colors.text,
                    },
                  ]}
                >
                  {option.label}
                </Text>
              </View>
            </TouchableWithoutFeedback>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'relative',
  },
  selectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedText: {
    fontSize: 16,
    color: Colors.text,
    fontFamily: 'Roboto_400Regular',
  },
  optionsContainer: {
    position: 'absolute',
    top: '100%',
    marginTop: 4, 
    width: '100%',
    borderColor: Colors.border,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: '#FFF',
    zIndex: 1000, 
  },
  option: {
    padding: 16,
  },
  optionText: {
    fontSize: 16,
    fontFamily: 'Roboto_400Regular',
  },
});

export default CustomDropdown;
