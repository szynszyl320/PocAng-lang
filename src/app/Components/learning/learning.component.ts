import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service'
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TestingComponent } from '../testing/testing.component';

@Component({
  selector: 'app-learning',
  standalone: true,
  imports: [FormsModule, TranslateModule, TestingComponent],
  templateUrl: './learning.component.html',
  styleUrl: './learning.component.css'
})

export class LearningComponent {

  currentUser: any;

  userAccessedWordsets: Array<any> = [];

  groupAccessedWordsets: Array<any> = [];

  testingForm: boolean = false;
  usedWordset: any;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
    this.searchUserAccessedWordsets();
    this.searchGroupAccessedWorsets();
  }

  async searchUserAccessedWordsets() {
    try {
      const wordsets = (await this.authService.getUserAccessedWordsets(this.currentUser.id)).items;
      this.userAccessedWordsets = wordsets;
    } catch (error) {
      console.error('failed to find wordsets',error);
    }
  }

  async searchGroupAccessedWorsets() {
    try {
      const wordsets = (await this.authService.getGroupAccessedWordsets(this.currentUser.id))
      this.groupAccessedWordsets = wordsets;
    } catch (error) {
      console.error('failed to find wordsets',error);
    }
  }

  displayForm(inputId: number, searchtype: string) {
    this.testingForm = !this.testingForm;
    ((searchtype == 'user')? this.usedWordset = this.userAccessedWordsets[inputId].expand.wordsetId : this.usedWordset = this.groupAccessedWordsets[inputId].expand.wordsetId)
  }

  handleAppClose(event: boolean) {
    this.testingForm = false;
  }


}
