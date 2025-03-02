import { useThemeContext } from '@guden-theme';
import { ScrollView, View, Text, StyleSheet, ViewProps, ScrollViewProps, TextProps } from 'react-native';

export interface BaseScrollViewProps {
    title?: string;  
    header?: React.ReactNode;
    headerStyle?: object;
    children: React.ReactNode;
    contentContainerStyle?: object;
    footer?: React.ReactNode;
    footerStyle?: object;
}

export const BaseScrollView: React.FC<BaseScrollViewProps> = ({
    title,
    header,
    headerStyle,
    children,
    contentContainerStyle,
    footer,
    footerStyle,
}) => {
    const { theme } = useThemeContext(); // 📌 Tema bilgilerini al

    const viewProps: ViewProps = {
        style: [styles.container, { backgroundColor: theme.colors.background }]
    };

    const headerViewProps: ViewProps = {
        style: [styles.header, headerStyle, { backgroundColor: theme.colors.background }]
    };

    const titleTextProps: TextProps = {
        style: [styles.title, { color: theme.colors.text }],
        children: title
    };

    const scrollViewProps: ScrollViewProps = {
        contentContainerStyle: [styles.contentContainer, contentContainerStyle]
    };

    const footerViewProps: ViewProps = {
        style: [styles.footer, footerStyle, { backgroundColor: theme.colors.primary }]
    };

    return (
        <View {...viewProps}>
            <View {...headerViewProps}>
                {title && <Text {...titleTextProps} />}
                {header}
            </View>
            <ScrollView {...scrollViewProps}>
                {children}
            </ScrollView>
            {footer && (
                <View {...footerViewProps}>
                    {footer}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        paddingVertical: 15,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    contentContainer: {
        flexGrow: 1,
        marginTop: 60, // 📌 Başlık için boşluk bırakıldı
        marginBottom: 50, // 📌 Footer için boşluk bırakıldı
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        paddingVertical: 10,
    },
});