import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PlayersService } from '../../../../services/players.service';

interface SelectedPlayer {
  id: number;
  name: string;
  buyIn: number;
  buyInError?: string;
}

@Component({
  selector: 'app-player-selection-dialog',
  templateUrl: './player-selection-dialog.component.html',
  styleUrls: ['./player-selection-dialog.component.scss']
})
export class PlayerSelectionDialogComponent implements OnInit {
  searchTerm = '';
  availablePlayers: any[] = [];
  filteredPlayers: any[] = [];
  selectedPlayers: SelectedPlayer[] = [];

  constructor(
    private dialogRef: MatDialogRef<PlayerSelectionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public gameData: any,
    private playersService: PlayersService
  ) {}

  ngOnInit() {
    this.loadPlayers();
  }

  loadPlayers() {
    this.playersService.getAvailablePlayers().subscribe(players => {
      this.availablePlayers = players;
      this.filterPlayers();
    });
  }

  filterPlayers() {
    this.filteredPlayers = this.availablePlayers.filter(player => 
      !this.isSelected(player) &&
      player.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  isSelected(player: any): boolean {
    return this.selectedPlayers.some(p => p.id === player.id);
  }

  selectPlayer(player: any) {
    if (!this.isSelected(player)) {
      this.selectedPlayers.push({
        id: player.id,
        name: player.name,
        buyIn: this.gameData.minBuyIn
      });
      this.filterPlayers();
    }
  }

  removePlayer(player: SelectedPlayer) {
    this.selectedPlayers = this.selectedPlayers.filter(p => p.id !== player.id);
    this.filterPlayers();
  }

  validateBuyIn(player: SelectedPlayer) {
    if (player.buyIn < this.gameData.minBuyIn) {
      player.buyIn = this.gameData.minBuyIn;
      player.buyInError = `Minimum buy-in is ₹${this.gameData.minBuyIn}`;
    } else if (player.buyIn > this.gameData.maxBuyIn) {
      player.buyIn = this.gameData.maxBuyIn;
      player.buyInError = `Maximum buy-in is ₹${this.gameData.maxBuyIn}`;
    } else {
      player.buyInError = undefined;
    }
  }

  isAllBuyInsValid(): boolean {
    return this.selectedPlayers.every(player => 
      player.buyIn >= this.gameData.minBuyIn && 
      player.buyIn <= this.gameData.maxBuyIn
    );
  }

  onCancel() {
    this.dialogRef.close();
  }

  onConfirm() {
    if (this.selectedPlayers.length >= 2 && this.isAllBuyInsValid()) {
      this.dialogRef.close(this.selectedPlayers);
    }
  }
} 