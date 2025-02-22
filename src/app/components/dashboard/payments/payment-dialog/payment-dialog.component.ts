import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { PlayersService } from '../../../../services/players.service';

@Component({
  selector: 'app-payment-dialog',
  templateUrl: './payment-dialog.component.html',
  styleUrls: ['./payment-dialog.component.scss']
})
export class PaymentDialogComponent implements OnInit {
  paymentForm: FormGroup;
  players: any[] = [];
  filteredPlayers: any[] = [];
  searchTerm: string = '';
  currentStep = 1;

  constructor(
    private dialogRef: MatDialogRef<PaymentDialogComponent>,
    private fb: FormBuilder,
    private playersService: PlayersService
  ) {
    this.paymentForm = this.fb.group({
      playerId: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(1)]],
      type: ['', Validators.required],
      notes: ['']
    });
  }

  ngOnInit() {
    this.loadPlayers();
  }

  loadPlayers() {
    this.playersService.getPlayers().subscribe(players => {
      this.players = players;
      this.filteredPlayers = players;
    });
  }

  filterPlayers() {
    if (!this.searchTerm) {
      this.filteredPlayers = this.players;
    } else {
      this.filteredPlayers = this.players.filter(player =>
        player.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  onSubmit() {
    if (this.paymentForm.valid) {
      this.dialogRef.close(this.paymentForm.value);
    }
  }

  close() {
    this.dialogRef.close();
  }

  selectPaymentType(type: 'PLAYER_TO_HOUSE' | 'HOUSE_TO_PLAYER') {
    this.paymentForm.patchValue({ type });
  }

  selectPlayer(player: any) {
    this.paymentForm.patchValue({ playerId: player.id });
  }

  getSelectedPlayerName(): string {
    const playerId = this.paymentForm.get('playerId')?.value;
    return this.players.find(p => p.id === playerId)?.name || '';
  }

  nextStep() {
    if (this.canProceedToNextStep()) {
      this.currentStep++;
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  canProceedToNextStep(): boolean {
    switch (this.currentStep) {
      case 1:
        return !!this.paymentForm.get('type')?.value;
      case 2:
        return !!this.paymentForm.get('playerId')?.value;
      default:
        return false;
    }
  }

  getPaymentTypeLabel(): string {
    const type = this.paymentForm.get('type')?.value;
    return type === 'PLAYER_TO_HOUSE' ? 'Player to House' : 'House to Player';
  }

  isFormValid(): boolean {
    return this.paymentForm.get('type')?.value && 
           this.paymentForm.get('playerId')?.value && 
           this.paymentForm.get('amount')?.value > 0;
  }
} 