// components/TranslatedText.tsx
import React, { useEffect, useState } from 'react';
import { Text, TextProps } from 'react-native';
import { useTranslation } from '@/Context/TranslatationContext';

interface TranslatedTextProps extends TextProps {
  children: string;
}

const TranslatedText = ({ children, ...props }: TranslatedTextProps) => {
  const { translate } = useTranslation();
  const [translated, setTranslated] = useState(children);

  useEffect(() => {
    let isMounted = true;

    const doTranslate = async () => {
      const result = await translate(children);
      if (isMounted) setTranslated(result);
    };

    doTranslate();

    return () => {
      isMounted = false;
    };
  }, [children, translate]);

  return <Text {...props}>{translated}</Text>;
};

export default TranslatedText;
