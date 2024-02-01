import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Component, Inject } from "@angular/core";
import { LeadsService } from "../../leads.service";
import { AuthService } from "src/app/core/service/auth.service";
import { nextSortDir } from "@swimlane/ngx-datatable";
@Component({
  selector: "app-delete",
  templateUrl: "./delete.component.html",
  styleUrls: ["./delete.component.sass"],
})
export class DeleteDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    //public leadsService: LeadsService
    private authService :AuthService
  ) {}
  onNoClick(): void {
    this.dialogRef.close();
  }
  confirmDelete(): void {
   // console.log("dattat",this.data);

    this.authService.deleteUser(this.data._id).subscribe(
      {
        next:(res)=>{
      //    console.log("deleted");

        },
        error:(err)=>{
          console.log("err");

        }
      }
    );
  }
}
