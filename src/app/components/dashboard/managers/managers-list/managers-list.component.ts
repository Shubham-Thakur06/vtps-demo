import { Component, OnInit } from '@angular/core';
import { ManagersService } from '../../../../services/managers.service';
import { ManagerDialogComponent } from '../manager-dialog/manager-dialog.component';

interface Manager {
  id: number;
  firstName: string;
  lastName: string;
  idType: string;
  idNumber: string;
  contactNumber: string;
  status: 'active' | 'inactive';
}

@Component({
  selector: 'app-managers-list',
  templateUrl: './managers-list.component.html',
  styleUrls: ['./managers-list.component.scss']
})
export class ManagersListComponent implements OnInit {
  managers: Manager[] = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      idType: 'AADHAR',
      idNumber: 'XXXX-XXXX-1234',
      contactNumber: '9876543210',
      status: 'active'
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      idType: 'PAN',
      idNumber: 'ABCDE1234F',
      contactNumber: '9876543211',
      status: 'active'
    },
    {
      id: 3,
      firstName: 'Mike',
      lastName: 'Johnson',
      idType: 'DRIVING_LICENSE',
      idNumber: 'DL123456789',
      contactNumber: '9876543212',
      status: 'inactive'
    }
  ];
  
  filteredManagers: Manager[] = [];
  searchTerm = '';
  statusFilter = 'all';
  showDialog = false;
  selectedManager: Manager | null = null;

  constructor(private managersService: ManagersService) {}

  ngOnInit() {
    this.filterManagers();
  }

  filterManagers() {
    this.filteredManagers = this.managers.filter(manager => {
      const matchesSearch = 
        `${manager.firstName} ${manager.lastName}`
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase()) ||
        manager.idNumber.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        manager.contactNumber.includes(this.searchTerm);

      const matchesStatus = 
        this.statusFilter === 'all' || 
        manager.status === this.statusFilter;

      return matchesSearch && matchesStatus;
    });
  }

  openAddManager() {
    this.selectedManager = null;
    this.showDialog = true;
  }

  editManager(manager: Manager) {
    this.selectedManager = manager;
    this.showDialog = true;
  }

  resetPassword(manager: Manager) {
    if (confirm(`Are you sure you want to reset password for ${manager.firstName} ${manager.lastName}?`)) {
      this.managersService.resetPassword(manager.id).subscribe(
        () => {
          alert('Password reset successful');
        },
        error => {
          alert('Failed to reset password');
        }
      );
    }
  }

  onManagerSaved() {
    this.showDialog = false;
    this.filterManagers();
  }

  onDialogClosed() {
    this.showDialog = false;
  }
} 