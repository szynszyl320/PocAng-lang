import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  constructor(private translate: TranslateService) {
    this.initializeLanguage();
  }

  // Initialize the default language
  private initializeLanguage() {
    const browserLang = this.translate.getBrowserLang() || 'en';
    this.translate.setDefaultLang('en');
    this.translate.use(browserLang.match(/en|pl/) ? browserLang : 'en');
  }

  // Change the language
  setLanguage(lang: string) {
    this.translate.use(lang);
  }

  // Get the current language
  getLanguage(): string {
    return this.translate.currentLang;
  }
}
