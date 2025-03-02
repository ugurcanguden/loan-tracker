import { useThemeContext } from "@guden-theme";
import { Text, TextProps } from "react-native";
export interface BaseTextProps extends TextProps {
    text: string;
}

export const BaseText = (props: BaseTextProps) => {
    const { theme } = useThemeContext();
    return (
        <Text style={{ color: theme.colors.text }}  {...props}>{props.text}</Text>
    )
}