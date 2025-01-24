import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service'
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { WordsetcreatorComponent } from '../wordsetcreator/wordsetcreator.component';
import { UseraccessComponent } from '../access/access.component';

@Component({
  selector: 'app-wordlists',
  standalone: true,
  imports: [FormsModule, TranslateModule, WordsetcreatorComponent, UseraccessComponent],
  templateUrl: './wordsets.component.html',
  styleUrl: './wordsets.component.css'
})

export class WordlistsComponent {

  currentUser: any;
  
  userWordsets: Array<any> = [];
  
  wordsetName: string = '';
  wordsetIcon: any;
  wordsetLanguage: string = '';
  
  chosenWordset: number = 0;
  
  wordsetEditName: string = '';
  wordsetEditIcon: any;
  wordsetEditLanguage: string = '';
  
  wordlistEdit: number = 0;
  wordlistEditForm: boolean = false;
  
  userAccessForm: boolean = false;
  userAccess: number = 0;

  wordsetEditForm: boolean = false;
  edditedwordset:any;

  wordsetCreationForm: boolean = false;

  handleAppClose(event: boolean) {
    this.userAccessForm = false;
    this.wordlistEditForm = false;
    this.getUserWordsets();
  }

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
    this.getUserWordsets();
  }

  setEditWordlist(input: number) {
    this.wordlistEditForm = !this.wordlistEditForm;
    this.wordlistEdit = input;
  }

  userAccessEdit(input: number) {
    this.userAccessForm = !this.userAccessForm;
    this.userAccess = input;
  }

  async getUserWordsets() {
    const wordsets = (await this.authService.getUserWordsets(this.currentUser.id)).items
    this.userWordsets = wordsets;
    console.log(wordsets);
  }

  async createNewWordset(event: Event) {
    event.preventDefault();
    try {
      await this.authService.createWordset(this.currentUser.id, this.wordsetName, this.wordsetIcon, this.wordsetLanguage, null);
      await new Promise(resolve => setTimeout(resolve, 100));
      await this.getUserWordsets();
      
      this.wordsetEditName = '';
      this.wordsetIcon = null;
      this.wordsetLanguage = '';

      console.log('wordset created successfully');
    } catch (error) {
      console.error('Failed to create wordset', error);
    }
  }

  async updateWordset(event: Event) {
    event.preventDefault();
    try {
      this.authService.updateWordset(this.edditedwordset, this.wordsetEditName, this.wordsetEditIcon, this.wordsetEditLanguage, null)
      await new Promise(resolve => setTimeout(resolve, 100));
      await this.getUserWordsets();
      
      this.wordsetEditName = '';
      this.wordsetEditIcon = null;
      this.wordsetEditLanguage = '';

      console.log('wordset updated successfully');
    } catch (error) {
      console.error('failed to update wordset', error);
    }
  }

  async deleteWordset(event: Event, wordsetId: string) {
    event.preventDefault()
    try {
      if (confirm('Are you sure you want to delete this wordset?')) {
        this.authService.deleteWordset(wordsetId);
        await new Promise(resolve => setTimeout(resolve, 100));
        await this.getUserWordsets();
      }
    } catch (error) {
      console.error('failed to delte wordset', error);
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.wordsetIcon = file;
      this.wordsetEditIcon = file;
    } 
  }

  getWordsetIcon(wordset:any) {
    return this.authService.getWordsetIcon(wordset);
  }

  async importFile(event: any): Promise<void> {
    try {
      const file: File = event.target.files[0];
      
      if (!file) {
        throw new Error('No file selected');
      }
  
      const fileContent = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
          resolve(e.target?.result as string);
        };
        
        reader.onerror = (error) => {
          reject(error);
        };
        
        reader.readAsText(file);
      });
  
      const jsonData = JSON.parse(fileContent);

      if (!jsonData.name || !jsonData.language || !jsonData.wordlist) {
        throw new Error('Invalid file structure');
      }
  
      await this.authService.createWordset(this.currentUser.id, jsonData.name, null, jsonData.language, jsonData.wordlist);
  
      await this.getUserWordsets();
    } catch (error) {
      console.error('Failed to import wordset:', error);
    }
  }

  exportFile(wordset: any, event: Event) {
    try { 
      console.log(wordset);
      
      const newDataFile = {
        name: wordset.name,
        language: wordset.language,
        wordlist: wordset.wordlist
      }
      const jsonData = JSON.stringify(newDataFile, null, 2);

      const blob = new Blob([jsonData], { type: 'application/json' });

      const link = document.createElement('a');
      link.setAttribute('href', URL.createObjectURL(blob));
      link.setAttribute('download', wordset.name + '.json');

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
    } catch (error) {
      console.error('Failed to export wordset');
    }
  }

  creationFromToggle() {
    this.wordsetCreationForm = !this.wordsetCreationForm;
  }

  editFormToggle(input: number) {
    this.wordsetEditForm = !this.wordsetEditForm;
    this.edditedwordset = this.userWordsets[input];
  }

 

}

