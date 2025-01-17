import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service'
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SettingsComponent } from '../settings/settings.component';
import { GroupsComponent } from '../groups/groups.component';
import { WordlistsComponent } from '../wordsets/wordsets.component';
import { LearningComponent } from '../learning/learning.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, TranslateModule, SettingsComponent, GroupsComponent, WordlistsComponent, LearningComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  currentUser: any = null;
  
  email: string = '';
  name: string = '';
  icon: any;
  password: string = '';
  confirmPassword: string = ''; 
  
  loginForm: boolean = false;
  signupForm: boolean = false;
  
  menuSelector: string = 'learning';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
  }

  login(event: Event) {
    event.preventDefault();
    try {
      this.authService.login(this.email, this.password)
      
      this.email = '';
      this.password = '';
      this.loginForm = false;
      
    } catch (error) {
      console.log('failed to login', error);
      alert('failed to login, check password and email'); 
    }
  }

  signup(event: Event) {
    event.preventDefault();
    try {
      this.authService.signUp(this.email, this.password, this.confirmPassword, this.name, this.icon)
      
      this.email = '';
      this.password = '';
      this.confirmPassword = '';
      this.icon = null;
      this.name = '';
      
      this.signupForm = false;
    
    } catch (error) {
      console.log('failed to signup', error);
      alert('failed to signup, check if the email has not been used already');
    }
  }

  logout() {
    this.authService.logout();
  }

  loginInit() {
    this.loginForm = !this.loginForm
  }

  signupInit() {
    this.signupForm = !this.signupForm
  }

  changeTab(tab: string) {
    this.menuSelector = tab;
  }

}
