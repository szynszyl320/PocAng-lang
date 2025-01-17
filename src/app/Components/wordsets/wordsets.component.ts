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
  
  placeholderArray: Array<any> = [];
  
  wordlistEdit: number = 0;
  wordlistEditForm = false;
  
  userAccessForm = false;
  userAccess: number = 0;

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
  }

  async createNewWordset(event: Event) {
    event.preventDefault();
    try {
      await this.authService.createWordset(this.currentUser.id, this.wordsetName, this.wordsetIcon, this.wordsetLanguage);
      this.getUserWordsets();
      
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
      this.authService.updateWordset(this.userWordsets[this.chosenWordset], this.wordsetEditName, this.wordsetEditIcon, this.wordsetEditLanguage, this.placeholderArray)
      this.getUserWordsets();
      
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
      this.authService.deleteWordset(wordsetId);
      this.getUserWordsets();
    } catch (error) {
      console.error('failed to delte wordset', error);
    }
  }

}

