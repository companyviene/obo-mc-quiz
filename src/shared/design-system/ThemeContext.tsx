import { createContext, useContext, useState, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { darkTheme, lightTheme, type ThemeColors } from './theme';

type ColorScheme = 'dark' | 'light';

interface ThemeContextValue {
  theme: ThemeColors;
  colorScheme: ColorScheme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: lightTheme,
  colorScheme: 'light',
  toggleTheme: () => undefined,
});

interface Props {
  children: ReactNode;
}

export function ThemeProvider({ children }: Props) {
  // Default to light — user can override with the toggle.
  const systemScheme = useColorScheme() ?? 'light';
  const [override, setOverride] = useState<ColorScheme | null>(null);

  const activeScheme: ColorScheme = override ?? systemScheme;
  const theme = activeScheme === 'light' ? lightTheme : darkTheme;

  function toggleTheme(): void {
    setOverride((prev) => {
      const current = prev ?? systemScheme;
      return current === 'dark' ? 'light' : 'dark';
    });
  }

  return (
    <ThemeContext.Provider value={{ theme, colorScheme: activeScheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeColors {
  return useContext(ThemeContext).theme;
}

export function useThemeToggle(): { colorScheme: ColorScheme; toggleTheme: () => void } {
  const { colorScheme, toggleTheme } = useContext(ThemeContext);
  return { colorScheme, toggleTheme };
}
