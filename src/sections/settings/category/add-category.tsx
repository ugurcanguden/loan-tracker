import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { BaseView, BaseText, CoreInput, CoreButton } from '@guden-components';
import { PaymentCategoryService } from '../../../services/payment-category.service';
import { useThemeContext } from '@guden-theme';

interface AddCategoryFormInputs {
  categoryName: string;
  iconName: string;
}

const AddCategoryScreen: React.FC = () => {
  const { theme } = useThemeContext();
  const { control, handleSubmit, reset } = useForm<AddCategoryFormInputs>({
    defaultValues: {
      categoryName: '',
      iconName: '',
    },
  });

  const handleSaveCategory: SubmitHandler<AddCategoryFormInputs> = async (data) => {
    const { categoryName, iconName } = data;

    if (!categoryName || !iconName) {
      console.log('Kategori adı ve ikon adı gerekli');
      return;
    }

    try {
      const categoryService = PaymentCategoryService();
      await categoryService.addCategory(categoryName, iconName);
      console.log('Kategori başarıyla eklendi');
      reset(); // Formu sıfırla
    } catch (error) {
      console.error('Kategori eklenirken hata:', error);
    }
  };

  return (
    <BaseView padding="medium" style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <BaseText variant="title" weight="bold" style={{ marginBottom: 16 }}>
        Kategori Ekle
      </BaseText>

      <CoreInput
        name="categoryName"
        control={control}
        label="Kategori Adı"
        placeholder="Örn: Market"
        required
        minLength={2}
        maxLength={50}
        message="Kategori adı geçersiz"
        style={{ marginBottom: 16 }}
      />

      <CoreInput
        name="iconName"
        control={control}
        label="İkon Adı"
        placeholder="Örn: cart"
        required
        minLength={2}
        maxLength={50}
        message="İkon adı geçersiz"
        style={{ marginBottom: 16 }}
      />

      <CoreButton label="Kaydet" onPress={handleSubmit(handleSaveCategory)} />
    </BaseView>
  );
};

export default AddCategoryScreen;