
import React from 'react';

interface ThemeToggleProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, toggleTheme }) => {
  return (
    <label htmlFor="theme-switch" className="flex items-center cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          id="theme-switch"
          className="sr-only"
          checked={theme === 'dark'}
          onChange={toggleTheme}
        />
        <div className="block bg-gray-200 dark:bg-gray-600 w-14 h-8 rounded-full"></div>
        <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-300 ease-in-out" style={{ transform: theme === 'dark' ? 'translateX(1.5rem)' : 'translateX(0)' }}></div>
      </div>
    </label>
  );
};

export default ThemeToggle;
