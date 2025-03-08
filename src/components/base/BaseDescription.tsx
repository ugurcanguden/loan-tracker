import React from 'react';
import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { BaseView } from './BaseView';
import { BaseText } from './BaseText'; 
import { AmountDisplay } from '../tool';
import { useThemeContext } from '@guden-theme';

export interface DescriptionItemProps {
  label: string;
  value: string | number;
  isCurrency?: boolean;
  currency?: string;
  textStyle?: ViewStyle;
}

interface BaseDescriptionProps {
  items: DescriptionItemProps[];
  column?: number;
  style?: ViewStyle;
}

export const BaseDescription: React.FC<BaseDescriptionProps> = ({ 
  items, 
  column = 2,
  style 
}) => {
  const { theme } = useThemeContext();
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginHorizontal: -8,
      backgroundColor:theme.card,
      borderRadius:5,
      ...style
    },
    item: {
      width: `${98 / column}%`,
      padding: 8,
      borderRadius: 5 
    },
    itemContent: {
      padding: 12,
      borderRadius: 5,
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor:theme.border
    },
    label: {
      marginBottom: 4,
      opacity: 0.8,
      borderRadius: 5
    }
  });

  return (
    <BaseView style={styles.container}>
      {items.map((item, index) => (
        <BaseView key={index} style={styles.item} >
          <BaseView style={styles.itemContent}>
            <BaseText variant="label" style={{borderRadius:80}}>
              {item.label}
            </BaseText>
            {item.isCurrency ? (
              <AmountDisplay 
                amount={Number(item.value)} 
                currency={item.currency || 'TL'} 
                style={item.textStyle}
              />
            ) : (
              <BaseText 
                variant="title" 
                weight="bold"
                style={item.textStyle as TextStyle}  
              >
                {item.value}
              </BaseText>
            )}
          </BaseView>
        </BaseView>
      ))}
    </BaseView>
  );
}; 