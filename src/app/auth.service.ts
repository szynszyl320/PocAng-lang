import { Injectable } from '@angular/core';
import PocketBase from 'pocketbase';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  // Initialize PocketBase client
  private pb = new PocketBase('http://127.0.0.1:8090');

  // BehaviorSubject to track the current user (like Svelte's `writable`)
  private currentUserSubject = new BehaviorSubject<any>(this.pb.authStore.model);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Subscribe to authStore changes
    this.pb.authStore.onChange(() => {
      console.log('authStore changed');
      this.currentUserSubject.next(this.pb.authStore.model);
    });
  }

  // Expose the PocketBase instance if needed elsewhere
  get pocketbase() {
    return this.pb;
  }

  // Get the current user synchronously
  get currentUserValue() {
    return this.currentUserSubject.value;
  }

  // Login method
  async login(email: string, password: string) {
    try {
      const user = await this.pb.collection('users').authWithPassword(email, password);
      this.currentUserSubject.next(this.pb.authStore.model);
      return user;
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  }

  async signUp(email: string, password: string, confirmPassword: string, name :string) {
    try {
      const newUser = {
        email: email,
        password: password,
        passwordConfirm: confirmPassword,
        name: name,
      }
      console.log(newUser);
      const record = await this.pb.collection('users').create(newUser);
      await this.login(email, password)
    } catch (error) {
      console.error('Signup failed', error)
    }
  }

  // Logout method
  logout() {
    this.pb.authStore.clear();
    this.currentUserSubject.next(null);
  }
}
