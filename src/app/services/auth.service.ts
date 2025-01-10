import { Injectable } from '@angular/core';
import { EmailValidator } from '@angular/forms';
import PocketBase from 'pocketbase';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  private pb = new PocketBase('http://127.0.0.1:8090');

  // BehaviorSubject to track the current user (like Svelte's `writable`)
  private currentUserSubject = new BehaviorSubject<any>(this.pb.authStore.record);
  public currentUser$ :Observable<any> = this.currentUserSubject.asObservable();

  constructor() {
    this.pb.authStore.onChange(() => {
      console.log('authStore changed');
      this.currentUserSubject.next(this.pb.authStore.record);
    });
  }

  get pocketbase() {
    return this.pb;
  }

  get currentUserValue() {
    return this.currentUserSubject.value;
  }

  async login(email: string, password: string) {
    try {
      const user = await this.pb.collection('users').authWithPassword(email, password);
      this.currentUserSubject.next(this.currentUserSubject);
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
        verified: true
      }
      const record = await this.pb.collection('users').create(newUser);
      await this.login(email, password)
    } catch (error) {
      console.error('Signup failed', error)
    }
  }

  logout() {
    this.pb.authStore.clear();
    this.currentUserSubject.next(null);
  }

  async updateAccount(emailVisibilty: boolean, name: string, user: any) {
    const userData = {   
      // email: ((email != null)? email: user.email),
      emailVisibility: ((emailVisibilty != null)? emailVisibilty : user.emailVisibilty),
      name: ((name != null)? name : user.name),
    }
    const record = await this.pb.collection('users').update(user.id, userData);
  }

  async updatePassword(password: string, oldPassword: string, user: any) {
    const record = await this.pb.collection('users').update(user.id, {
      password: password,
      passwordConfirm: password,
      oldPassword: oldPassword
    })
  }

}
