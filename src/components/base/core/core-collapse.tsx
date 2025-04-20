import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeContext } from '@guden-theme'; 
import { CoreText } from './core-text';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface CoreCollapseProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

const CoreCollapse: React.FC<CoreCollapseProps> = ({ title, children, defaultExpanded = false }) => {
  const { theme } = useThemeContext();
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  return (
    <View style={[styles.container, { borderColor: theme.colors.border }]}>
      <TouchableOpacity onPress={toggleExpand} style={styles.header}>
        <CoreText variant="subtitle" weight="bold" style={{ color: theme.colors.text }}>
          {title}
        </CoreText>
        <Ionicons
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={theme.colors.text}
        />
      </TouchableOpacity>
      {isExpanded && <View style={styles.content}>{children}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 8,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  content: {
    padding: 16,
  },
});

export default CoreCollapse;