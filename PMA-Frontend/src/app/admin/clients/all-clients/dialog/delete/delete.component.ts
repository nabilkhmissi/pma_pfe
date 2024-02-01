import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Component, Inject } from "@angular/core";
import { ClientsService } from "../../clients.service";
import { AuthService } from "src/app/core/service/auth.service";
@Component({
  selector: "app-delete",
  templateUrl: "./delete.component.html",
  styleUrls: ["./delete.component.sass"],
})
export class DeleteDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public authService: AuthService
  ) {}
  onNoClick(): void {
    this.dialogRef.close();
  }
  confirmDelete(): void {
    this.authService.deleteUser(this.data._id).subscribe({
      next:(res)=>{
        //console.log("deleted");

      },
      error:(err)=>{
        console.log(err);

      }

    });
  }
}
