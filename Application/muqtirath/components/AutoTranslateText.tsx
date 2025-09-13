// components/AutoTranslateText.tsx
import { Text as RNText, TextProps } from 'react-native';
import TranslatedText from './TranslatedText';

export const Text = (props: TextProps) => {
  const children = typeof props.children === 'string' ? props.children : '';
  return <TranslatedText {...props}>{children}</TranslatedText>;
};
