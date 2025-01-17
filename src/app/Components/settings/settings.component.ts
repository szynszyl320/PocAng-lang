import { Component } from '@angular/core';
import { TranslationService } from '../../services/translation.service';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ThemeService } from '../../services/theme.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [FormsModule, TranslateModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})

export class SettingsComponent {
  
  currentUser: any;
  
  emailVisibility: boolean = true;
  name: string = '';
  avatar: any;
  
  password: string = '';
  oldPassword: string = '';

  isOn : boolean = false;

  languageValue : string = '';

  themeValue : string = '';

  settingsTab: string = "Language";

  constructor(private translationSerivce: TranslationService, private themeService: ThemeService, private authService: AuthService) {

  }
  
  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
    this.loadCookies();
  }

  switchLanguage(lang: string) {
    this.translationSerivce.setLanguage(lang);
  }

  switchTheme(theme: string) {
    this.themeService.setTheme(theme);
  }

  showSettings() {
    this.isOn = !this.isOn;
  }

  changeTab(value: string) {
    this.settingsTab = value;
  }

  updateUser(event: Event) {
    event.preventDefault();
    try {
      this.authService.updateAccount(this.emailVisibility, this.name, this.currentUser, this.avatar);
    } catch (error) {
      console.error('Account update failed', error);
    }
    this.name = '';
    this.emailVisibility = false;
  }

  updatePassword(event: Event) {
    event.preventDefault();
    console.log(this.oldPassword);
    try {
      this.authService.updatePassword(this.password, this.oldPassword, this.currentUser.id);
    } catch (error) {
      console.error(error);
    }
    this.password = '';
    this.oldPassword = '';
  }

  getCookieValue(cookieName: string) {
    const cookies = document.cookie.split(';');
  
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
  
       if (cookie.startsWith(`${cookieName}=`)) {
        return cookie.substring(cookieName.length + 1);
      }
    }
    return "0";
}

  saveSettings() {
    const expirationDay = new Date();
    expirationDay.setMonth(expirationDay.getMonth() +2);
    document.cookie = `languagePreference= ${this.languageValue}; expires=${expirationDay.toUTCString}; path=/`
    document.cookie = `themePreference= ${this.themeValue}; expires=${expirationDay.toUTCString}; path=/`
  }

  refreshCookies() {
    const expirationDay = new Date();
    expirationDay.setMonth(expirationDay.getMonth() +2);
    document.cookie = `languagePreference= ${this.languageValue}; expires=${expirationDay.toUTCString}; path=/`
    document.cookie = `themePreference= ${this.themeValue}; expires=${expirationDay.toUTCString}; path=/`
  }

  loadCookies() {
    this.languageValue = this.getCookieValue("languagePreference");
    this.themeValue = this.getCookieValue("themePreference");
    this.refreshCookies();
  }

}
