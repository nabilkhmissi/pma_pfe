import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Component, Inject } from "@angular/core";
import {
  UntypedFormControl,
  Validators,
  UntypedFormGroup,
  UntypedFormBuilder,
} from "@angular/forms";
import { ProjectsService } from "src/app/core/service/projects.service";
import { AuthService } from "src/app/core/service/auth.service";
import { ReclamationService } from "src/app/core/service/reclamation.service";
import { SenderService } from "src/app/core/service/sender.service";

@Component({
  selector: "app-form-dialog",
  templateUrl: "./form-dialog.component.html",
  styleUrls: ["./form-dialog.component.sass"],
})
export class FormDialogComponent {
  action: string;
  dialogTitle: string;
  claimform: UntypedFormGroup;
  claim: any;
  projects:any[]=[]
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,private projectServ:ProjectsService,private authSer:AuthService,
public reclamServ:ReclamationService,    private fb: UntypedFormBuilder , private SenderSev:SenderService
  ) {
    // Set the defaults
    this.action = data.action;
    if (this.action === "edit") {
      this.dialogTitle = data.claim.Title;
      this.claim= data.claim;
    } else {
      this.dialogTitle = "New Claim";
      this.claim={"Title":"","Comment":"","Addeddate":"","Type_Reclamation":"","project":""}
    }
    this.claimform = this.createContactForm();

    this.projectServ.getprojectbyClient(this.authSer.currentUserValue.id).subscribe({
      next: (response) => {
        this.projects = response;

      },
      error:(err)=>{
        console.log(err);

      }
    })
  }
  formControl = new UntypedFormControl("", [
    Validators.required,
    // Validators.email,
  ]);
  getErrorMessage() {
    return this.formControl.hasError("required")
      ? "Required field"
      : this.formControl.hasError("email")
      ? "Not a valid email"
      : "";
  }
  createContactForm(): UntypedFormGroup {
    return this.fb.group({
      Title: [this.claim.Title],
      Comment: [this.claim.Comment],
      //Addeddate: [this.claim.Addeddate],
      status: [this.claim.status],
      Type_Reclamation: [this.claim.Type_Reclamation],
      project:[this.claim.project]
    });
  }
  submit() {
    // emppty stuff
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  public confirmAdd(): void {
let data={
  "Title":this.claimform.value.Title,
  "Comment":this.claimform.value.Comment,
  "Type_Reclamation":this.claimform.value.Type_Reclamation,
  "project":this.claimform.value.project,
  "client":this.authSer.currentUserValue.id
}
if(this.action=="add"){
  this.reclamServ.addReclamation(data).subscribe({
    next:(res)=>{
      //console.log(res);
      this.SenderSev.claim=res

    },
    error:(err)=>{
      console.log(err);
    }
  })
}
else{
  let d={
    "Title":this.claimform.value.Title,
    "Comment":this.claimform.value.Comment,
    "Type_Reclamation":this.claimform.value.Type_Reclamation,
    "project":this.claimform.value.project,
    //"client":this.authSer.currentUserValue.id,
    "status":this.claimform.value.status
  }
  this.reclamServ.UpdateReclamation(this.claim._id,d).subscribe({
    next:(res)=>{
     // console.log(res);
    },
    error:(err)=>{
      console.log(err);
    }
  })
}
   // this.ticketsService.addTicket(this.claimform.getRawValue());
  }
}
