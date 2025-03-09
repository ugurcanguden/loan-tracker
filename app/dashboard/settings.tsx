import React, { useState } from 'react';
import { BaseButton, BaseView, BaseModal, BaseText } from '@guden-components';
import { resetDatabase } from '../../src/services/db';

export const SettingsScreen = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const reset = async () => {
    await resetDatabase();
    setIsModalVisible(false); // Modalı kapat
  };

  return (
    <BaseView style={{ padding: 16 }}>
      <BaseButton onPress={() => setIsModalVisible(true)}>Reset Database</BaseButton>

      <BaseModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        size="medium"
        title="Confirm Reset"
      >
        <BaseView style={{ padding: 16 }}>
          <BaseText variant="body">
            Are you sure you want to reset the database? This action cannot be undone.
          </BaseText>
          <BaseView style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16 }}>
            <BaseButton onPress={() => setIsModalVisible(false)} style={{ marginRight: 8 }}>
              Cancel
            </BaseButton>
            <BaseButton onPress={reset} variant="outline">
              Confirm
            </BaseButton>
          </BaseView>
        </BaseView>
      </BaseModal>
    </BaseView>
  );
};
