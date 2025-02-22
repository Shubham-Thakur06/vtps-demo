import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { GamesService } from '../../../../services/games.service';
import { PlayerSelectionDialogComponent } from '../player-selection-dialog/player-selection-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-create-game-dialog',
  templateUrl: './create-game-dialog.component.html',
  styleUrls: ['./create-game-dialog.component.scss']
})
export class CreateGameDialogComponent implements OnInit {
  gameForm: FormGroup;
  gameTypes: string[] = [];

  constructor(
    private fb: FormBuilder,
    private gamesService: GamesService,
    public dialogRef: MatDialogRef<CreateGameDialogComponent>,
    private dialog: MatDialog
  ) {
    this.gameForm = this.fb.group({
      gameType: ['', Validators.required],
      tableNumber: ['', [Validators.required, Validators.min(1)]],
      minBuyIn: ['', [Validators.required, Validators.min(100)]],
      maxBuyIn: ['', [Validators.required, Validators.min(100)]],
      lockInTime: this.fb.group({
        hours: [4, [Validators.required, Validators.min(0), Validators.max(23)]],
        minutes: [0, [Validators.required, Validators.min(0), Validators.max(59)]]
      }),
      extensionLockIn: this.fb.group({
        hours: [2, [Validators.required, Validators.min(0), Validators.max(23)]],
        minutes: [0, [Validators.required, Validators.min(0), Validators.max(59)]]
      })
    });

    // Update maxBuyIn when minBuyIn changes
    this.gameForm.get('minBuyIn')?.valueChanges.subscribe(value => {
      if (value) {
        this.gameForm.patchValue({
          maxBuyIn: value * 5
        }, { emitEvent: false });
      }
    });
  }

  ngOnInit() {
    this.loadGameTypes();
  }

  loadGameTypes() {
    this.gamesService.getGameTypes().subscribe(types => {
      this.gameTypes = types;
    });
  }

  onSubmit() {
    if (this.gameForm.valid) {
      const formValue = this.gameForm.value;
      const gameData = {
        ...formValue,
        lockInTime: this.formatTime(formValue.lockInTime),
        extensionLockIn: this.formatTime(formValue.extensionLockIn)
      };
      this.dialogRef.close(gameData);
    }
  }

  private formatTime(time: { hours: number, minutes: number }): string {
    return `${time.hours.toString().padStart(2, '0')}:${time.minutes.toString().padStart(2, '0')}`;
  }

  onCancel() {
    this.dialogRef.close();
  }

  proceedToPlayerSelection() {
    if (this.gameForm.valid) {
      const formValue = this.gameForm.value;
      const playerDialogRef = this.dialog.open(PlayerSelectionDialogComponent, {
        width: '90%',
        maxWidth: '800px',
        data: {
          gameType: formValue.gameType,
          tableNumber: formValue.tableNumber,
          minBuyIn: formValue.minBuyIn,
          maxBuyIn: formValue.maxBuyIn,
          lockInTime: this.formatTime(formValue.lockInTime),
          extensionLockIn: this.formatTime(formValue.extensionLockIn)
        },
        disableClose: false,
        backdropClass: 'backdrop-blur'
      });

      playerDialogRef.afterClosed().subscribe(result => {
        if (result) {
          const gameData = {
            ...this.gameForm.value,
            players: result
          };
          this.dialogRef.close(gameData);
        }
      });
    }
  }
} 