import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../services/translation.service';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ThemeService } from '../../services/theme.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [FormsModule, TranslateModule, CommonModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})

export class SettingsComponent {
  
  currentUser: any;
  
  emailVisibility: boolean = true;
  name: string = '';
  avatar: any;
  
  userActivities: Array<any> = [];
  daysArray: Array<any> = [];

  password: string = '';
  oldPassword: string = '';

  isOn : boolean = false;

  languageValue : string = '';

  themeValue : string = '';

  settingsTab: string = "Language";

  constructor(private translationSerivce: TranslationService, private themeService: ThemeService, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadUserPreferences();
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
    this.getUserActivity();
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
    try {
      this.authService.updatePassword(this.password, this.oldPassword, this.currentUser.id);
    } catch (error) {
      console.error(error);
    }
    this.password = '';
    this.oldPassword = '';
  }

  async getUserActivity() {
    try {
      this.userActivities = (await this.authService.getUserActivity(this.currentUser.id)).items  
      this.generateCurrentMonthArray();
      this.mergeDaysWithActivities();
    } catch (error) {
      console.error(`failed to find any activity for ${this.currentUser.name}`, error);
    }
  }

  saveUserPeferences() {
    try {
      const userPreferences = {
        language : ((this.languageValue != null)? this.languageValue : 'light' ),
        theme: ((this.themeValue != null)? this.themeValue : 'en')
      } 
      localStorage.setItem('installedConfig', JSON.stringify(userPreferences));  
    } catch (error) {
      console.error('failed to save preferences',error);
    }
  }

  loadUserPreferences() {
    try {
      const config = JSON.parse(localStorage.getItem('installedConfig') ?? '');
      this.languageValue = config.language;
      this.switchLanguage(config.language);
      this.themeValue = config.theme;
      this.switchTheme(config.theme);
    } catch (error) { 
      console.error('failed to find or load any preferences', error);
    }
  }

  generateCurrentMonthArray() {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDay = new Date(currentYear, currentMonth, day);
      this.daysArray.push({
        date: currentDay.toISOString().split('T')[0],
        count: 0
      });
    }
  }

  mergeDaysWithActivities(): void {
    this.userActivities.forEach(activity => {
      const activityDate = activity.created.split(' ')[0];
      const matchIndex = this.daysArray.findIndex(day => 
        day.date == activityDate
      );
      if (matchIndex !== -1) {
        this.daysArray[matchIndex].count = activity.count; 
      }
    });
  }

}
