import React, { useEffect, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from 'react-native';
import { useThemeContext } from '@guden-theme'; 
import { NotificationType, useNotificationContext } from '@guden-context';

const screenWidth = Dimensions.get('window').width;

export const CoreNotification: React.FC = () => {
  const { notification } = useNotificationContext();
  const { theme } = useThemeContext();

  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (notification) {
      // Giriş animasyonu
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Çıkış animasyonu
      const hide = setTimeout(() => {
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: 50, // aşağı kayma
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      }, notification.duration || 3000);

      return () => clearTimeout(hide);
    }
  }, [notification]);

  const getBackgroundColor = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return theme.success;
      case 'error':
        return theme.error;
      case 'info':
        return theme.info;
      case 'warning':
        return theme.warning;
      default:
        return theme.card;
    }
  };

  if (!notification) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: getBackgroundColor(notification.type),
          opacity,
          transform: [{ translateY }],
          borderColor: theme.border,
        },
      ]}
    >
      <Text style={[styles.text, { color: theme.text }]}>
        {notification.message}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '40%',
    left: screenWidth * 0.1,
    width: screenWidth * 0.8,
    padding: 14,
    borderRadius: 10,
    zIndex: 9999,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
    alignItems: 'center',
  },
  text: {
    fontSize: 14,
    textAlign: 'center',
  },
});
