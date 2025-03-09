import React from 'react';
import { Modal, StyleSheet, View, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { useThemeContext } from '../../../theme/themeContext';
import { Ionicons } from '@expo/vector-icons';
import { BaseTouchable } from './BaseTouchable';
import { BaseText } from './BaseText';
import { BaseView } from './BaseView';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export interface BaseModalProps {
    visible: boolean;
    onClose: () => void;
    children: React.ReactNode;
    size?: 'small' | 'medium' | 'large';
    closeOnOverlayPress?: boolean;
    showCloseButton?: boolean;
    closeButtonPosition?: 'top-right' | 'top-left';
    closeButtonSize?: number;
    closeButtonColor?: string;
    title?: string;
}

export const BaseModal: React.FC<BaseModalProps> = ({
    visible,
    onClose,
    children,
    size = 'medium',
    closeOnOverlayPress = true,
    showCloseButton = true,
    closeButtonPosition = 'top-right',
    closeButtonSize = 26,
    closeButtonColor,
    title
}) => {
    const { theme } = useThemeContext();

    const getModalSize = () => {
        switch (size) {
            case 'small':
                return {
                    width: SCREEN_WIDTH * 0.7,
                    maxHeight: SCREEN_HEIGHT * 0.4
                };
            case 'large':
                return {
                    width: SCREEN_WIDTH * 0.95,
                    maxHeight: SCREEN_HEIGHT * 0.9
                };
            case 'medium':
            default:
                return {
                    width: SCREEN_WIDTH * 0.85,
                    maxHeight: SCREEN_HEIGHT * 0.7
                };
        }
    };

    const getCloseButtonStyle = () => {
        const baseStyle = {
            position: 'absolute',
            zIndex: 1,
            padding: 5,
        } as const;

        switch (closeButtonPosition) {
            case 'top-left':
                return {
                    ...baseStyle,
                    top: 10,
                    left: 10,
                };
            case 'top-right':
            default:
                return {
                    ...baseStyle,
                    top: 10,
                    right: 10,
                };
        }
    };

    const modalSize = getModalSize();


    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
                <View style={styles.overlay}>
                        <View style={[
                            styles.modalContainer,
                            {
                                width: modalSize.width,
                                maxHeight: modalSize.maxHeight,
                                backgroundColor: theme.colors.background
                            }
                        ]}>
                            <BaseView variant="card" padding="large" style={styles.contentContainer}>
                                {title && (
                                    <BaseText 
                                        variant="title" 
                                        weight="bold" 
                                        style={styles.modalTitle}
                                    >
                                        {title}
                                    </BaseText>
                                )}
                                {showCloseButton && (
                                    <BaseTouchable
                                        variant="outline"
                                        onPress={onClose}
                                        style={getCloseButtonStyle()}
                                    >
                                        <Ionicons
                                            name="close-circle-outline"
                                            size={closeButtonSize}
                                            color={closeButtonColor || theme.colors.primary}
                                        />
                                    </BaseTouchable>
                                )}
                                <View style={styles.childrenContainer}>
                                    {children}
                                </View>
                            </BaseView>
                        </View>
                </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalContainer: {
        borderRadius: 10,
        overflow: 'hidden',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84
    },
    contentContainer: {
        width: '100%',
        position: 'relative'
    },
    modalTitle: {
        marginBottom: 20,
        paddingRight: 40 // Kapama butonu için boşluk
    },
    childrenContainer: {
        marginTop: 10
    }
}); 