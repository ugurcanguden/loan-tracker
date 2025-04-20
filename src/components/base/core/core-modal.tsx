import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Dimensions,
  Pressable,
} from 'react-native';
import { useThemeContext } from '@guden-theme';

type ModalSize = 'small' | 'medium' | 'large';

interface CoreModalProps {
  visible: boolean;
  onClose: () => void;
  size?: ModalSize;
  children: React.ReactNode;
  dismissable?: boolean;
}

export const CoreModal: React.FC<CoreModalProps> = ({
  visible,
  onClose,
  size = 'medium',
  children,
  dismissable = true,
}) => {
  const { theme } = useThemeContext();

  const getSizeStyle = () => {
    const { width } = Dimensions.get('window');
    switch (size) {
      case 'small':
        return { width: width * 0.7 };
      case 'large':
        return { width: width * 0.95 };
      default:
        return { width: width * 0.85 };
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}    
    >
      <TouchableWithoutFeedback onPress={dismissable ? onClose : undefined}>
      <View style={[styles.overlay, { backgroundColor: theme.overlay || 'rgba(0,0,0,0.5)' }]}>
        <Pressable style={[styles.modalContainer, getSizeStyle(), { backgroundColor: theme.card }]}>
        <View style={{ alignItems: 'flex-end' }}>
          <Pressable onPress={onClose} style={{ padding: 10 }}>
          <View style={{ width: 20, height: 20, backgroundColor: theme.primary, borderRadius: 10, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ width: 12, height: 2, backgroundColor: theme.text, transform: [{ rotate: '45deg' }] }} />
            <View style={{ width: 12, height: 2, backgroundColor: theme.text, transform: [{ rotate: '-45deg' }] }} />
          </View>
          </Pressable>
        </View>
        {children}
        </Pressable>
      </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    borderRadius: 12,
    padding: 20,
    maxHeight: '90%',
    elevation: 5,
  },
});
