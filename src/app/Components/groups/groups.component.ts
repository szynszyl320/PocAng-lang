import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service'
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [FormsModule, TranslateModule],
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.css'
})

export class GroupsComponent {

  currentUser: any;

  groupName: string = '';
  groupIcon: any;
  
  userIdList: Array<string> = [];
  userList: Array<any> = [];
  
  userEmail: string = '';
  userName: string = '';
  
  groupList: Array<any> = [];
  
  addUserEmail: string = '';
  addUserName: string = '';
  
  selectedGroup: any;
  
  groupEditName: string = '';
  groupEditIcon: any;
  editGroupIndex: any;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
    this.getUserGroups();
  }

  async getSpecificUser(event: Event) {
    event.preventDefault();
    try {
      const user = await this.authService.findUserByEmailName(this.userEmail, this.userName);
      
      this.userIdList.push(user.id); 
      this.userList.push(user)
      
      this.userEmail = '';
      this.userName = '';
      
    } catch (error) {
      console.error('failed to find user: ', error);
      alert('No user was found')
    }
  }

  async createNewGroup(event: Event) {
    event.preventDefault();
    try {
      this.authService.createNewGroup(this.groupName, this.groupIcon, this.currentUser.id, this.userIdList);
      
      this.groupName = '';
      this.groupIcon = null;
      this.userIdList = [];
      this.userList = [];
    
    } catch (error) {
      console.error('Failed to create group:', error); 
      alert('group could not be created');
    }
  }

  async getUserGroups() {
    try {
      this.groupList = (await this.authService.getOwnedGroups(this.currentUser)).items;
    } catch (error) {
      console.error('Failed to fetch any groups', error);
      alert('failed to find any groups');
    }
  }    

  async updateGroup(group: any, groupName: string, groupIcon: File, users: Array<any>) {
    try {
      this.authService.updateGroup(group, groupName, groupIcon, users);
    } catch (error) {
      console.error('Failed to update', error);
      alert(`failed to update ${groupName}`)
    }
  }
  
  removeFromGroup(group: any, userIndex: number) {
    try {
      group.users.splice(userIndex, 1)
      this.updateGroup(group, group.name, group.icon, group.users); 
      this.getUserGroups();
    } catch (error) {
      console.error('failed to log error', error);
      alert('faild to remove user')
    }
  }

  async addToGroup(event: Event) {
    event.preventDefault();
    try {
      const user = await this.authService.findUserByEmailName(this.addUserEmail, this.addUserName);
      const selectedGroup = this.groupList[this.selectedGroup]
      selectedGroup.users.push(user.id);
      
      this.updateGroup(selectedGroup, selectedGroup.name, selectedGroup.icon, selectedGroup.users)
      
      this.selectedGroup = '';
      this.addUserEmail = '';
      this.addUserName = '';
      
      this.getUserGroups();
    } catch (error) {
      console.log('failed to add user', error);
      alert(`failed to add ${this.addUserName} to ${this.selectedGroup.name}`)
    }
  }

  groupIconSet(group: any) {
    return this.authService.getGroupIcon(group);
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.groupIcon = file;
      this.groupEditIcon = file;
    }
  }

}
