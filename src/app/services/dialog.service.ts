import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { AuthorDialogComponent } from '../author/author-dialog/author-dialog.component';


/********************************
  a service for displaying  
  modal dialogs.

********************************/ 

@Injectable({
  providedIn: 'root'
})

export class DialogService {
  constructor(private dialog: MatDialog) {}

  // a confimation dialog
  openConfirmDialog( title: string, msg: string) {
    return this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      //disableClose: true,
      data: {
        title: title,
        message: msg
      }
    });
  }

  // a dilaog for viewing/editing authors
  openAuthorDialog( title: string, id: number) {
    return this.dialog.open(AuthorDialogComponent, {
      width: '400px',
      //disableClose: true,
      data: {
        title: title,
        id: id,
      }
    });
  }
}