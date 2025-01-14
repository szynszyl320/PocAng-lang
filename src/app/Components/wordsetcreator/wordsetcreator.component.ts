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
  wordsetValue: any;
  
  wordset = input<any>();
  wordset$ = toObservable(this.wordset)

  manualEditorText: string = '';
  assistedCreatorContent: Array<any> = [];

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });     
    this.wordset$.subscribe(value => {
      this.wordsetValue = value
      console.log(value);
    })
  }

  

}
