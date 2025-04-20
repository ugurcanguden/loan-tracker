import React from 'react';
import { BaseView, BaseText, BaseTouchable, CoreCard } from '@guden-components';
import { useThemeContext } from '@guden-theme';
import { Ionicons } from '@expo/vector-icons';
import { Href, Link, LinkProps, router, useNavigation } from 'expo-router';

export const SettingsScreen: React.FC = () => {
  const { theme } = useThemeContext();
  const navigation = useNavigation();

  const handleProfilePress = () => {
    console.log('Profil bilgileri');
    // Profil bilgilerini düzenleme ekranına yönlendirme
  };

  const handleAddCategoryPress = () => {
    console.log('Kategori ekleme');
    // navigation.navigate('/settings/category/add-category' as any);
  };

  const handleOtherSettingsPress = () => {
    console.log('Diğer ayarlar');
    // Diğer ayarlar ekranına yönlendirme
  };
  const linkProps : LinkProps = {
    href: '/settings/category/add-category' as any, 
    relativeToDirectory: false,
    withAnchor: false,
    download: '',
    asChild: false,
  };
 
  return (
    <BaseView padding="medium" style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <BaseText variant="title" weight="bold" style={{ marginBottom: 16 }}>
        Ayarlar
      </BaseText>

      {/* Profil Bilgileri */}
      <CoreCard padding="medium" style={{ marginBottom: 16 }}>
        <BaseTouchable onPress={handleProfilePress} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="person-circle-outline" size={24} color={theme.colors.primary} />
          <BaseText variant="body" style={{ marginLeft: 16 }}>
            Profil Bilgileri
          </BaseText>
        </BaseTouchable>
      </CoreCard>

      {/* Kategori Ekleme */}
      <CoreCard padding="medium" style={{ marginBottom: 16 }}>
      <Link {...linkProps}>About</Link>
        <BaseTouchable onPress={handleAddCategoryPress} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="add-circle-outline" size={24} color={theme.colors.primary} />
          <BaseText variant="body" style={{ marginLeft: 16 }}>
            Kategori Ekle
          </BaseText>
        </BaseTouchable>
      </CoreCard>

      {/* Diğer Ayarlar */}
      <CoreCard padding="medium">
        <BaseTouchable onPress={handleOtherSettingsPress} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="settings-outline" size={24} color={theme.colors.primary} />
          <BaseText variant="body" style={{ marginLeft: 16 }}>
            Diğer Ayarlar
          </BaseText>
        </BaseTouchable>
      </CoreCard>
    </BaseView>
  );
};