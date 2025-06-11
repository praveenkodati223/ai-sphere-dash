
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Palette, Sun, Moon, Monitor } from 'lucide-react';
import { toast } from 'sonner';

interface ThemeConfig {
  mode: 'light' | 'dark' | 'auto';
  primaryColor: string;
  accentColor: string;
  chartColors: string[];
}

const ThemeSwitcher = () => {
  const [theme, setTheme] = useState<ThemeConfig>({
    mode: 'dark',
    primaryColor: '#06b6d4', // cyan-500
    accentColor: '#8b5cf6', // purple-500
    chartColors: ['#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#6366f1']
  });

  const predefinedColors = [
    { name: 'Cyan', value: '#06b6d4' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Green', value: '#10b981' },
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Pink', value: '#ec4899' },
    { name: 'Orange', value: '#f59e0b' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Indigo', value: '#6366f1' }
  ];

  const chartColorSets = [
    {
      name: 'Ocean',
      colors: ['#06b6d4', '#0891b2', '#0e7490', '#155e75', '#164e63']
    },
    {
      name: 'Purple',
      colors: ['#8b5cf6', '#7c3aed', '#6d28d9', '#5b21b6', '#4c1d95']
    },
    {
      name: 'Sunset',
      colors: ['#f59e0b', '#d97706', '#b45309', '#92400e', '#78350f']
    },
    {
      name: 'Forest',
      colors: ['#10b981', '#059669', '#047857', '#065f46', '#064e3b']
    },
    {
      name: 'Rainbow',
      colors: ['#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#6366f1']
    }
  ];

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('sphereai_theme');
    if (savedTheme) {
      try {
        setTheme(JSON.parse(savedTheme));
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    }
  }, []);

  // Save theme to localStorage and apply CSS variables
  useEffect(() => {
    localStorage.setItem('sphereai_theme', JSON.stringify(theme));
    
    // Apply theme to CSS variables
    const root = document.documentElement;
    root.style.setProperty('--primary-color', theme.primaryColor);
    root.style.setProperty('--accent-color', theme.accentColor);
    
    // Apply chart colors
    theme.chartColors.forEach((color, index) => {
      root.style.setProperty(`--chart-color-${index + 1}`, color);
    });

    // Apply dark/light mode
    if (theme.mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme.mode === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      // Auto mode - use system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [theme]);

  const updateTheme = (updates: Partial<ThemeConfig>) => {
    setTheme(prev => ({ ...prev, ...updates }));
    toast.success('Theme updated');
  };

  const resetTheme = () => {
    const defaultTheme: ThemeConfig = {
      mode: 'dark',
      primaryColor: '#06b6d4',
      accentColor: '#8b5cf6',
      chartColors: ['#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#6366f1']
    };
    setTheme(defaultTheme);
    toast.success('Theme reset to default');
  };

  return (
    <Card className="bg-slate-800/50 border-purple-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-400">
          <Palette className="h-5 w-5" />
          Theme Customization
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Mode Selection */}
        <div className="space-y-3">
          <h4 className="font-medium">Display Mode</h4>
          <div className="grid grid-cols-3 gap-2">
            {[
              { mode: 'light' as const, icon: Sun, label: 'Light' },
              { mode: 'dark' as const, icon: Moon, label: 'Dark' },
              { mode: 'auto' as const, icon: Monitor, label: 'Auto' }
            ].map(({ mode, icon: Icon, label }) => (
              <Button
                key={mode}
                variant={theme.mode === mode ? "default" : "outline"}
                onClick={() => updateTheme({ mode })}
                className="flex items-center gap-2"
              >
                <Icon className="h-4 w-4" />
                {label}
              </Button>
            ))}
          </div>
        </div>

        {/* Primary Color */}
        <div className="space-y-3">
          <h4 className="font-medium">Primary Color</h4>
          <div className="grid grid-cols-4 gap-2">
            {predefinedColors.map(color => (
              <Button
                key={color.value}
                variant="outline"
                onClick={() => updateTheme({ primaryColor: color.value })}
                className="h-12 p-2 relative"
                style={{ backgroundColor: color.value + '20', borderColor: color.value + '40' }}
              >
                <div
                  className="w-6 h-6 rounded-full"
                  style={{ backgroundColor: color.value }}
                />
                {theme.primaryColor === color.value && (
                  <Badge className="absolute -top-1 -right-1 text-xs" variant="secondary">
                    ✓
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* Accent Color */}
        <div className="space-y-3">
          <h4 className="font-medium">Accent Color</h4>
          <div className="grid grid-cols-4 gap-2">
            {predefinedColors.map(color => (
              <Button
                key={color.value}
                variant="outline"
                onClick={() => updateTheme({ accentColor: color.value })}
                className="h-12 p-2 relative"
                style={{ backgroundColor: color.value + '20', borderColor: color.value + '40' }}
              >
                <div
                  className="w-6 h-6 rounded-full"
                  style={{ backgroundColor: color.value }}
                />
                {theme.accentColor === color.value && (
                  <Badge className="absolute -top-1 -right-1 text-xs" variant="secondary">
                    ✓
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* Chart Color Sets */}
        <div className="space-y-3">
          <h4 className="font-medium">Chart Color Palette</h4>
          <div className="space-y-2">
            {chartColorSets.map(colorSet => (
              <Button
                key={colorSet.name}
                variant="outline"
                onClick={() => updateTheme({ chartColors: colorSet.colors })}
                className="w-full h-16 p-3 relative justify-start"
              >
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    {colorSet.colors.slice(0, 5).map((color, index) => (
                      <div
                        key={index}
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <span className="font-medium">{colorSet.name}</span>
                </div>
                {JSON.stringify(theme.chartColors) === JSON.stringify(colorSet.colors) && (
                  <Badge className="absolute top-2 right-2 text-xs" variant="secondary">
                    Active
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* Current Theme Preview */}
        <div className="space-y-3">
          <h4 className="font-medium">Current Theme Preview</h4>
          <div className="p-4 rounded-lg border" style={{ 
            backgroundColor: theme.mode === 'light' ? '#f8fafc' : '#1e293b',
            borderColor: theme.primaryColor + '40'
          }}>
            <div className="flex items-center gap-2 mb-3">
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: theme.primaryColor }}
              />
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: theme.accentColor }}
              />
              <span className="text-sm font-medium">Sample UI Elements</span>
            </div>
            <div className="flex gap-1">
              {theme.chartColors.map((color, index) => (
                <div
                  key={index}
                  className="w-3 h-12 rounded-sm"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Reset Button */}
        <div className="pt-4 border-t border-slate-600/30">
          <Button variant="outline" onClick={resetTheme} className="w-full">
            Reset to Default
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ThemeSwitcher;
