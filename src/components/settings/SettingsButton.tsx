import { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Switch, ViewProps, TouchableOpacityProps, ModalProps, SwitchProps, TextProps } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from '@guden-theme';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsButton() {
    const { isDarkMode, setIsDarkMode, theme } = useThemeContext();
    const { t, i18n } = useTranslation();
    const [modalVisible, setModalVisible] = useState(false);

    const handleLanguageChange = (language: string) => {
        i18n.changeLanguage(language);
    };

    const viewProps: ViewProps = {};

    const touchableOpacityProps: TouchableOpacityProps = {
        style: styles.floatingButton,
        onPress: () => setModalVisible(true)
    };

    const modalProps: ModalProps = {
        animationType: "slide",
        transparent: true,
        visible: modalVisible,
        onRequestClose: () => setModalVisible(false)
    };

    const closeButtonProps: TouchableOpacityProps = {
        onPress: () => setModalVisible(false),
        style: styles.closeButton
    };

    const switchProps: SwitchProps = {
        value: isDarkMode,
        onValueChange: () => setIsDarkMode(!isDarkMode),
        thumbColor: isDarkMode ? theme.colors.primary : theme.colors.background,
        trackColor: { false: theme.colors.text, true: theme.colors.primary }
    };

    const languageTextProps = (language: string): TextProps => ({
        style: [styles.languageText, { color: theme.colors.text }],
        children: `${language === 'tr' ? '🇹🇷' : '🇬🇧'} ${i18n.language === language ? '✔️':''}`,
        onPress: () => handleLanguageChange(language)
    });

    return (
        <View {...viewProps}>
            <TouchableOpacity {...touchableOpacityProps}>
                <Text style={styles.buttonText}>⚙️</Text>
            </TouchableOpacity>

            <Modal {...modalProps}>
                <View style={styles.modalContainer}>
                    <View style={[styles.modalContent, { backgroundColor: theme.colors.background }]}>
                        <TouchableOpacity {...closeButtonProps}>
                            <Ionicons name="close" size={24} color={theme.colors.text} />
                        </TouchableOpacity>
                        <View style={styles.switchContainer}>
                            <Text style={styles.switchText}>☀️</Text>
                            <Switch {...switchProps} />
                            <Text style={styles.switchText}>🌙</Text>
                        </View>
                        <Text {...languageTextProps('tr')} />
                        <Text {...languageTextProps('en')} />
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    closeButton: {
        position: 'absolute',
        top: '10%',
        right: '10%',
        padding: '1%'
    },
    floatingButton: {
        position: 'absolute',
        bottom: 50,
        right: '10%',
        backgroundColor: '#6200ee',
        borderRadius: 30,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '50%',
        padding: '10%',
        borderRadius: '10%',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 24,
        color: '#fff',
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: '10%'
    },
    switchText: {
        marginRight: '10%',
    },
    languageText: {
        marginBottom: '10%',
    },
    closeText: {
        marginTop: '10%',
    },
});