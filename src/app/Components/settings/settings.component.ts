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
  
  password: string = '';
  emailVisibility: boolean = false;
  name: string = '';
  oldPassword: string = '';

  currentUser: any;

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

  isOn : boolean = false;

  languageValue : string = '';

  themeValue : string = '';

  settingsTab: string = "Language";

  showSettings() {
    this.isOn = !this.isOn;
  }

  changeTab(value: string) {
    this.settingsTab = value;
  }

  updateUser(event: Event) {
    event.preventDefault();
    try {
      this.authService.updateAccount(this.emailVisibility, this.name, this.currentUser);
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

  // Function to get the value of a specific cookie
  getCookieValue(cookieName: string) {
    // Get all the cookies
    const cookies = document.cookie.split(';');
  
    // Loop through the cookies and find the one with the specified name
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
  
      // Check if the cookie starts with the specified name
      if (cookie.startsWith(`${cookieName}=`)) {
        // Return the value of the cookie
        return cookie.substring(cookieName.length + 1);
      }
    }
    return "0";
  // If the cookie is not found, return nul
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
