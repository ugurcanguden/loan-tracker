import {
  BaseAmountInput,
  BaseDateInput,
  BaseDatePicker,
  BaseText,
  BaseTextArea,
  BaseTextInput,
  BaseTouchable,
  BaseView,
} from "@guden-components";
import { BasePage } from "@guden-hooks";
import { Income } from "@guden-models";
import { IncomeService } from "@guden-services";
import { useThemeContext } from "@guden-theme";
import React, { useState } from "react";
import { Alert, StyleSheet } from "react-native";

export interface IncomeFormProps {
  onClosed: () => void;
}

export default function IncomeForm({ onClosed }: IncomeFormProps) {
  const { theme } = useThemeContext();
  const { addIncome } = IncomeService();
  const { getTranslation } = BasePage();

  // Form state
  const [name, setName] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [amountText, setAmountText] = useState("0");
  const [date, setDate] = useState(new Date());
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleAmountChange = (rawValue: string, formattedValue: string) => {
    setAmountText(rawValue);
    const cleanValue = rawValue.replace(/[^0-9,]/g, "").replace(",", ".");
    const newAmount = parseFloat(cleanValue) / 100 || 0;
    setAmount(newAmount);

    if (errors.amount) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.amount;
        return newErrors;
      });
    }
  };

  const handleNameChange = (value: string) => {
    setName(value);
    if (errors.name) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.name;
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = getTranslation("common.required");
    }
    if (amount <= 0) {
      newErrors.amount = getTranslation("common.invalidAmount");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSave = async () => {
    if (!validateForm()) {
      Alert.alert(
        getTranslation("common.error"),
        getTranslation("common.mandatoryFields")
      );
      return;
    }

    const income: Income = {
      name,
      amount,
      date: date.toISOString(),
      description,
    };

    try {
      await addIncome(income);
      Alert.alert(getTranslation("common.success"));
      onClosed();
    } catch (error) {
      console.error("Gelir kaydedilirken hata:", error);
      Alert.alert(
        getTranslation("common.error"),
        getTranslation("common.saveError")
      );
    }
  };

  return (
    <BaseView variant="card" padding="medium" style={styles.formContainer}>
      {/* Gelir Adı */}
      <BaseText variant="label">{getTranslation("income.name")}</BaseText>
      <BaseTextInput
        value={name}
        onChangeText={handleNameChange}
        placeholder={getTranslation("income.placeholderName")}
        error={!!errors.name}
      />
      {errors.name && <BaseText variant="error">{errors.name}</BaseText>}

      {/* Miktar */}
      <BaseText variant="label">{getTranslation("income.amount")}</BaseText>
      <BaseAmountInput
        value={amountText}
        onChangeText={handleAmountChange}
        placeholder={getTranslation("income.placeholderAmount")}
        error={!!errors.amount}
      />
      {errors.amount && <BaseText variant="error">{errors.amount}</BaseText>}

      {/* Tarih */}
      <BaseText variant="label">{getTranslation("income.date")}</BaseText> 
      <BaseDatePicker onChange={(data)=>setDate(new Date(data!))} value={date.toISOString()}></BaseDatePicker>


      {/* Açıklama */}
      <BaseText variant="label">
        {getTranslation("income.description")}
      </BaseText>
      <BaseTextArea
        value={description}
        onChangeText={setDescription}
        placeholder={getTranslation("income.placeholderDescription")}
        minHeight={100}
      />

      {/* Kaydet Butonu */}
      <BaseTouchable onPress={onSave} variant="primary" size="large">
        <BaseText variant="label">{getTranslation("common.save")}</BaseText>
      </BaseTouchable>
    </BaseView>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    marginBottom: 20,
  },
  saveButton: {
    marginTop: 20,
  },
});
