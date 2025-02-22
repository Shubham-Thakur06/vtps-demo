import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// Export the interfaces so they can be used in other components
export interface PlayerFormData {
  id?: number;
  firstName: string;
  lastName: string;
  idType: 'AADHAR' | 'PAN' | 'DRIVING_LICENSE';
  idNumber: string;
  contactNumber: string;
  status: 'active' | 'inactive';
  name?: string;  // Add this for the combined name
}

// Export the interfaces so they can be used in other components
export interface PlayerInputData {
  id?: number;
  name: string;
  idType: 'AADHAR' | 'PAN' | 'DRIVING_LICENSE';
  idNumber: string;
  contactNumber: string;
  status: 'active' | 'inactive';
}

@Component({
  selector: 'app-player-dialog',
  templateUrl: './player-dialog.component.html',
  styleUrls: ['./player-dialog.component.scss']
})
export class PlayerDialogComponent implements OnInit {
  @Input() show = false;
  @Input() playerData: PlayerInputData | null = null;
  @Output() closeModal = new EventEmitter<void>();
  @Output() savePlayer = new EventEmitter<PlayerFormData>();

  playerForm: FormGroup;
  isEdit = false;

  constructor(private fb: FormBuilder) {
    this.playerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      idType: ['', Validators.required],
      idNumber: ['', Validators.required],
      contactNumber: ['', [
        Validators.required,
        Validators.pattern('^[0-9]{10}$')
      ]],
      status: ['active', Validators.required]
    });
  }

  ngOnInit() {
    this.isEdit = !!this.playerData;
    if (this.playerData) {
      const names = this.playerData.name.split(' ');
      const contactNumber = this.playerData.contactNumber.replace('+91', '').trim();
      
      this.playerForm.patchValue({
        firstName: names[0],
        lastName: names.slice(1).join(' '),
        idType: this.playerData.idType,
        idNumber: this.playerData.idNumber,
        contactNumber: contactNumber,
        status: this.playerData.status
      });
    }
  }

  onSubmit() {
    if (this.playerForm.valid) {
      const formValue = this.playerForm.value;
      const playerData: PlayerFormData = {
        ...formValue,
        name: `${formValue.firstName} ${formValue.lastName}`.trim(),
        contactNumber: `+91${formValue.contactNumber}`,
        id: this.playerData?.id
      };
      this.savePlayer.emit(playerData);
      this.close();
    }
  }

  close() {
    this.playerForm.reset();
    this.closeModal.emit();
  }

  toggleStatus(event: any) {
    const newStatus = event.target.checked ? 'active' : 'inactive';
    this.playerForm.patchValue({ status: newStatus });
  }

  capitalizeField(fieldName: 'firstName' | 'lastName' | 'idNumber') {
    const currentValue = this.playerForm.get(fieldName)?.value;
    if (currentValue) {
      // Convert the entire string to uppercase
      const upperValue = currentValue.toString().toUpperCase().trim();
      this.playerForm.patchValue({ [fieldName]: upperValue });
    }
  }

  capitalizeWords(value: string): string {
    return value
      .split(' ')
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
} 