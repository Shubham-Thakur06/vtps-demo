import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GamesService, Game, GamePlayer } from '../../../../services/games.service';
import { PlayersService } from '../../../../services/players.service';

@Component({
  selector: 'app-game-edit-dialog',
  templateUrl: './game-edit-dialog.component.html',
  styleUrls: ['./game-edit-dialog.component.scss']
})
export class GameEditDialogComponent implements OnInit {
  gameData: Game;
  mode: 'view' | 'end';
  searchTerm = '';
  availablePlayers: any[] = [];
  filteredPlayers: any[] = [];
  activePlayers: GamePlayer[] = [];
  cashedOutPlayers: GamePlayer[] = [];
  showAmountInput = false;
  amountType: 'topup' | 'cashout' | null = null;
  amount = 0;
  selectedPlayer: GamePlayer | null = null;

  constructor(
    private dialogRef: MatDialogRef<GameEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private playersService: PlayersService
  ) {
    this.gameData = data.game;
    this.mode = data.mode;
  }

  ngOnInit() {
    if (this.gameData.status === 'finished') {
      // For finished games, all players should be in cashed out list
      this.cashedOutPlayers = this.gameData.players.map(p => ({
        ...p,
        profit: (p.cashOut || 0) - p.totalBuyIn
      }));
      this.activePlayers = [];
    } else {
      this.loadPlayers();
      this.initializeGamePlayers();
    }
  }

  loadPlayers() {
    this.playersService.getAvailablePlayers().subscribe(players => {
      this.availablePlayers = players;
      this.filterPlayers();
    });
  }

  initializeGamePlayers() {
    // Separate players based on their status
    this.activePlayers = this.gameData.players
      .filter(p => p.status === 'playing')
      .map(p => ({
        id: p.id,
        name: p.name,
        totalBuyIn: p.totalBuyIn,
        status: 'playing'
      }));

    this.cashedOutPlayers = this.gameData.players
      .filter(p => p.status === 'cashed_out')
      .map(p => ({
        id: p.id,
        name: p.name,
        totalBuyIn: p.totalBuyIn,
        cashOut: p.cashOut,
        profit: (p.cashOut || 0) - p.totalBuyIn,
        status: 'cashed_out'
      }));
  }

  filterPlayers() {
    if (!this.searchTerm) {
      this.filteredPlayers = this.availablePlayers.filter(player => 
        !this.isPlayerInGame(player)
      );
    } else {
      this.filteredPlayers = this.availablePlayers.filter(player => 
        !this.isPlayerInGame(player) &&
        player.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  isPlayerInGame(player: any): boolean {
    return this.activePlayers.some(p => p.id === player.id) || 
           this.cashedOutPlayers.some(p => p.id === player.id);
  }

  addPlayerToGame(player: any) {
    if (!this.isPlayerInGame(player)) {
      const newPlayer: GamePlayer = {
        id: player.id,
        name: player.name,
        totalBuyIn: this.gameData.minBuyIn,
        status: 'playing'
      };
      
      this.activePlayers.push(newPlayer);
      this.filterPlayers(); // Refresh the available players list
    }
  }

  openTopupDialog(player: GamePlayer) {
    this.selectedPlayer = player;
    this.amountType = 'topup';
    this.showAmountInput = true;
    this.amount = 0;
  }

  openCashoutDialog(player: GamePlayer) {
    this.selectedPlayer = player;
    this.amountType = 'cashout';
    this.showAmountInput = true;
    this.amount = 0;
  }

  confirmAmount() {
    if (!this.selectedPlayer || !this.amount) return;

    if (this.amountType === 'topup') {
      this.selectedPlayer.totalBuyIn += this.amount;
    } else if (this.amountType === 'cashout') {
      this.selectedPlayer.cashOut = this.amount;
      this.selectedPlayer.profit = this.amount - this.selectedPlayer.totalBuyIn;
      this.selectedPlayer.status = 'cashed_out';
      
      // Move to cashed out list
      this.activePlayers = this.activePlayers.filter(p => p.id !== this.selectedPlayer!.id);
      this.cashedOutPlayers.push(this.selectedPlayer);
    }

    this.closeAmountInput();
  }

  closeAmountInput() {
    this.showAmountInput = false;
    this.selectedPlayer = null;
    this.amountType = null;
    this.amount = 0;
  }

  onCancel() {
    this.dialogRef.close();
  }

  endGame() {
    if (this.activePlayers.length === 0) {
      this.dialogRef.close({ status: 'finished' });
    }
  }

  cancelAmount() {
    this.closeAmountInput();
  }
} 