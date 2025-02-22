import { Component, OnInit } from '@angular/core';
import { PlayersService } from '../../../services/players.service';
import { PlayerFormData } from './player-dialog/player-dialog.component';

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

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.css']
})
export class PlayersComponent implements OnInit {
  searchTerm: string = '';
  players: Player[] = [];
  showAddPlayerModal = false;
  showPlayerDialog = false;
  selectedPlayer: Player | null = null;

  constructor(private playersService: PlayersService) {}

  ngOnInit() {
    this.loadPlayers();
  }

  loadPlayers() {
    this.playersService.getPlayers().subscribe(players => {
      this.players = players;
    });
  }

  get activePlayers() {
    return this.filterPlayers(this.players.filter(p => p.status === 'active'));
  }

  get inactivePlayers() {
    return this.filterPlayers(this.players.filter(p => p.status === 'inactive'));
  }

  filterPlayers(players: Player[]) {
    return players.filter(player => 
      player.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      player.idNumber.includes(this.searchTerm) ||
      player.contactNumber.includes(this.searchTerm)
    );
  }

  openAddPlayerModal() {
    this.selectedPlayer = null;
    this.showPlayerDialog = true;
  }

  editPlayer(player: Player) {
    this.selectedPlayer = player;
    this.showPlayerDialog = true;
  }

  handleSavePlayer(playerData: PlayerFormData) {
    if (playerData.id) {
      // Update existing player
      this.playersService.updatePlayer({
        ...this.selectedPlayer!,
        name: playerData.name || `${playerData.firstName} ${playerData.lastName}`.trim(),
        idType: playerData.idType,
        idNumber: playerData.idNumber,
        contactNumber: playerData.contactNumber,
        status: playerData.status
      }).subscribe(() => {
        this.loadPlayers();
      });
    } else {
      // Add new player
      this.playersService.addPlayer({
        name: `${playerData.firstName} ${playerData.lastName}`.trim(),
        idType: playerData.idType,
        idNumber: playerData.idNumber,
        contactNumber: playerData.contactNumber,
        status: playerData.status // Will be 'active' by default
      }).subscribe(() => {
        this.loadPlayers();
      });
    }
  }
} 