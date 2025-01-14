import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service'
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { WordsetcreatorComponent } from '../wordsetcreator/wordsetcreator.component';

@Component({
  selector: 'app-wordlists',
  standalone: true,
  imports: [FormsModule, TranslateModule, WordsetcreatorComponent],
  templateUrl: './wordlists.component.html',
  styleUrl: './wordlists.component.css'
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

  async getUserWordsets() {
    const wordsets = (await this.authService.getUserWordsets(this.currentUser)).items
    this.userWordsets = wordsets;
  }

  async createNewWordset(event: Event) {
    event.preventDefault();
    try {
      await this.authService.createWordset(this.currentUser.id, this.wordsetName, this.wordsetIcon, this.wordsetLanguage);
      console.log('wordset created successfully');
    } catch (error) {
      console.error('Failed to create wordset', error);
    }
  }
  

  updateWordset(event: Event) {
    event.preventDefault();
    try {
      console.log(this.userWordsets[this.chosenWordset].id);
      this.authService.updateWordset(this.userWordsets[this.chosenWordset], this.wordsetEditName, this.wordsetEditIcon, this.wordsetEditLanguage, this.placeholderArray)
      console.log('wordset updated successfully');
    } catch (error) {
      console.error('failed to update wordset', error);
    }
  }

}

