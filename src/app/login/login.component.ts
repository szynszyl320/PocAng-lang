import { Component } from '@angular/core';
import { AuthService } from '../auth.service'
import { FormsModule } from '@angular/forms';
import { TranslationService } from '../translation.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, TranslateModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  currentUser: any = null;
  email : string = '';
  password : string = '';
  confirmPassword : string = '';
  name: string = '';
  loginForm: boolean = false;
  signupForm: boolean = false;
  
  constructor(private authService: AuthService, private translationSerivce: TranslationService) {}

  ngOnInit() {
    // Subscribe to the auth state
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
  }

  switchLanguage(lang: string) {
    this.translationSerivce.setLanguage(lang);
  }

  login(event: Event) {
    event.preventDefault();
    this.authService.login(this.email, this.password).catch((error) => {
      console.error('Login failed', error);
    });
                
    this.email = '';
    this.password = '';
    this.confirmPassword = '';
    this.name = '';
    this.loginForm = false;
    this.signupForm = false;
  }

  signup(event: Event) {
    event.preventDefault();
    this.authService.signUp(this.email, this.password, this.confirmPassword, this.name).catch((error) => {
      console.error('Signup fialed', error);
    })

    this.email = '';
    this.password = '';
    this.confirmPassword = '';
    this.name = '';
    this.loginForm = false;
    this.signupForm = false;
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
}
