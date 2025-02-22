import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

export interface Game {
  id: number;
  gameType: string;
  tableNumber: number;
  minBuyIn: number;
  maxBuyIn: number;
  players: GamePlayer[];
  status: 'active' | 'finished';
  startTime: Date;
  createdBy: string;
  endTime?: Date;
}

export interface GamePlayer {
  id: number;
  name: string;
  totalBuyIn: number;
  cashOut?: number;
  profit?: number;
  status: 'playing' | 'cashed_out';
}

@Injectable({
  providedIn: 'root'
})
export class GamesService {
  private apiUrl = 'api/games'; // Replace with your actual API endpoint

  constructor(private http: HttpClient) { }

  // For now, return mock data
  getGames(): Observable<Game[]> {
    const mockGames: Game[] = [
      {
        id: 1,
        gameType: 'Texas Hold\'em',
        tableNumber: 1,
        minBuyIn: 5000,
        maxBuyIn: 25000,
        players: [
          {
            id: 1,
            name: 'Rahul Sharma',
            totalBuyIn: 10000,
            status: 'playing'
          },
          {
            id: 2,
            name: 'Priya Patel',
            totalBuyIn: 15000,
            status:'playing'
          },
          {
            id: 7,
            name: 'Rajesh Verma',
            totalBuyIn: 20000,
            cashOut: 25000,
            status:'cashed_out',
          }
        ],
        status: 'active',
        startTime: new Date('2023-07-20T18:30:00'),
        createdBy: 'Admin'
      },
      {
        id: 2,
        gameType: 'Omaha',
        tableNumber: 2,
        minBuyIn: 10000,
        maxBuyIn: 50000,
        players: [
          {
            id: 5,
            name: 'Vikram Singh',
            totalBuyIn: 25000,
            cashOut:20000,
            status:'cashed_out'
          },
          {
            id: 8,
            name: 'Anita Desai',
            totalBuyIn: 30000,
            cashOut:32000,
            status:'cashed_out'
          }
        ],
        status: 'finished',
        startTime: new Date('2023-07-19T14:00:00'),
        endTime: new Date('2023-07-19T20:00:00'),
        createdBy: 'Admin'
      },
      {
        id: 3,
        gameType: 'Texas Hold\'em',
        tableNumber: 3,
        minBuyIn: 2000,
        maxBuyIn: 10000,
        players: [
          {
            id: 1,
            name: 'Rahul Sharma',
            totalBuyIn: 5000,
            cashOut: 7000,
            status:'cashed_out'
          },
          {
            id: 9,
            name: 'Suresh Iyer',
            totalBuyIn: 8000,
            cashOut:4000,
            status:'cashed_out'
          },
          {
            id: 2,
            name: 'Priya Patel',
            totalBuyIn: 7000,
            cashOut:4500,
            status:'cashed_out'
          },
          {
            id: 8,
            name: 'Anita Desai',
            totalBuyIn: 10000,
            cashOut: 2000,
            status:'cashed_out'
          }
        ],
        status: 'finished',
        startTime: new Date('2023-07-18T16:00:00'),
        endTime: new Date('2023-07-18T23:00:00'),
        createdBy: 'Admin'
      },
      {
        id: 4,
        gameType: 'Seven Card Stud',
        tableNumber: 1,
        minBuyIn: 5000,
        maxBuyIn: 20000,
        players: [
          {
            id: 7,
            name: 'Rajesh Verma',
            totalBuyIn: 15000,
            cashOut:15000,
            status:'cashed_out'
          },
          {
            id: 5,
            name: 'Vikram Singh',
            totalBuyIn: 20000,
            cashOut:20000,
            status:'cashed_out'
          },
          {
            id: 9,
            name: 'Suresh Iyer',
            totalBuyIn: 12000,
            cashOut:11000,
            status:'cashed_out'
          }
        ],
        status: 'finished',
        startTime: new Date('2023-07-17T19:00:00'),
        endTime: new Date('2023-07-18T01:00:00'),
        createdBy: 'Admin'
      },
      {
        id: 5,
        gameType: 'Omaha',
        tableNumber: 2,
        minBuyIn: 15000,
        maxBuyIn: 75000,
        players: [
          {
            id: 1,
            name: 'Rahul Sharma',
            totalBuyIn: 25000,
            cashOut: 27000,
            status:'cashed_out'
          },
          {
            id: 5,
            name: 'Vikram Singh',
            totalBuyIn: 50000,
            cashOut:48000,
            status:'cashed_out'
          },
          {
            id: 8,
            name: 'Anita Desai',
            totalBuyIn: 35000,
            cashOut:32000,
            status:'cashed_out'
          }
        ],
        status: 'finished',
        startTime: new Date('2023-07-16T15:00:00'),
        endTime: new Date('2023-07-16T22:00:00'),
        createdBy: 'Admin'
      }
    ];

    return of(mockGames);
  }

  getGameTypes(): Observable<string[]> {
    return of(['Texas Hold\'em', 'Omaha', 'Seven Card Stud']);
  }

  createGame(gameData: any): Observable<Game> {
    return this.http.post<Game>(this.apiUrl, gameData);
  }

  // Add endGame method
  endGame(gameId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${gameId}/end`, {});
  }

  // Add method to get game details
  getGameDetails(gameId: number): Observable<Game> {
    return this.http.get<Game>(`${this.apiUrl}/${gameId}`);
  }

  // Add method to update game players
  updateGamePlayers(gameId: number, playerData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${gameId}/players`, playerData);
  }
} 