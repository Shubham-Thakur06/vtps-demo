import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateGameDialogComponent } from './create-game-dialog/create-game-dialog.component';
import { GamesService, Game } from '../../../services/games.service';
import { GameEditDialogComponent } from './game-edit-dialog/game-edit-dialog.component';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.css']
})
export class GamesComponent implements OnInit {
  games: Game[] = [];
  activeGames: Game[] = [];
  finishedGames: Game[] = [];
  searchTerm: string = '';
  sortColumn: string = 'startTime';
  sortDirection: 'asc' | 'desc' = 'desc';

  constructor(
    private dialog: MatDialog,
    private gamesService: GamesService
  ) {}

  ngOnInit() {
    this.loadGames();
  }

  loadGames() {
    this.gamesService.getGames().subscribe(games => {
      this.games = games;
      this.activeGames = games.filter(game => game.status === 'active');
      this.finishedGames = games.filter(game => game.status === 'finished')
        .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
    });
  }

  openCreateGameDialog() {
    const dialogRef = this.dialog.open(CreateGameDialogComponent, {
      width: '90%',
      maxWidth: '500px',
      disableClose: false,
      backdropClass: 'backdrop-blur'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadGames();
      }
    });
  }

  viewGame(game: any) {
    const dialogRef = this.dialog.open(GameEditDialogComponent, {
      width: '90%',
      maxWidth: '1200px',
      data: {
        game: game,
        mode: 'view'
      },
      disableClose: false,
      backdropClass: 'backdrop-blur'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadGames();
      }
    });
  }

  endGame(game: any) {
    const dialogRef = this.dialog.open(GameEditDialogComponent, {
      width: '90%',
      maxWidth: '1200px',
      data: {
        game: game,
        mode: 'end'
      },
      disableClose: false,
      backdropClass: 'backdrop-blur'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadGames();
      }
    });
  }

  sortGames(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  }

  filterGames(games: Game[]): Game[] {
    return games.filter(game => 
      game.gameType.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      game.tableNumber.toString().includes(this.searchTerm) ||
      game.players.some(player => 
        player.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      )
    );
  }
} 