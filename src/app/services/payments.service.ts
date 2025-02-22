import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Payment } from '../components/dashboard/payments/payments.component';

interface PaymentsResponse {
  payments: Payment[];
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {
  constructor(private http: HttpClient) {}

  // Mock data for now
  getPayments(page: number, pageSize: number, searchTerm: string = ''): Observable<PaymentsResponse> {
    const mockPayments: Payment[] = [
      {
        id: 1,
        playerId: 1,
        playerName: 'John Doe',
        type: 'PLAYER_TO_HOUSE',
        amount: 5000,
        date: new Date(2024, 2, 15, 14, 30),
        recordedBy: 'Admin'
      },
      {
        id: 2,
        playerId: 2,
        playerName: 'Jane Smith',
        type: 'HOUSE_TO_PLAYER',
        amount: 2500,
        date: new Date(2024, 2, 14, 13, 45),
        recordedBy: 'Manager'
      },
      // Add more mock data as needed
    ];

    // Filter by search term
    let filtered = mockPayments;
    if (searchTerm) {
      filtered = mockPayments.filter(p => 
        p.playerName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Calculate pagination
    const start = (page - 1) * pageSize;
    const paginatedPayments = filtered.slice(start, start + pageSize);

    return of({
      payments: paginatedPayments,
      total: filtered.length
    });
  }

  addPayment(payment: Omit<Payment, 'id' | 'date'>): Observable<Payment> {
    const newPayment: Payment = {
      ...payment,
      id: Math.random(),
      date: new Date()
    };
    return of(newPayment);
  }
} 