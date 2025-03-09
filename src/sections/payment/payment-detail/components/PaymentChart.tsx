import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, Dimensions } from 'react-native';
import { BaseView, BaseText, BaseScrollView } from '@guden-components';
import { LineChart } from 'react-native-chart-kit';
import { PaymentDetail } from '@guden-models';

interface ChartDataPoint {
  index: number;
  value: number;
}

interface PaymentChartProps {
  paymentDetails: PaymentDetail[];
  chartData: any;
  theme: any;
  getTranslation: (key: string) => string;
}

export const PaymentChart: React.FC<PaymentChartProps> = ({
  paymentDetails,
  chartData,
  theme,
  getTranslation,
}) => {
  const [isChartReady, setIsChartReady] = useState(false);

  useEffect(() => {
    if (paymentDetails.length > 0 && chartData) {
      setIsChartReady(true);
    }
  }, [paymentDetails, chartData]);

  return (
    <BaseView
      variant="card"
      backgroundColor={theme.colors.card}
      padding="medium"
      borderRadius={10}
      style={{ marginBottom: 15 }}
    >
      <BaseText
        variant="subtitle"
        weight="bold"
        style={{ marginBottom: 10, color: theme.colors.text }}
      >
        {getTranslation("payment.payment-chart")}
      </BaseText>
      <BaseScrollView
        horizontal
        showsHorizontalScrollIndicator={true}
        style={{ marginVertical: 8 }}
      >
        {!isChartReady ? (
          <View
            style={{
              width: Dimensions.get("window").width - 60,
              height: 220,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : (
          <LineChart
            data={chartData}
            width={Math.max(
              Dimensions.get("window").width - 60,
              paymentDetails.length * 50
            )}
            height={220}
            chartConfig={{
              backgroundColor: theme.colors.background,
              backgroundGradientFrom: theme.colors.background,
              backgroundGradientTo: theme.colors.background,
              decimalPlaces: 0,
              color: (opacity = 1) => theme.colors.primary,
              labelColor: (opacity = 1) => theme.colors.text,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: theme.colors.primary,
                color: theme.colors.background,
              },
            }}
            bezier
            style={{ marginVertical: 8, borderRadius: 16 }}
            fromZero
            withDots
            getDotColor={(dataPoint, index) => {
              const installment = paymentDetails[index];
              return installment?.isPaid
                ? "#4BB543"
                : `rgba(${theme.colors.primary}, 1)`;
            }}
            onDataPointClick={() => {}}
            renderDotContent={() => null}
          />
        )}
      </BaseScrollView>
    </BaseView>
  );
}; 