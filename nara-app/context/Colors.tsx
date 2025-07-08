// constants/Colors.tsx

export const Colors = {
  light: {
    text: '#000',
    background: '#fff',
    tint: '#2f95dc',
    icon: '#ccc',
    tabIconDefault: '#ccc',
    tabIconSelected: '#2f95dc',
  },
  dark: {
    text: '#fff',
    background: '#000',
    tint: '#fff',
    icon: '#fff',
    tabIconDefault: '#ccc',
    tabIconSelected: '#fff',
  },
} as const;

export type ThemeName = keyof typeof Colors;
export type ThemeColorName = keyof typeof Colors.light;
