import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Component, Inject } from "@angular/core";
import { ReclamationService } from "src/app/core/service/reclamation.service";
//import { TicketsService } from "../../tickets.service";
@Component({
  selector: "app-delete",
  templateUrl: "./delete.component.html",
  styleUrls: ["./delete.component.sass"],
})
export class DeleteDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    //public ticketsService: TicketsService
    private reclServ:ReclamationService
  ) {}
  onNoClick(): void {
    this.dialogRef.close();
  }
  confirmDelete(): void {
this.reclServ.deleteReclamation(this.data._id).subscribe({
  next: (data) => {
   // console.log(data);

  },
  error: (err) => {
    console.log(err);

  }
}) }
}
