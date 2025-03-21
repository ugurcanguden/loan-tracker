import { useThemeContext } from "@guden-theme";
import { useForm } from "react-hook-form";
import { Button, View } from "react-native";
import { CoreDateInput, CoreText, CoreInput, CoreMoneyInput, CoreSelect, CoreButton, CoreToggle } from "@guden-components";
import { useNotification } from "@guden-hooks";


export const HomeScreen = () => {
  const { theme } = useThemeContext();

  const { control, handleSubmit } = useForm({
    defaultValues: {
      customerName: '',
      amount: '',
      autoPay: true
    },
  });
    const { notify } = useNotification();
  const onSubmit = (data: any) => {
    console.log('Form Gönderildi:', data);


      notify({
        type: 'success',
        message: 'Kayıt başarıyla tamamlandı!',
      });
      notify({
        type: 'error',
        message: 'Kayıt başarıyla tamamlanamadı dı! Hatalar var ',
      });
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background, padding: 20 }}>
      <CoreText variant="title">Gelir / Gider Ekle</CoreText>
      <CoreInput
        name="customerName"
        control={control}
        placeholder="Müşteri adı girin"
        required
        minLength={3}
        message="Müşteri adı hatalı"
        label="Müşteri Adı"
      />
      <CoreText variant="label">Tutar</CoreText>
      <CoreInput
        name="amount"
        control={control}
        placeholder="Tutar girin"
        keyboardType="numeric"
        required
        min={1}
        max={100000}
        message="Tutar hatalı"
      />
      <CoreDateInput
        name="dueDate"
        control={control}
        label="Son Ödeme Tarihi"
        required
        message="Tarih zorunludur"
      />
      <CoreMoneyInput
        name="amount"
        control={control}
        label="Tutar"
        required
        min={1}
        message="Tutar geçersiz"
      />
      <CoreSelect
        name="category"
        control={control}
        label="Kategori"
        required
        options={[
          { label: 'Gelir', value: 'income' },
          { label: 'Gider', value: 'expense' },
          { label: 'Gelir', value: 'income' },
          { label: 'Gider', value: 'expense' },
          { label: 'Gelir', value: 'income' },
          { label: 'Gider', value: 'expense' }
        ]}
        placeholder="Bir kategori seçin"
      />
      <CoreToggle 
        name="autoPay"
        control={control}
        label="Otomatik ödeme"
        required={false}
        message="Bu alan zorunlu"
      />
      <CoreButton
        label="Kaydet"
        onPress={handleSubmit(onSubmit)}
        variant="secondary"
        loading={false}
        fullWidth
      />

    </View>
  );
}; 
