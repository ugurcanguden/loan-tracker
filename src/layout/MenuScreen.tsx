import { Ionicons } from '@expo/vector-icons';
import { BaseScrollView } from '@guden-components';
import { BasePage } from '@guden-hooks';
import { useThemeContext } from '@guden-theme';
import React, { useState } from 'react';
import { StyleSheet, Text, TextProps, TouchableOpacity, TouchableOpacityProps, View, ViewProps } from 'react-native'; 
import { MENU_PAGES } from '../constants/menuItems';
import { SettingsScreen } from '../../app/dashboard/settings';
import { ReportsScreen } from '../../app/dashboard/reports';

export default function MenuScreen() {
  const { theme } = useThemeContext();
  const { getTranslation } = BasePage();
  const [menuVisible, setMenuVisible] = useState(true);
  const [currentComponent, setCurrentComponent] = useState<string | null>(null);

  const renderComponent = () => {
    console.log(currentComponent);
    switch (currentComponent) {
      case 'Settings':
        return <SettingsScreen />;
      case 'Reports':
        return <ReportsScreen />;
      default:
        return (
          <Text style={[styles.placeholderText, { color: theme.colors.text }]}>
            Lütfen bir seçenek seçin.
          </Text>
        );
    }
  };

  const mainViewProps: ViewProps = {
    style: [styles.container, { backgroundColor: theme.colors.background }]
  };

  const touchableOpacityProps: TouchableOpacityProps = {
    style: styles.menuToggleButton,
    onPress: () => setMenuVisible(true)
  };

  const baseScrollViewProps = {
    header: <Text style={[styles.title, { color: theme.colors.text }]}>☰ Menü</Text>
  };

  const menuItemProps = (item: any) => ({
    key: item.key,
    onPress: () => {
      setCurrentComponent(item.componentName);
      setMenuVisible(false);
    },
    style: [styles.menuItem, { backgroundColor: theme.colors.card }]
  });

  const iconProps = (item: any) => ({
    name: item.icon as keyof typeof Ionicons.glyphMap,
    size: 28,
    color: theme.colors.primary,
    style: styles.icon
  });

  const menuTextProps = (item: any): TextProps => ({
    style: [styles.menuText, { color: theme.colors.text }],
    children: getTranslation(`${item.name}.title`)
  });

  const menuDescriptionProps = (item: any): TextProps => ({
    style: [styles.menuDescription, { color: theme.colors.text }],
    children: getTranslation(`${item.name}.description`)
  });

  return (
    <View {...mainViewProps}>
      {!menuVisible && (
        <TouchableOpacity {...touchableOpacityProps}>
          <Ionicons name="arrow-back-outline" size={28} color={theme.colors.primary} />
        </TouchableOpacity>
      )}
      {menuVisible ? (
        <BaseScrollView {...baseScrollViewProps}>
          <View style={styles.menuContainer}>
            {MENU_PAGES.map((item) => (
              <TouchableOpacity {...menuItemProps(item)}>
                <Ionicons {...iconProps(item)} />
                <View>
                  <Text {...menuTextProps(item)} />
                  <Text {...menuDescriptionProps(item)} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </BaseScrollView>
      ) : (
        <BaseScrollView>{renderComponent()}</BaseScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  menuToggleButton: {
    position: 'absolute',
    left: 10,
    top: 20,
    padding: 10,
    borderRadius: 50,
    elevation: 5,
    zIndex: 100,
  },
  menuContainer: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 10,
  },
  icon: {
    marginRight: 15,
  },
  menuText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  menuDescription: {
    fontSize: 12,
    opacity: 0.7,
  },
  contentContainer: {
    flex: 1,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});
