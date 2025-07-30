import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogActions, MatDialogContent } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  imports: [MatDialogActions, MatDialogContent],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.css'
})


//class qui permet d' afficher une petite fenêtre(dialog) avec un message de confirmation
export class ConfirmDialogComponent {

  //dialogRef correspond à la référence de la fenêtre 
  //@Inject(MAT_DIALOG_DATA) permet de récupérer les données envoyées lorsque la fenêtre de confirmation s'ouvre

   constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) {}



  //ferme la fenêtre en renvoyant true qui veut dire que le l'utiisateur a confirmé l'action
  onConfirm(): void {
    this.dialogRef.close(true);
  }

  //ferme la fenêtre en renvoyant false qui veut dire que l'utilisateur a annulé l'action
  onCancel(): void {
    this.dialogRef.close(false);
  }
}
