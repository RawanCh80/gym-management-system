import { Component, EventEmitter, Inject, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-delete-dialog.component.html',
  styleUrl: './confirm-delete-dialog.component.scss'
})
export class ConfirmDeleteDialogComponent {
  private dialogRef = inject(MatDialogRef<ConfirmDeleteDialogComponent>);

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      gymId: string;
      title: string;
      message: string;
    }
  ) {}

  public confirm(): void {
    console.log('CONFIRM CLICKED');
    this.dialogRef.close(this.data.gymId);
  }

  public cancel(): void {
    this.dialogRef.close();
  }
}
