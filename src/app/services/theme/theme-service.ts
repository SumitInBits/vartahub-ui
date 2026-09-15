import { computed, effect, inject, Service, signal } from '@angular/core';
import { ThemeMode } from '../../models/global-model';
import { StorageService } from '../storage/storage-service';

@Service()
export class ThemeService {
  private readonly storageKey = 'theme-preference';
  private readonly storageService = inject(StorageService);

  private readonly theme = signal<ThemeMode>(this.getInitialTheme());
  readonly isDarkMode = computed(() => this.theme() === 'dark');

  constructor() {
    effect(() => {
      const currentTheme = this.theme();
      document.body.style.colorScheme = currentTheme;

      if (typeof window !== 'undefined') {
        this.storageService.set(this.storageKey, currentTheme);
      }
    });
  }

  toggleDarkMode(): void {
    this.theme.update((current) => (current === 'dark' ? 'light' : 'dark'));
  }

  private getInitialTheme(): ThemeMode {
    if (typeof window !== 'undefined') {
      const saved = this.storageService.get<ThemeMode>(this.storageKey);
      if (saved) return saved;
    }
    return 'light';
  }
}
