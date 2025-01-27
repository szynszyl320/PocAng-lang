import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import PocketBase from 'pocketbase';

@Injectable({
  providedIn: 'root',
})

export class AuthService {

  pb = new PocketBase(JSON.parse(localStorage.getItem('apiUrl') || 'http://127.0.0.1') || undefined);

  private currentUserSubject = new BehaviorSubject<any>(this.pb.authStore.record);
  public currentUser$ :Observable<any> = this.currentUserSubject.asObservable();

  constructor() {
    console.log(localStorage.getItem('apiUrl'));
    
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

  // checked
  async login(email: string, password: string) {
    try {
      const authData = await this.pb.collection('users').authWithPassword(email, password);
      this.currentUserSubject.next(null);
      this.currentUserSubject.next(this.pb.authStore.record);
      return authData;
    } catch (error) {
      throw error;
    }
  }

  initializePocketBase(): Promise<void> {
    return new Promise<void>((resolve) => {
      console.log('Starting PocketBase initialization');
      fetch('assets/runtime.json')
        .then(response => response.json())
        .then(config => {
          if (!config?.API_URL) {
            throw new Error('Invalid config: missing API_URL');
          }
          const apiUrl = 'http://' + config.API_URL;
          console.log('Found API URL:', apiUrl);
          localStorage.setItem('apiUrl', JSON.stringify(apiUrl));
          resolve();
        })
        .catch(error => {
          console.error('Initialization failed:', error);
          resolve();
        });
    });
  }

  async getDefaultIconAsFile(type: string): Promise<File> {
    let defaultIconUrl = '';
    if (type == 'user') {
      defaultIconUrl = '../../assets/images/user.png';
    } else if (type == 'group') {
      defaultIconUrl = '../../assets/images/group.png'
    } else {
      defaultIconUrl = '../../assets/images/wordset.png'
    }
    
    const response = await fetch(defaultIconUrl);
    const blob = await response.blob();
    return new File([blob], `${type}.png`, { type: 'image/png' });
  }

  //checked
  async signUp(email: string, password: string, confirmPassword: string, name: string, icon: File | null) {
    try {
      const avatarFile = icon || await this.getDefaultIconAsFile('user');
      
      const newUser = {
        email: email,
        password: password,
        passwordConfirm: confirmPassword,
        name: name,
        emailVisibilty: true,
        avatar: avatarFile
      }
      const record = await this.pb.collection('users').create(newUser);
      await this.login(email, password);
      return record;
    } catch (error) {
      throw error;
    }
  }

  getAvatar(user: any) {
    const record = this.pb.files.getURL(user, user.avatar, {'thumb': '100x100'});
    return record;
  }

  //checked
  logout() {
    this.pb.authStore.clear();
    this.currentUserSubject.next(null);
  }

  //checked
  async updateAccount(emailVisibilty: boolean, name: string, user: any, icon: File) {
    try {
      const userData = {   
        emailVisibility: ((emailVisibilty != null)? emailVisibilty : user.emailVisibilty),
        name: ((name != null && name !='')? name : user.name),
        avatar: ((icon != null)? icon: user.avatar)
      }
      const record = await this.pb.collection('users').update(user.id, userData);
      return record;
    } catch (error) {
      throw error;
    }
  }

  //checked
  async updatePassword(password: string, oldPassword: string, userId: any) {
    try {
      const record = await this.pb.collection('users').update(userId, {
        password: password,
        passwordConfirm: password,
        oldPassword: oldPassword
      });
      return record;
    } catch (error) {
      throw error;
    }
  }

  //checked
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

  //checked
  async findUserByEmailName(email: string, name: string) {
    try {
      const user = await this.pb.collection('users').getFirstListItem(`email = "${email}" && name="${name}"`)
      return user;
    } catch (error) {
      throw error;
    }
  }

  //checked
  async createNewGroup(name: string, icon: File | null, ownerId: string, users: Array<string>) {
    try {
      const iconFile = icon || await this.getDefaultIconAsFile('group');

      const groupData = {
        "name": name,
        "icon": iconFile,
        "ownerId": ownerId,
        "users": users
      }
      const record = await this.pb.collection('groups').create(groupData);
    } catch (error) {
      throw error;
    }
  }

  //checked
  async updateGroup(group: any, name: string, icon: File, users: Array<any>) {
    try {
      const groupData = {
        "name": ((name != null && name != '')? name : group.name),
        "icon": ((icon != null)? icon : group.icon),
        "users": ((users != null)? users : group.users)
      }      
      const record = await this.pb.collection('groups').update(group.id, groupData);
    } catch (error) {
      throw error;
    }
  }

  public getGroupIcon(group: any) {
    const record = this.pb.files.getURL(group, group.icon, {'thumb': '50x50'});
    return record;
  }

  async deleteGroup(groupId: string) {
    try {
      const record = await this.pb.collection('groups').delete(groupId);
    } catch (error) {
      throw error;
    }
  }

  //checked
  async getUserWordsets(userId: string) {
    try {
      const record = await this.pb.collection('wordset').getList(1, 50, {
        filter: `creatorId = "${userId}"`
      })
      return record;
    } catch (error) {
      throw error;
    }
  }

  //checked
  async createWordset(userId: string, name: string, icon: File | null, language: string, wordlist: Array<any> | null) {
    try {
      const iconFile = icon || await this.getDefaultIconAsFile('wordset');

      const wordsetData = {
        "name": name,
        "icon": iconFile,
        "language": language,
        "creatorId": userId,
        "wordlist": ((wordlist != null)? wordlist : [])
      }
      this.pb.collection('wordset').create(wordsetData);
    } catch (error) {
      throw error;
    }
  }

  //checked
  async updateWordset(wordset: any, name: string, icon: File, language: string, wordlist: Array<any> | null) {
    try {
      const newWordsetData = {
        "name": ((name != null && name != '')? name : wordset.name),
        "icon": ((icon != null)? icon : wordset.icon),
        "language": ((language != null && language != '')? language : wordset.language),
        "wordlist": ((wordlist == null)? wordset.wordlist : wordlist)
      }
      const record = this.pb.collection('wordset').update(wordset.id, newWordsetData);
    } catch (error) {
      throw error;
    }
  }

  async deleteWordset(wordsetId: string) {
    try {
      const record = this.pb.collection('wordset').delete(wordsetId);
      return record;
    } catch (error) {
      throw error;
    }
  }

  
  public getWordsetIcon(wordset: any) {
    const record = this.pb.files.getURL(wordset, wordset.icon, {'thumb': '50x50'});
    return record;
  }

  //checked
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

  //checked
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

  //checked
  async revokeAccessToUser(recordId: string) {
    try {
      const record = await this.pb.collection('wordset_access_user').delete(recordId);
      return record;
    } catch (error) {
      throw error;
    }
  }

  //checked
  async findGroupByName(name: string) {
    try {
      const group = await this.pb.collection('groups').getFirstListItem(`name = "${name}"`);
      return group;
    } catch (error) {
      throw error;
    }
  }
  
  //checked
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

  //checked
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

  //checked
  async revokeAccessToGroup(recordId: string) {
    try {
      const record = await this.pb.collection('wordset_access_group').delete(recordId);
      return record;
    } catch (error) {
      throw error;
    }
  }

  //checked
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

  //checked
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

  //checked
  async createActivity(userId: string) {
    try {
      const data = {
        userId: userId,
        count: 1
      }
      const record = await this.pb.collection('user_activity').create(data);
      return record;
    } catch (error) {
      throw error;
    }
  }

  async updateActivity(activity: any) {
    try {
      const updateData = {
        count: activity.count+1
      }
      const record = await this.pb.collection('user_activity').update(activity.id, updateData);
    } catch (error) {
      throw error;
    }
  }

  async getUserActivity(userId: string) {
    try {
      const records = await this.pb.collection('user_activity').getList(1, 50, {
        filter: `userId = "${userId}"`
      })
      return records;
    } catch (error) {
      throw error;
    }
  }

}


