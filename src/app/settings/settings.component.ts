import { Component } from '@angular/core';
import { TranslationService } from '../services/translation.service';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [FormsModule, TranslateModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})

export class SettingsComponent {
  constructor(private translationSerivce: TranslationService) {

  }
  
  switchLanguage(lang: string) {
    this.translationSerivce.setLanguage(lang);
  }

  isOn : boolean = false;

  languageValue : string = '';

  themeValue : string = '';

  settingsTab: string = "Theme";

  showSettings() {
    this.isOn = !this.isOn;
  }

  changeTab(value: string) {
    this.settingsTab = value;
  }
}
