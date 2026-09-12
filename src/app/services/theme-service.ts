import { computed, effect, Service, signal } from '@angular/core';
import { ThemeMode } from '../models/global-model';

@Service()
export class ThemeService {
  private readonly storageKey = 'theme-preference';

  private readonly theme = signal<ThemeMode>(this.getInitialTheme());
  readonly isDarkMode = computed(() => this.theme() === 'dark');

  constructor() {
    effect(() => {
      const currentTheme = this.theme();
      document.body.style.colorScheme = currentTheme;

      if (typeof window !== 'undefined') {
        localStorage.setItem(this.storageKey, currentTheme);
      }
    });
  }

  toggleDarkMode(): void {
    this.theme.update((current) => (current === 'dark' ? 'light' : 'dark'));
  }

  private getInitialTheme(): ThemeMode {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(this.storageKey) as ThemeMode;
      if (saved) return saved;
    }
    return 'light';
  }
}
