import { Component, input, output } from '@angular/core';
import { AuthService } from '../../services/auth.service'
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { toObservable } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-useraccess',
  standalone: true,
  imports: [FormsModule, TranslateModule],
  templateUrl: './access.component.html',
  styleUrl: './access.component.css'
})
export class UseraccessComponent {

  currentUser: any;
  wordsetObject: any;
  wordsetId: string = '';

  wordset = input<any>();
  wordset$ = toObservable(this.wordset);

  userAccessList: Array<any> = [];
  groupAccessList: Array<any> = [];

  userName: string = '';
  userEmail: string = '';

  groupName: string = '';

  componentClose = output<boolean>();

  refreshWordsets = output<boolean>();

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
    this.wordset$.subscribe(value => {
      this.wordsetObject = value
      this.getUsersWithAccess();      
      this.getGroupsWithAccess();
      this.wordsetId = this.wordsetObject.id;
    })  
  }

  async getUsersWithAccess() {
    try {
      const wordsets = (await this.authService.getUserAccesses(this.wordsetObject.id)).items;
      this.userAccessList = wordsets;
    } catch (error) {
      console.error('Failed to retrieve userlist: ', error);
    }
  }

  async grantUserAccess(event: Event) {
    event.preventDefault()
    try {
      const user = await this.authService.findUserByEmailName(this.userEmail, this.userName);
      this.authService.grantAccessToUser(this.wordsetId, user.id); 
      
      this.userName = '';
      this.userEmail = '';
      
      this.getUsersWithAccess();
    } catch (error) {
      console.error('Failed to grant access', error);
      alert(`Fialed to grant access to ${this.userEmail}`)
    }
  }

  async revokeUserAccess(id: string, event: Event) {
    event.preventDefault()
    try {
      const user = await this.authService.revokeAccessToUser(id);
      this.getUsersWithAccess();
    } catch (error) {
      console.error('Failed to revoke access', error);
      alert(`Failed to revoke access from user`)
    }
  }

  async getGroupsWithAccess() {
    try {
      const groups = (await this.authService.getGroupsAccess(this.wordsetObject.id)).items
      this.groupAccessList = groups;
    } catch (error) {
      console.error('failed to get groups', error);
    }
  }

  async grantGroupAccess(event: Event) {
    event.preventDefault();
    try {
      const group = await this.authService.findGroupByName(this.groupName);
      const record = this.authService.grantAccessToGroup(this.wordsetId, group.id);
      
      this.groupName = '';
      
      this.getGroupsWithAccess();
    } catch (error) {
      console.error('failed to grant access', error);
      alert(`failed to grant access to ${this.groupName}`)
    }
  }

  async revokeGroupAccess(event: Event, id: string) {
    event.preventDefault()
    try {
      const group = await this.authService.revokeAccessToGroup(id);
      this.getGroupsWithAccess();
    } catch (error) {
      console.error('failed to revoke access', error);
      alert('failed to revoke access from group')
    }
  }

  closeWindow() {
    this.componentClose.emit(false);
  }

  async groupIconSet(group: any) {
    return this.authService.getGroupIcon(group);
  }

}

