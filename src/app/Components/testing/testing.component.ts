import { Component, input, output } from '@angular/core';
import { AuthService } from '../../services/auth.service'
import {  FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { toObservable } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-testing',
  standalone: true,
  imports: [FormsModule, TranslateModule],
  templateUrl: './testing.component.html',
  styleUrl: './testing.component.css'
})

export class TestingComponent {

  currentUser: any;

  usedWordset: any;
  wordset = input<any>()
  wordset$ = toObservable(this.wordset);

  questionSet: Array<any>  = [];
  questionSubSet: Array<any> = [];
  question: any;
  
  answer: string = '';
  isCorrect?: boolean;
  questionId: number = 0;
  length: number = 0;
  staticLenght: number = this.length;

  componentClose = output<boolean>();

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.question = {
      type: 'placeholder',
      valueOne: 'placeholder',
      valueTwo: 'placeholder'
    }
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
    this.wordset$.subscribe((value) =>  {
      this.questionSet = value.wordlist;
      ((this.questionSet.length > 20)? this.length = 20 : this.length = this.questionSet.length)
      this.staticLenght = this.length;
      this.generateSubset();
      console.log(this.length, this.questionSet);
    });
    
  }
  
  generateSubset() {
    this.questionSubSet = [];
    const usedValues = new Array<number>   
    for(let i = 0; i < this.length; i++) {
      let random = Math.floor(Math.random() * (this.questionSet.length))      
      while (usedValues.includes(random)) {
        random = Math.floor(Math.random() * (this.questionSet.length))
      }
      this.questionSubSet.push(this.questionSet[random]);
      usedValues.push(random);
    };
    this.chooseQuestion();
  }
  
  lenghtCheck() {
    if (this.questionSubSet.length == 0) {
      this.createActivity();
      this.componentClose.emit(false);
    }
  }

  chooseQuestion() {
    let random = Math.floor(Math.random() * (this.questionSubSet.length))
    this.questionId = random;
    this.question = this.questionSubSet[random];  
  }

  answerCheck(id: number) {
    if (this.question.valueTwo == this.answer) {
      this.questionSubSet.splice(id, 1);
      this.length--;
      this.answer = '';
    }
    this.answer = '';
    this.lenghtCheck();
    this.chooseQuestion();
  }

  async createActivity() {
    try {
      console.log(this.currentUser.id);
      const record = await this.authService.createActivity(this.currentUser.id);
      console.log(record);
    } catch (error) {
      console.error('failed to create activity', error);
    }
  }

  closeWindow() {
    this.componentClose.emit(false);
  }

}
