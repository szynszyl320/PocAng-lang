import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from "./Components/login/login.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoginComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {

  ngOnInit() {
    const isReloaded = localStorage.getItem('isReloaded');    
    if(!isReloaded) {
      location.reload();
      localStorage.setItem('isReloaded', 'true');
    }  
  }
  
}
