import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

interface Player {
  id: number;
  name: string;
  idType: 'AADHAR' | 'PAN' | 'DRIVING_LICENSE';
  idNumber: string;
  contactNumber: string;
  lastActive: Date;
  settlementBalance: number;
  status: 'active' | 'inactive';
}

@Injectable({
  providedIn: 'root'
})
export class PlayersService {
  constructor(private http: HttpClient) {}

  // Mock data for players
  getPlayers(): Observable<Player[]> {
    const mockPlayers: Player[] = [
      {
        id: 1,
        name: 'Rahul Sharma',
        idType: 'AADHAR',
        idNumber: '1234-5678-9012',
        contactNumber: '+91-9876543210',
        lastActive: new Date('2023-07-20'),
        settlementBalance: 5000,
        status: 'active'
      },
      {
        id: 2,
        name: 'Priya Patel',
        idType: 'PAN',
        idNumber: 'ABCDE1234F',
        contactNumber: '+91-8765432109',
        lastActive: new Date('2023-07-19'),
        settlementBalance: -2000,
        status: 'active'
      },
      {
        id: 3,
        name: 'Amit Kumar',
        idType: 'DRIVING_LICENSE',
        idNumber: 'DL98765432',
        contactNumber: '+91-7654321098',
        lastActive: new Date('2023-07-18'),
        settlementBalance: 8000,
        status: 'inactive'
      },
      {
        id: 4,
        name: 'Sneha Reddy',
        idType: 'AADHAR',
        idNumber: '9876-5432-1098',
        contactNumber: '+91-6543210987',
        lastActive: new Date('2023-07-20'),
        settlementBalance: -1500,
        status: 'active'
      },
      {
        id: 5,
        name: 'Vikram Singh',
        idType: 'PAN',
        idNumber: 'FGHIJ5678K',
        contactNumber: '+91-5432109876',
        lastActive: new Date('2023-07-17'),
        settlementBalance: 12000,
        status: 'active'
      },
      {
        id: 6,
        name: 'Neha Gupta',
        idType: 'AADHAR',
        idNumber: '5678-9012-3456',
        contactNumber: '+91-4321098765',
        lastActive: new Date('2023-07-16'),
        settlementBalance: -3000,
        status: 'inactive'
      },
      {
        id: 7,
        name: 'Rajesh Verma',
        idType: 'DRIVING_LICENSE',
        idNumber: 'DL12345678',
        contactNumber: '+91-3210987654',
        lastActive: new Date('2023-07-20'),
        settlementBalance: 6000,
        status: 'active'
      },
      {
        id: 8,
        name: 'Anita Desai',
        idType: 'PAN',
        idNumber: 'LMNOP9012Q',
        contactNumber: '+91-2109876543',
        lastActive: new Date('2023-07-19'),
        settlementBalance: 4500,
        status: 'active'
      },
      {
        id: 9,
        name: 'Suresh Iyer',
        idType: 'AADHAR',
        idNumber: '3456-7890-1234',
        contactNumber: '+91-1098765432',
        lastActive: new Date('2023-07-18'),
        settlementBalance: -5000,
        status: 'active'
      },
      {
        id: 10,
        name: 'Meera Kapoor',
        idType: 'DRIVING_LICENSE',
        idNumber: 'DL45678901',
        contactNumber: '+91-9087654321',
        lastActive: new Date('2023-07-15'),
        settlementBalance: 9000,
        status: 'inactive'
      }
    ];

    return of(mockPlayers);
  }

  // We'll implement these methods later
  addPlayer(player: Partial<Player>): Observable<Player> {
    return of({ id: Math.random(), status: 'active', ...player } as Player);
  }

  updatePlayer(player: Player): Observable<Player> {
    return of(player);
  }

  togglePlayerStatus(playerId: number): Observable<Player> {
    return of({ id: playerId } as Player);
  }

  // Add this new method for getting available players
  getAvailablePlayers(): Observable<Player[]> {
    // Get all players and filter only active ones
    return this.getPlayers().pipe(
      map(players => players.filter(player => player.status === 'active'))
    );
  }
} 