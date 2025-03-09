import React from 'react';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BaseView, BaseText, BaseTouchable, AmountDisplay } from '@guden-components';
import { PaymentDetail } from '@guden-models';

interface InstallmentItemProps {
  item: PaymentDetail;
  index: number;
  theme: any;
  getTranslation: (key: string) => string;
  convertDate: (date: string) => string;
  onMarkAsPaid: (id: number) => void;
  onUnmarkAsPaid: (id: number) => void;
}

export const InstallmentItem: React.FC<InstallmentItemProps> = ({
  item,
  index,
  theme,
  getTranslation,
  convertDate,
  onMarkAsPaid,
  onUnmarkAsPaid,
}) => {
  return (
    <BaseView
      variant="card"
      backgroundColor={theme.colors.background}
      borderColor={theme.colors.border}
      borderWidth={1}
      borderRadius={10}
      padding="medium"
      style={{
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
      }}
    >
      {/* Üst Kısım - Taksit No ve Tarih */}
      <BaseView
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
          paddingBottom: 12,
          borderBottomWidth: 1,
          borderBottomColor: `${theme.colors.border}40`,
        }}
      >
        <BaseView style={{ flexDirection: "row", alignItems: "center" }}>
          <BaseView
            style={{
              backgroundColor: item.isPaid
                ? "#4BB54320"
                : `${theme.colors.primary}20`,
              width: 32,
              height: 32,
              borderRadius: 16,
              justifyContent: "center",
              alignItems: "center",
              marginRight: 10,
            }}
          >
            <BaseText
              weight="bold"
              style={{
                color: item.isPaid ? "#4BB543" : theme.colors.primary,
                fontSize: 14,
              }}
            >
              {index + 1}
            </BaseText>
          </BaseView>
          <BaseText style={{ color: theme.colors.text, fontSize: 16 }}>
            {getTranslation("payment.installment")}
          </BaseText>
        </BaseView>
        <BaseText
          style={{
            color: theme.colors.text,
            fontSize: 14,
            opacity: 0.8,
          }}
        >
          {convertDate(item.dueDate)}
        </BaseText>
      </BaseView>

      {/* Alt Kısım - Tutar ve Butonlar */}
      <BaseView
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <BaseView>
          <AmountDisplay amount={item.amount} currency="TL" />
          {item.isPaid && item.paidDate && (
            <BaseView
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 4,
              }}
            >
              <MaterialCommunityIcons
                name="check-circle"
                size={16}
                color="#4BB543"
                style={{ marginRight: 4 }}
              />
              <BaseText style={{ fontSize: 12, color: "#4BB543" }}>
                {`${getTranslation("payment.paid-on")}: ${convertDate(
                  item.paidDate
                )}`}
              </BaseText>
            </BaseView>
          )}
        </BaseView>

        {item.isPaid ? (
          <BaseTouchable
            variant="default"
            backgroundColor={theme.colors.background}
            size="small"
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 1,
              borderColor: theme.colors.border,
            }}
            onPress={() => onUnmarkAsPaid(item.id!)}
          >
            <MaterialCommunityIcons
              name="undo-variant"
              size={20}
              color={theme.colors.text}
            />
          </BaseTouchable>
        ) : (
          <BaseTouchable
            variant="primary"
            size="small"
            style={{
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 8,
              flexDirection: "row",
              alignItems: "center",
            }}
            onPress={() => onMarkAsPaid(item.id!)}
          >
            <MaterialCommunityIcons
              name="check"
              size={20}
              color="white"
              style={{ marginRight: 6 }}
            />
            <BaseText style={{ color: "white", fontWeight: "500" }}>
              {getTranslation("payment.mark-as-paid")}
            </BaseText>
          </BaseTouchable>
        )}
      </BaseView>
    </BaseView>
  );
}; 