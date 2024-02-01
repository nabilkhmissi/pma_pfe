import { Component,Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { AuthService } from 'src/app/core/service/auth.service';
@Component({
  selector: 'app-confrim',
  templateUrl: './confrim.component.html',
  styleUrls: ['./confrim.component.sass']
})
export class ConfrimComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfrimComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    //public leadsService: LeadsService
    private authService :AuthService
  ) {}
  onNoClick(): void {
    this.dialogRef.close();
  }
  confirmDelete(): void {
    //console.log("dattat",this.data);

    this.authService.confirm_signup(this.data._id,this.data).subscribe(
      {
        next:(res)=>{
         // console.log("accepted");

        },
        error:(err)=>{
          console.log("err");

        }
      }
    );
  }

}
