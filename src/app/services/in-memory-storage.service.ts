import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  username: string;
  password: string;
}

export interface Player {
  id: number;
  name: string;
  idType: string;
  idNumber: string;
  contactNumber: string;
  status: 'active' | 'inactive';
  lastActive: Date;
}

export interface Game {
  id: number;
  gameType: string;
  tableNumber: string;
  minBuyIn: number;
  maxBuyIn: number;
  startTime: Date;
  endTime?: Date;
  status: 'active' | 'ended';
  players: GamePlayer[];
  createdBy: string;
}

export interface GamePlayer {
  playerId: number;
  playerName: string;
  buyIn: number;
  cashOut?: number;
  status: 'active' | 'left';
  joinTime: Date;
  leaveTime?: Date;
}

export interface Payment {
  id: number;
  playerId: number;
  playerName: string;
  amount: number;
  type: 'credit' | 'debit';
  gameId?: number;
  timestamp: Date;
  createdBy: string;
}

@Injectable({
  providedIn: 'root'
})
export class InMemoryStorageService {
  private readonly ADMIN_USER: User = {
    username: 'VTP',
    password: 'VTPS@2025'
  };

  private players = new BehaviorSubject<Player[]>([]);
  private games = new BehaviorSubject<Game[]>([]);
  private payments = new BehaviorSubject<Payment[]>([]);

  // Auth methods
  validateLogin(username: string, password: string): boolean {
    return username === this.ADMIN_USER.username && password === this.ADMIN_USER.password;
  }

  // Players methods
  getPlayers(): Observable<Player[]> {
    return this.players.asObservable();
  }

  addPlayer(player: Omit<Player, 'id'>): void {
    const currentPlayers = this.players.value;
    const newPlayer = {
      ...player,
      id: Math.max(...currentPlayers.map(p => p.id), 0) + 1,
      lastActive: new Date()
    };
    this.players.next([...currentPlayers, newPlayer]);
  }

  updatePlayer(id: number, player: Partial<Player>): void {
    const currentPlayers = this.players.value;
    const index = currentPlayers.findIndex(p => p.id === id);
    if (index !== -1) {
      currentPlayers[index] = { ...currentPlayers[index], ...player };
      this.players.next([...currentPlayers]);
    }
  }

  // Games methods
  getGames(): Observable<Game[]> {
    return this.games.asObservable();
  }

  addGame(game: Omit<Game, 'id'>): void {
    const currentGames = this.games.value;
    const newGame = {
      ...game,
      id: Math.max(...currentGames.map(g => g.id), 0) + 1
    };
    this.games.next([...currentGames, newGame]);
  }

  updateGame(id: number, game: Partial<Game>): void {
    const currentGames = this.games.value;
    const index = currentGames.findIndex(g => g.id === id);
    if (index !== -1) {
      currentGames[index] = { ...currentGames[index], ...game };
      this.games.next([...currentGames]);
    }
  }

  endGame(id: number, playerCashouts: { playerId: number, cashOut: number }[]): void {
    const currentGames = this.games.value;
    const gameIndex = currentGames.findIndex(g => g.id === id);
    
    if (gameIndex !== -1) {
      const game = currentGames[gameIndex];
      game.status = 'ended';
      game.endTime = new Date();
      
      // Update player cashouts
      game.players = game.players.map(player => {
        const cashout = playerCashouts.find(c => c.playerId === player.playerId);
        if (cashout) {
          return {
            ...player,
            cashOut: cashout.cashOut,
            status: 'left',
            leaveTime: new Date()
          };
        }
        return player;
      });

      this.games.next([...currentGames]);

      // Add payment records for each cashout
      playerCashouts.forEach(cashout => {
        const player = game.players.find(p => p.playerId === cashout.playerId);
        if (player) {
          this.addPayment({
            playerId: cashout.playerId,
            playerName: player.playerName,
            amount: cashout.cashOut,
            type: 'debit',
            gameId: game.id,
            timestamp: new Date(),
            createdBy: 'VTP'
          });
        }
      });
    }
  }

  // Payments methods
  getPayments(): Observable<Payment[]> {
    return this.payments.asObservable();
  }

  addPayment(payment: Omit<Payment, 'id'>): void {
    const currentPayments = this.payments.value;
    const newPayment = {
      ...payment,
      id: Math.max(...currentPayments.map(p => p.id), 0) + 1
    };
    this.payments.next([...currentPayments, newPayment]);
  }
} 