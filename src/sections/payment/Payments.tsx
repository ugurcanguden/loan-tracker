import { useEffect, useState } from 'react';
import { FlatList, TouchableOpacity, View, StyleSheet, Alert, Modal } from 'react-native';
import { AmountDisplay, BaseScrollView, BaseText } from '@guden-components';
import { PaymentService } from '@guden-services';
import { Payment } from '@guden-models';
import { ConvertDateToString, DateFormat } from 'guden-core';
import { BasePage } from '@guden-hooks';
import { Ionicons } from '@expo/vector-icons';
import { useThemeContext } from '@guden-theme';
import PaymentForm from './PaymentForm'; 
import { PaymentDetailPage } from './PaymentDetail';

export default function Payments() {
    const { theme } = useThemeContext();
    const [payments, setPayments] = useState<Payment[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false); // 📌 Modal kontrolü
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null); // 📌 Seçilen ödeme
    const { getPayments, deletePayment } = PaymentService();
    const { getTranslation } = BasePage();

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        const data = await getPayments();
        console.log("data", data);
        setPayments(data);
    };

    const handleDelete = async (id: number) => {
        Alert.alert(
            getTranslation("common.deleteTitle"),
            getTranslation("common.deleteMessage"),
            [
                { text: getTranslation("common.cancel"), style: "cancel" },
                {
                    text: getTranslation("common.delete"),
                    style: "destructive",
                    onPress: async () => {
                        await deletePayment(id);
                        fetchPayments();
                    }
                }
            ]
        );
    };

    const handleAddPayment = () => {
        setSelectedPayment(null); // 📌 Seçili ödemeyi sıfırla
        setIsModalVisible(true); // 📌 Modal'ı aç
    };

    const handleSavePayment = () => {
        fetchPayments(); // 📌 Yeni ödeme eklenince listeyi güncelle
        setIsModalVisible(false); // 📌 Modal'ı kapat
    };

    const handlePaymentPress = (payment: Payment) => {
        setSelectedPayment(payment);
        setIsModalVisible(true);
    };

    const convertDate = (date: string) => {
        const dateFormat = new Date(date);
        return ConvertDateToString(dateFormat, DateFormat.DDMMYYYYP);
    };

    const renderItem = ({ item }: { item: Payment }) => (
        <TouchableOpacity onPress={() => handlePaymentPress(item)} style={[styles.card, { backgroundColor: theme.colors.card }]}>
            <View style={styles.cardHeader}>
                <BaseText text={`${getTranslation("payment.name")}: ${item.name}`} style={[styles.paymentName, { color: theme.colors.text }]} />
                <AmountDisplay amount={item.amount} />
            </View>
            <BaseText text={`${getTranslation("payment.startDate")}: ${convertDate(item.startDate)}`} style={[styles.date, { color: theme.colors.text }]} />
            {item.isRecurring === 1 && (
                <BaseText
                    text={`🔄 ${item.installments} ${getTranslation("payment.months")}`}
                />
            )}
            <TouchableOpacity onPress={() => handleDelete(item.id!)} style={[styles.deleteButton, { backgroundColor: theme.colors.notification }]}>
                <Ionicons name="trash-outline" size={20} color="white" />
                <BaseText text={getTranslation("common.delete")} style={styles.deleteText} />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    const baseScrollViewProps = {
        title: getTranslation("payment.title"),
        header: (
            <TouchableOpacity onPress={handleAddPayment} style={styles.addButton}>
                <Ionicons name="add-circle-outline" size={26} color={theme.colors.primary} />
            </TouchableOpacity>
        )
    };

    return (
        <BaseScrollView {...baseScrollViewProps}>
            <FlatList
                data={payments}
                keyExtractor={(item) => item.id!.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.listContainer}
            /> 
            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={[styles.modalContent, { backgroundColor: theme.colors.card }]}>
                        {selectedPayment ? (
                            <View>
                                <BaseText text={getTranslation("payment.detailTitle")} style={styles.modalTitle} />
                                <PaymentDetailPage payment={selectedPayment}/>
                            </View>
                        ) : (
                            <View>
                                <BaseText text={getTranslation("payment.addTitle")} style={styles.modalTitle} />
                                <PaymentForm onClosed={handleSavePayment} />
                            </View>
                        )}
                        <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.closeButton}>
                            <Ionicons name="close-circle-outline" size={30} color={theme.colors.primary} />
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </BaseScrollView>
    );
}

const styles = StyleSheet.create({
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