import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Component, Inject, OnInit } from "@angular/core";
import {
  UntypedFormControl,
  Validators,
  UntypedFormGroup,
  UntypedFormBuilder,
} from "@angular/forms";
import { formatDate } from "@angular/common";
import { AuthService } from "src/app/core/service/auth.service";
import { ProjectsService } from "src/app/core/service/projects.service";
import { ReclamationService } from "src/app/core/service/reclamation.service";
//import { MyTasksService } from "../../my-tasks.service";
//import { MyTasks } from "../../my-tasks.model";

@Component({
  selector: "app-form-dialog",
  templateUrl: "./form-dialog.component.html",
  styleUrls: ["./form-dialog.component.sass"],
})
export class FormDialogComponent implements OnInit{
  action: string;
  dialogTitle: string;
  myRecForm: UntypedFormGroup;
  myRec: any;
  clients:any
project:any
username:String
user
ProjectName:String

  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: UntypedFormBuilder,
    private authserv:AuthService,
    private projectser:ProjectsService,
    private reclServ:ReclamationService
  ) {
    // Set the defaults
    this.action = data.action;
    if (this.action === "edit") {
      this.dialogTitle = data.reclamation.Title;
      this.myRec = data.reclamation;
    } else  {
      this.dialogTitle = "New Reclamation";
      this.myRec = {
        "Title":"",
        "Type_Reclamation":"",
        "client":"",
        "status":"",
        "Addeddate":new Date(),
        "project":"",
        "Comment":"",

      };
    }
    this.myRecForm = this.createContactForm();
  }
  ngOnInit(): void {
    this.authserv.getallCient().subscribe({
      next:(res)=>{
        this.clients=res
      }
    })
    this.projectser.getAllProjects().subscribe({
      next:(res)=>{
        this.project=res
      }
    })
console.log("ddddddddddd",this.myRec);

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
     // id: [this.myTasks.id],
     Title: [this.myRec.Title],
     Comment: [this.myRec.Comment],
     response :[this.myRec.reponse],
     Type_Reclamation: [this.myRec.Type_Reclamation],
     Addeddate: [
      formatDate(this.myRec.Addeddate, "yyyy-MM-dd", "en"),
      [Validators.required],
    ],
     client: [this.myRec.client._id],
     project: [this.myRec.project],

     status: [this.myRec.status],



    });
  }
  submit() {
    // emppty stuff
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  /*  "Title",
    "Type Reclamation",
    "date of creation",
    "client",
    "status",
    "Comment", */
  public confirmAdd(): void {
    let data={
      "Title":this.myRecForm.value.Title,
      "Comment":this.myRecForm.value.Comment,
      "Type_Reclamation":this.myRecForm.value.Type_Reclamation,
      "Addeddate":this.myRecForm.value.Addeddate,
      "client":this.myRecForm.value.client,
      "project":this.myRecForm.value.project,
      "reponse":this.myRecForm.value.response,
      "status":this.myRecForm.value.status,
    }
    console.log("dddddddd",data);

if(this.action === "edit") {
  this.reclServ.UpdateReclamation(this.myRec._id,data).subscribe(
    {
      next:(res)=>{
        console.log("resssssss",res);

      },
      error:(err)=>{
        console.log("err",err);

      }
    }
  )  }

else{
  console.log(this.myRecForm.getRawValue());

      this.reclServ.addReclamation(this.myRecForm.getRawValue()).subscribe({
      next:(res)=>{
        console.log(res);

      }
    }); }
  }




}
