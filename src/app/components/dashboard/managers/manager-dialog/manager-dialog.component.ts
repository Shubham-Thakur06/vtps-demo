import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ManagersService } from '../../../../services/managers.service';

@Component({
  selector: 'app-manager-dialog',
  templateUrl: './manager-dialog.component.html',
  styleUrls: ['./manager-dialog.component.scss']
})
export class ManagerDialogComponent {
  @Input() show = false;
  @Input() isEdit = false;
  @Input() manager: any = null;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  managerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private managersService: ManagersService
  ) {
    this.managerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      idType: ['', Validators.required],
      idNumber: ['', Validators.required],
      contactNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      status: ['active']
    });
  }

  ngOnChanges() {
    if (this.manager && this.isEdit) {
      this.managerForm.patchValue({
        firstName: this.manager.firstName,
        lastName: this.manager.lastName,
        idType: this.manager.idType,
        idNumber: this.manager.idNumber,
        contactNumber: this.manager.contactNumber,
        status: this.manager.status
      });
    } else {
      this.managerForm.reset({ status: 'active' });
    }
  }

  capitalizeField(field: string) {
    const value = this.managerForm.get(field)?.value;
    if (value) {
      this.managerForm.patchValue({
        [field]: value.toUpperCase()
      });
    }
  }

  toggleStatus(event: any) {
    this.managerForm.patchValue({
      status: event.target.checked ? 'active' : 'inactive'
    });
  }

  onSubmit() {
    if (this.managerForm.valid) {
      const managerData = this.managerForm.value;
      
      if (this.isEdit) {
        this.managersService.updateManager(this.manager.id, managerData)
          .subscribe(() => this.saved.emit());
      } else {
        this.managersService.addManager(managerData)
          .subscribe(() => this.saved.emit());
      }
    }
  }
} 