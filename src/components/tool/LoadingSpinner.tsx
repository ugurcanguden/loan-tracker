import React from 'react';
import { ActivityIndicator, Modal, StyleSheet, View } from 'react-native';
import { useThemeContext } from "@guden-theme";
import { useLoading } from '../../contexts/LoadingContext';

export const LoadingSpinner: React.FC = () => {
  const { theme } = useThemeContext();
  const { isLoading } = useLoading();

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={isLoading}
      onRequestClose={() => {}}
      statusBarTranslucent
    >
      <View style={[
        styles.container,
        { backgroundColor: `${theme.colors.background}80` }
      ]}>
        <View style={[
          styles.spinnerContainer,
          { backgroundColor: theme.colors.card }
        ]}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    elevation: 9999,
  },
  spinnerContainer: {
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  }
});