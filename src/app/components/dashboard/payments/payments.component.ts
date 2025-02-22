import { Component, OnInit } from '@angular/core';
import { PaymentsService } from '../../../services/payments.service';
import { PlayersService } from '../../../services/players.service';
import { PaymentDialogComponent } from './payment-dialog/payment-dialog.component';
import { MatDialog } from '@angular/material/dialog';

export interface Payment {
  id: number;
  playerId: number;
  playerName: string;
  type: 'HOUSE_TO_PLAYER' | 'PLAYER_TO_HOUSE';
  amount: number;
  date: Date;
  recordedBy: string;
}

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentsComponent implements OnInit {
  searchTerm: string = '';
  payments: Payment[] = [];
  players: any[] = [];
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  Math = Math; // Add this to use Math in template
  showPaymentDialog = false;

  constructor(
    private paymentsService: PaymentsService,
    private playersService: PlayersService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadPayments();
    this.loadPlayers();
  }

  loadPlayers() {
    this.playersService.getPlayers().subscribe(players => {
      this.players = players;
    });
  }

  loadPayments() {
    this.paymentsService.getPayments(this.currentPage, this.pageSize, this.searchTerm)
      .subscribe(response => {
        this.payments = response.payments;
        this.totalItems = response.total;
      });
  }

  onSearch() {
    this.currentPage = 1; // Reset to first page when searching
    this.loadPayments();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadPayments();
  }

  openPaymentDialog() {
    const dialogRef = this.dialog.open(PaymentDialogComponent, {
      width: '500px',
      maxWidth: '90%',
      disableClose: false,
      backdropClass: 'backdrop-blur'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.handleSavePayment(result);
      }
    });
  }

  handleSavePayment(paymentData: any) {
    this.paymentsService.addPayment({
      ...paymentData,
      recordedBy: 'Admin', // Get from auth service in real implementation
      playerName: this.players.find(p => p.id === paymentData.playerId)?.name
    }).subscribe(() => {
      this.loadPayments();
    });
  }
} 