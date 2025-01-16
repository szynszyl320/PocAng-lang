import { Injectable, reflectComponentType } from '@angular/core';
import PocketBase, { ListResult, RecordModel } from 'pocketbase';
import { BehaviorSubject, filter, groupBy, Observable, toArray } from 'rxjs';

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

  async getOwnedGroups(user: any) {
    try {
      const groups = await (this.pb.collection('groups').getList(1, 50, { 
        filter: `ownerId = "${user.id}"`,
        expand: 'users' 
      }))
      return groups;
    } catch (error) {
      throw error;
    }
  }

  async findUserByEmailName(email: string, name: string) {
    try {
      const user = await this.pb.collection('users').getFirstListItem(`email = "${email}" && name="${name}"`)
      return user;
    } catch (error) {
      throw error;
    }
  }

  async createNewGroup(name: string, icon: File, owner: any, users: Array<string>) {
    try {
      const groupData = {
        "name": name,
        "icon": icon,
        "ownerId": owner.id,
        "users": users
      }
      const record = await this.pb.collection('groups').create(groupData);
    } catch (error) {
      throw error;
    }
  }

  async updateGroup(group: any, name: string, icon: File, users: Array<any>) {
    try {
      const groupData = {
        "name": ((name != null)? name : group.name),
        "icon": ((icon != null)? icon : group.icon),
        "users": ((users != null)? users : group.users)
      }      
      const record = await this.pb.collection('groups').update(group.id, groupData);
    } catch (error) {
      throw error;
    }
  }

  async getUserWordsets(user: any) {
    try {
      const record = await this.pb.collection('wordset').getList(1, 50, {
        filter: `creatorId = "${user.id}"`
      })
      return record;
    } catch (error) {
      throw error;
    }
  }

  async createWordset(userId: string, name: string, icon: File, language: string) {
    try {
      const wordsetData = {
        "name": name,
        "icon": icon,
        "language": language,
        "creatorId": userId
      }
      this.pb.collection('wordset').create(wordsetData);
    } catch (error) {
      throw error;
    }
  }

  async updateWordset(wordset: any, name: string, icon: File, language: string, wordlist: Array<any>) {
    try {
      const newWordsetData = {
        "name": ((name != null)? name : wordset.name),
        "icon": ((icon != null)? icon : wordset.icon),
        "language": ((language != null)? language : wordset.language),
        "wordlist": ((wordlist != null)? wordlist : wordset.wordlist)
      }
      const record = this.pb.collection('wordset').update(wordset.id, newWordsetData);
    } catch (error) {
      throw error;
    }
  }

  async getUserAccesses(wordsetId: any) {
    try {
      const record = await this.pb.collection('wordset_access_user').getList(1, 50, {
        filter: `wordsetId = "${wordsetId}"`,
        expand: 'userId,wordsetId'
      });
      return record;
    } catch (error) {
      throw error;
    }
  }

  async grantAccessToUser(wordsetId: string, userId: string) {
    try {
      const accessData = {
        wordsetId: wordsetId,
        userId: userId
      }
      const record = await this.pb.collection('wordset_access_user').create(accessData);
      return record;  
    } catch (error) {
      throw error;
    }
  }

  async revokeAccessToUser(recordId: string) {
    try {
      const record = await this.pb.collection('wordset_access_user').delete(recordId);
      return record;
    } catch (error) {
      throw error;
    }
  }

  async findGroupByName(name: string) {
    try {
      const group = await this.pb.collection('groups').getFirstListItem(`name = "${name}"`);
      return group;
    } catch (error) {
      throw error;
    }
  }
  
  async getGroupsAccess(wordsetId: string) {
    try {
      const record = await this.pb.collection('wordset_access_group').getList(1, 50, {
        filter: `wordsetId = "${wordsetId}"`,
        expand: "groupId,wordsetId"
      })
      return record;
    } catch (error) {
      throw error;
    }
  }

  async grantAccessToGroup(wordsetId: string, groupId: string) {
    try {
      const accessData = {
        wordsetId: wordsetId,
        groupId: groupId
      }
      const record = await this.pb.collection('wordset_access_group').create(accessData);
      return record;
    } catch (error) {
      throw error;
    }
  }

  async revokeAccessToGroup(recordId: string) {
    try {
      const record = await this.pb.collection('wordset_access_group').delete(recordId);
      return record;
    } catch (error) {
      throw error;
    }
  }

  async getUserAccessedWordsets(userId: string) {
    try {
      const record = await this.pb.collection('wordset_access_user').getList(1, 50, {
        filter: `userId = "${userId}"`,
        expand: `userId,wordsetId`
      })
      return record;
    } catch (error) {
      throw error;
    }
  }

  async getGroupAccessedWordsets(userId: string) {
    try {
      const records = await this.pb.collection('wordset_access_group').getList(1, 50, {
        expand: 'groupId,wordsetId',
      })
      const filteredRecords = records.items.filter((record: any) =>
        record.expand.groupId.users.includes(userId)
      );
      return filteredRecords;
    } catch (error) {
      throw error;
    }
  }

  async createActivity(userId: string) {
    try {
      const data = {
        userId: userId
      }
      const record = await this.pb.collection('user_activity').create(data);
      return record;
    } catch (error) {
      throw error;
    }
  }

}

