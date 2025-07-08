// hooks/useThemeColor.tsx
import { Colors } from '../constants/Colors';
import { useColorScheme } from './useColorScheme';

export type ThemeProps = {
  light?: string;
  dark?: string;
};

export function useThemeColor(
  props: ThemeProps,
  colorName: keyof typeof Colors.light
): string {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  }

  return Colors?.[theme]?.[colorName] ?? '#000';
}
