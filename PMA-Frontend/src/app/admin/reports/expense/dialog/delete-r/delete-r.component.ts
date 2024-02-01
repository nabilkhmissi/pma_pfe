import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RisksService } from 'src/app/core/service/risks.service';

@Component({
  selector: 'app-delete-r',
  templateUrl: './delete-r.component.html',
  styleUrls: ['./delete-r.component.sass']
})
export class DeleteRComponent {
constructor(  public dialogRef: MatDialogRef<DeleteRComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any,
  private riskServ:RisksService){
    console.log(data);

  }


  onNoClick(): void {
    this.dialogRef.close();
  }
  confirmDelete(): void {
   this.riskServ.deleteProbleme(this.data._id).subscribe({
    next:(res)=>{
      console.log(res);

    },
    error:(err)=>{
      console.log(err);

    }
   })
  }
}
