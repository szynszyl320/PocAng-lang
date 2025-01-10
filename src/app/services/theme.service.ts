import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly defaultTheme = 'light'; // Default theme if none is set

  /** Set a specific theme */
  setTheme(theme: string) {
    document.documentElement.setAttribute('data-theme', theme);
    // localStorage.setItem(this.storageKey, theme);
  }
}
