import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Dimensions, ScrollView } from 'react-native';
import { AmountDisplay, BaseText } from '@guden-components';
import { BasePage } from '@guden-hooks';
import { Payment, PaymentDetail } from '@guden-models';
import { PaymentService } from '@guden-services';
import { useThemeContext } from '@guden-theme';
import { DateFormat, isNullOrUndefined } from 'guden-core';
import { BarChart, LineChart } from 'react-native-chart-kit';

interface PaymentDetailPageProps {
    payment: Payment;
}

export const PaymentDetailPage = ({ payment }: PaymentDetailPageProps) => {
    const { getTranslation, convertDate } = BasePage();
    const { getPaymentDetails } = PaymentService();
    const [paymentDetails, setPaymentDetails] = useState<PaymentDetail[]>([]);
    const { theme } = useThemeContext();

    useEffect(() => {
        if ((payment?.id ?? 0) > 0) {
            getPaymentDetails(payment.id!).then((data: PaymentDetail[]) => {
                if (!isNullOrUndefined(data)) {
                    setPaymentDetails(data);
                }
            });
        }
    }, [payment]);

    const chartData = {
        labels: paymentDetails.length > 0 ? ["Start", ...paymentDetails.map(detail => convertDate(detail.dueDate, DateFormat.MMDDYYYYS))] : ["No Data"],
        datasets: [
            {
                data: paymentDetails.length > 0 ? [0, ...paymentDetails.map(detail => detail.amount)] : [0],
                color: (opacity = 1) => `rgba(${theme.colors.primary}, ${opacity})`,
                strokeWidth: 2
            }
        ]
    };
    

    return (
        <View style={[styles.card, { backgroundColor: theme.colors.card ,height: Dimensions.get('window').height * 0.70}]}  >
            <View style={styles.cardHeader}>
                <BaseText text={`${getTranslation("payment.name")}: ${payment.name}`} style={[styles.paymentName, { color: theme.colors.text }]} />
                <AmountDisplay   amount={payment.amount} currency="TL" />
            </View>
            <BaseText text={`${getTranslation("payment.startDate")}: ${convertDate(payment.startDate)}`} style={[styles.date, { color: theme.colors.text }]} />
            {payment.isRecurring === 1 && (
                <BaseText
                    text={`🔄 ${payment.installments} ${getTranslation("payment.months")}`}
                />
            )}

            <ScrollView horizontal showsHorizontalScrollIndicator={true} style={styles.chartScroll}>
                <LineChart
                    data={chartData}
                    width={Dimensions.get('window').width * 5} // Ekran genişliğinin %500'si
                    height={Dimensions.get('window').height * 0.5} // Ekran yüksekliğinin %50'si
                    yAxisLabel="₺"
                    yAxisInterval={1} // Daha düzenli gösterim sağlar
                    yAxisSuffix="₺"
                    chartConfig={{
                        backgroundColor: theme.colors.background,
                        backgroundGradientFrom: theme.colors.background,
                        backgroundGradientTo: theme.colors.background,
                        decimalPlaces: 2,
                        color: (opacity = 1) => `rgba(${theme.colors.primary}, ${opacity})`,
                        labelColor: (opacity = 1) => theme.colors.text,
                        style: { borderRadius: 16 },
                        propsForDots: {
                            r: "6",
                            strokeWidth: "2",
                            stroke: theme.colors.primary
                        }
                    }} 
                    style={{ marginVertical: 8, borderRadius: 16 }}
                />
            </ScrollView>


        </View>
    );
};

const styles = StyleSheet.create({
    chartScroll: {
        marginTop: 10,
    },
    container: {
        padding: 20,
        borderRadius: 10,
        backgroundColor: 'white',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    detail: {
        fontSize: 16,
        marginBottom: 5,
    },
    listContainer: {
        paddingHorizontal: 10,
        paddingBottom: 30,
    },
    card: {
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        position: 'relative',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    paymentName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    amount: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    date: {
        marginTop: 5,
        fontSize: 14,
    },
    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 8,
        marginTop: 10,
    },
    deleteText: {
        color: 'white',
        marginLeft: 8,
    },
    addButton: {
        position: 'absolute',
        right: 10,
        top: 10,
        padding: 5,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '90%',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
});

export default PaymentDetail;