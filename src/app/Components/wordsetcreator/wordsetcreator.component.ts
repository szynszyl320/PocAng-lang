import { Component, input } from '@angular/core';
import { AuthService } from '../../services/auth.service'
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { toObservable } from '@angular/core/rxjs-interop';


@Component({
  selector: 'app-wordsetcreator',
  standalone: true,
  imports: [FormsModule, TranslateModule],
  templateUrl: './wordsetcreator.component.html',
  styleUrl: './wordsetcreator.component.css'
})

export class WordsetcreatorComponent {

  currentUser: any;
  wordsetObject: any;
  
  wordset = input<any>();
  wordset$ = toObservable(this.wordset)

  manualEditorText: string = '';
  assistedCreatorContent: Array<any> = [];

  tab: string = 'assisted';

  newQuestionType: string = '';
  newQuestionValueOne: string = '';
  newQuestionValueTwo: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });     
    this.wordset$.subscribe(value => {
      this.wordsetObject = value
      this.manualEditorText = JSON.stringify(this.wordsetObject.wordlist, null, 0);
      this.assistedCreatorContent = JSON.parse(this.manualEditorText);
      
    })  
  }

  tabSelector(value: string) {
    this.tab = value;
  }

  addNewQuestionAssist() {
    try {
      this.assistedCreatorContent.push({
        type: this.newQuestionType,
        valueOne: this.newQuestionValueOne,
        valueTwo: this.newQuestionValueTwo
      })
      this.manualEditorText = JSON.stringify(this.assistedCreatorContent);
      this.authService.updateWordset(this.wordsetObject, this.wordsetObject.name, this.wordsetObject.icon, this.wordsetObject.language, this.assistedCreatorContent)
      console.log('wordset updated successfully');
    } catch (error) {
      console.error('failed to update wordset', error);
    }
  }

  addnewQuestionManual() {
    try {
      this.assistedCreatorContent = JSON.parse(this.manualEditorText);
      try {
        this.authService.updateWordset(this.wordsetObject, this.wordsetObject.name, this.wordsetObject.icon, this.wordsetObject.language, this.assistedCreatorContent)  
        console.log('wordset updated successfully');
      } catch (error) {
        console.log('failed to update wordset', error);
      }
    } catch (error) {
      console.log('failed to save the changes', error);
      alert("{{'SAVEFAILED' | translate}}")
    }
  }

}
