/**
 * Complete Dark Mode System
 * 
 * 다크모드 토글 버튼
 * LocalStorage 자동 저장
 * 시스템 설정 감지 (선택)
 * 부드러운 전환 애니메이션
 * 완전히 독립적인 시스템
 * 
 * @dependencies
 * npm install lucide-react motion
 * 
 * @usage
 * ```tsx
 * import { DarkModeProvider, useDarkMode, DarkModeToggle } from './DarkModeSystem';
 * 
 * function App() {
 *   return (
 *     <DarkModeProvider>
 *       <DarkModeToggle />
 *       <YourContent />
 *     </DarkModeProvider>
 *   );
 * }
 * ```
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// ============================================================================
// 타입 정의
// ============================================================================
type Theme = 'light' | 'dark' | 'system';

interface DarkModeContextType {
  theme: Theme;
  isDark: boolean;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

// ============================================================================
// 컨텍스트
// ============================================================================
const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);

export function useDarkMode() {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error('useDarkMode must be used within DarkModeProvider');
  }
  return context;
}

// ============================================================================
// 프로바이더
// ============================================================================
interface DarkModeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

export function DarkModeProvider({
  children,
  defaultTheme = 'light',
  storageKey = 'panel-insight-theme',
}: DarkModeProviderProps) {
  // 초기 테마 설정 (localStorage 또는 시스템 설정)
  const getInitialTheme = (): Theme => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored && (stored === 'light' || stored === 'dark' || stored === 'system')) {
        return stored as Theme;
      }
    } catch (error) {
      console.error('Failed to load theme:', error);
    }
    return defaultTheme;
  };

  const [theme, setThemeState] = useState<Theme>(getInitialTheme);
  const [isDark, setIsDark] = useState(false);

  // 테마를 실제로 적용하는 함수
  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    const body = document.body;
    let actualTheme: 'light' | 'dark' = 'light';

    if (newTheme === 'system') {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      actualTheme = systemPrefersDark ? 'dark' : 'light';
    } else {
      actualTheme = newTheme;
    }

    root.classList.remove('light', 'dark');
    body.classList.remove('light', 'dark');
    root.classList.add(actualTheme);
    body.classList.add(actualTheme);
    root.setAttribute('data-theme', actualTheme);
    body.setAttribute('data-theme', actualTheme);
    setIsDark(actualTheme === 'dark');
    root.style.setProperty('transition', 'background-color 0.3s ease, color 0.3s ease');
    body.style.setProperty('transition', 'background-color 0.3s ease, color 0.3s ease');
    
    requestAnimationFrame(() => {
      const portalElements = document.querySelectorAll('[data-portal]');
      portalElements.forEach((el) => {
        el.classList.remove('light', 'dark');
        el.classList.add(actualTheme);
        el.setAttribute('data-theme', actualTheme);
      });
    });
  };

  useEffect(() => {
    const initialTheme = getInitialTheme();
    setThemeState(initialTheme);
    applyTheme(initialTheme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    applyTheme(theme);
    
    const portalElements = document.querySelectorAll('[data-portal]');
    portalElements.forEach((el) => {
      el.classList.remove('light', 'dark');
      const root = document.documentElement;
      const actualTheme = root.classList.contains('dark') ? 'dark' : 'light';
      el.classList.add(actualTheme);
    });
  }, [theme]);

  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      applyTheme('system');
      
      const portalElements = document.querySelectorAll('[data-portal]');
      portalElements.forEach((el) => {
        el.classList.remove('light', 'dark');
        const root = document.documentElement;
        const actualTheme = root.classList.contains('dark') ? 'dark' : 'light';
        el.classList.add(actualTheme);
      });
    };

    const initialDark = mediaQuery.matches;
    setIsDark(initialDark);

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(storageKey, newTheme);
      applyTheme(newTheme);
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  };

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    setTheme(newTheme);
  };

  return (
    <DarkModeContext.Provider value={{ theme, isDark, setTheme, toggleTheme }}>
      {children}
    </DarkModeContext.Provider>
  );
}

// ============================================================================
// 컴포넌트
// ============================================================================
// 1. 간단한 토글 버튼
interface DarkModeToggleProps {
  variant?: 'icon' | 'button' | 'switch';
  size?: 'sm' | 'md' | 'lg';
  position?: 'fixed' | 'relative';
  className?: string;
}

export function DarkModeToggle({
  variant = 'icon',
  size = 'md',
  position = 'relative',
  className = '',
}: DarkModeToggleProps) {
  const { isDark, toggleTheme } = useDarkMode();

  const sizes = {
    sm: { icon: 16, button: '32px' },
    md: { icon: 20, button: '40px' },
    lg: { icon: 24, button: '48px' },
  };

  if (variant === 'icon') {
    return (
      <motion.button
        whileHover={{ scale: 1.1, rotate: 15 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleTheme}
        className={className}
        style={{
          position,
          ...(position === 'fixed' && {
            top: '20px',
            right: '20px',
            zIndex: 9999,
          }),
          width: sizes[size].button,
          height: sizes[size].button,
          borderRadius: '12px',
          border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #E5E7EB',
          background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'white',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          boxShadow: isDark
            ? '0 4px 12px rgba(0, 0, 0, 0.3)'
            : '0 2px 8px rgba(0, 0, 0, 0.1)',
        }}
        title={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
      >
        <AnimatePresence mode="wait">
          {isDark ? (
            <motion.div
              key="sun"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Sun size={sizes[size].icon} color="#F59E0B" />
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Moon size={sizes[size].icon} color="#6B7280" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    );
  }

  if (variant === 'button') {
    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={toggleTheme}
        className={className}
        style={{
          position,
          ...(position === 'fixed' && {
            top: '20px',
            right: '20px',
            zIndex: 9999,
          }),
          padding: '10px 20px',
          borderRadius: '12px',
          border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #E5E7EB',
          background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'white',
          color: isDark ? '#E5E7EB' : '#374151',
          fontSize: '14px',
          fontWeight: 600,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'all 0.3s ease',
          boxShadow: isDark
            ? '0 4px 12px rgba(0, 0, 0, 0.3)'
            : '0 2px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <AnimatePresence mode="wait">
          {isDark ? (
            <motion.div
              key="sun"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Sun size={16} color="#F59E0B" />
              <span>라이트 모드</span>
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Moon size={16} color="#6B7280" />
              <span>다크 모드</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    );
  }

  // 스위치 변형
  return (
    <button
      onClick={toggleTheme}
      className={className}
      style={{
        position,
        ...(position === 'fixed' && {
          top: '20px',
          right: '20px',
          zIndex: 9999,
        }),
        width: '60px',
        height: '32px',
        borderRadius: '16px',
        background: isDark
          ? 'linear-gradient(135deg, #1e3a8a 0%, #312e81 100%)'
          : 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
        border: 'none',
        cursor: 'pointer',
        transition: 'background 0.3s ease',
        boxShadow: isDark
          ? '0 4px 12px rgba(0, 0, 0, 0.3)'
          : '0 2px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      <motion.div
        animate={{
          x: isDark ? 28 : 0,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        style={{
          position: 'absolute',
          top: '2px',
          left: '2px',
          width: '28px',
          height: '28px',
          borderRadius: '14px',
          background: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
        }}
      >
        <AnimatePresence mode="wait">
          {isDark ? (
            <motion.div
              key="moon-icon"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <Moon size={16} color="#312e81" />
            </motion.div>
          ) : (
            <motion.div
              key="sun-icon"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <Sun size={16} color="#f59e0b" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </button>
  );
}

// 2. 테마 선택기 (라이트 / 다크 / 시스템)
export function ThemeSelector() {
  const { theme, setTheme, isDark } = useDarkMode();

  const options: { value: Theme; label: string; icon: React.ReactNode }[] = [
    { value: 'light', label: '라이트', icon: <Sun size={16} /> },
    { value: 'dark', label: '다크', icon: <Moon size={16} /> },
    { value: 'system', label: '시스템', icon: <span>System</span> },
  ];

  return (
    <div
      style={{
        display: 'inline-flex',
        padding: '4px',
        borderRadius: '12px',
        background: isDark ? 'rgba(255, 255, 255, 0.05)' : '#F3F4F6',
        border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #E5E7EB',
      }}
    >
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => setTheme(option.value)}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            background: theme === option.value
              ? isDark
                ? 'rgba(255, 255, 255, 0.1)'
                : 'white'
              : 'transparent',
            color: theme === option.value
              ? isDark
                ? '#E5E7EB'
                : '#111827'
              : isDark
              ? '#9CA3AF'
              : '#6B7280',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s ease',
            boxShadow: theme === option.value
              ? isDark
                ? '0 2px 8px rgba(0, 0, 0, 0.3)'
                : '0 1px 3px rgba(0, 0, 0, 0.1)'
              : 'none',
          }}
        >
          {option.icon}
          {option.label}
        </button>
      ))}
    </div>
  );
}

// 3. 플로팅 다크 모드 버튼 (항상 표시)
export function FloatingDarkModeButton() {
  const { isDark, toggleTheme } = useDarkMode();

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggleTheme}
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        width: '56px',
        height: '56px',
        borderRadius: '28px',
        border: 'none',
        background: isDark
          ? 'linear-gradient(135deg, #1e3a8a 0%, #312e81 100%)'
          : 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: isDark
          ? '0 8px 24px rgba(0, 0, 0, 0.4)'
          : '0 8px 24px rgba(245, 158, 11, 0.4)',
        zIndex: 9999,
        transition: 'all 0.3s ease',
      }}
      title={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
    >
      <AnimatePresence mode="wait">
        {isDark ? (
          <motion.div
            key="sun"
            initial={{ rotate: -180, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 180, opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Sun size={24} color="white" />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ rotate: 180, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -180, opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Moon size={24} color="white" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
// ============================================================================
// 유틸리티 훅
// ============================================================================
// 현재 테마 색상 가져오기
export function useThemeColors() {
  const { isDark } = useDarkMode();

  return {
    bg: {
      primary: isDark ? '#0B1220' : '#FFFFFF',
      secondary: isDark ? '#111827' : '#F8FAFC',
      tertiary: isDark ? '#1F2937' : '#F1F5F9',
    },
    text: {
      primary: isDark ? '#FFFFFF' : '#111827',
      secondary: isDark ? '#E5E7EB' : '#475569',
      tertiary: isDark ? '#D1D5DB' : '#64748B',
    },
    border: {
      primary: isDark ? 'rgba(255, 255, 255, 0.1)' : '#E5E7EB',
      secondary: isDark ? 'rgba(255, 255, 255, 0.05)' : '#F3F4F6',
    },
    accent: {
      blue: '#2563EB',
      purple: '#7C3AED',
      green: '#16A34A',
      amber: '#F59E0B',
      red: '#EF4444',
    },
  };
}

// ============================================================================
// 전체 내보내기
// ============================================================================
export default {
  DarkModeProvider,
  useDarkMode,
  DarkModeToggle,
  ThemeSelector,
  FloatingDarkModeButton,
  useThemeColors,
};


