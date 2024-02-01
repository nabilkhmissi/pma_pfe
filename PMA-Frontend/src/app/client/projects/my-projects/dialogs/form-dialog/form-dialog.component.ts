import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Component, Inject } from "@angular/core";
import {
  UntypedFormControl,
  Validators,
  UntypedFormGroup,
  UntypedFormBuilder,
} from "@angular/forms";
import { formatDate } from "@angular/common";
import { MyProjectsService } from "../../my-projects.service";
import { MyProjects } from "../../my-projects.model";
import { ProjectsService } from "src/app/core/service/projects.service";
import { AuthService } from "src/app/core/service/auth.service";
import { SenderService } from "src/app/core/service/sender.service";
@Component({
  selector: "app-form-dialog",
  templateUrl: "./form-dialog.component.html",
  styleUrls: ["./form-dialog.component.sass"],
})
export class FormDialogComponent {
  action: string;
  usr:any
  dialogTitle: string;
  myProjectsForm: UntypedFormGroup;
  myProjects: any;
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public projectServ: ProjectsService,
    private fb: UntypedFormBuilder,
    private authServ :AuthService,
    private sender :SenderService
  ) {
    // Set the defaults
    this.action = data.action;
    if (this.action === "edit") {
      this.dialogTitle = data.myProjects.Projectname;
      this.myProjects = data.myProjects;
      //console.log("data ",data.myProjects);

    } else {
      this.dialogTitle = "New Project";
//console.log("data",this.usr);

      this.myProjects = {
        "Projectname":"",
"type":"",
/* "price":"",
 */"dateFin":new Date(),
"description":"",



      };
    }
    this.myProjectsForm = this.createContactForm();
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
    //  id: [this.myProjects.id],
      Projectname: [this.myProjects.Projectname],
      type: [this.myProjects.type],
/*       price: [this.myProjects.price],
 */      dateFin: [
        formatDate(this.myProjects.dateFin, "yyyy-MM-dd", "en"),
        [Validators.required],
      ],
description:[this.myProjects.description],
      note: [this.myProjects.note_Client],
      File: [this.myProjects.file,],
    });
  }
  submit() {
    // emppty stuff
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  public confirmAdd(): void {
   // this.myProjectsService.addMyProjects(this.myProjectsForm.getRawValue());


   if(this.action=="edit"){

    this.projectServ.updateProject(this.myProjects._id,this.myProjectsForm.getRawValue()).subscribe({
      next: (res) => {
        //console.log(res);


      },
      error:(err)=>{
        console.log(err);

      }
    })
   }else if(this.action=="add"){
    let formData = new FormData();
    formData.append("Projectname",this.myProjectsForm.value.Projectname)
    formData.append("description",this.myProjectsForm.value.description)
    //formData.append("TeamLeader",this.myProjectsForm.value.TeamLeader)
    formData.append("type",this.myProjectsForm.value.type)
formData.append("client",this.authServ.currentUserValue.id)
/* formData.append("price",this.myProjectsForm.value.price)
 *///formData.append("dateFin",this.myProjectsForm.value.endDate)
formData.append("dateFin",this.myProjectsForm.value.dateFin)
//formData.append("priority",this.myProjectsForm.value.priority)
//formData.append("status",this.myProjectsForm.value.status)
formData.append("file",this.myProjectsForm.value.File,this.myProjectsForm.value.File.name)
//console.log("Form Value", formData);

this.projectServ.createProject(formData).subscribe({
  next:(res)=>{
  //  console.log(res);
this.sender.project=res
  },error:(err)=>{
    console.log(err);

  }
})

   }

  }
}
