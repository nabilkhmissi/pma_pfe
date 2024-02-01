import { formatDate } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/core/service/auth.service';
import { ProjectsService } from 'src/app/core/service/projects.service';
import { RisksService } from 'src/app/core/service/risks.service';
import { TasksService } from 'src/app/core/service/tasks.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.sass']
})
export class FormComponent implements OnInit {

  action: string;
  dialogTitle: string;
  myRisks:any
  projects:any
myRiskForm:UntypedFormGroup


/* "title",
  "project",

  "status",
  "impact",
  "date",
  "details",
 */

  constructor(
    public dialogRef: MatDialogRef<FormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  private riskSrv:RisksService,
    private fb: UntypedFormBuilder,
    private authserv:AuthService,
    private projectser:ProjectsService
  ) {
    // Set the defaults
    this.action = data.action;
    if (this.action === "edit") {
      this.dialogTitle = data.myRisks.title;
      this.myRisks = data.myRisks;
    } else  {
      this.dialogTitle = "New Risk";
      this.myRisks = {"title":"",
        "project":"",
        "action":"",
        "impact":"",
        "date":new Date(),
        "details":""
      };
    }
    this.myRiskForm = this.createContactForm();
  }
  submit() {
    // emppty stuff
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit(): void {
    this.projectser.getmyProject(this.authserv.currentUserValue.id).subscribe({
      next:(res)=>{
        this.projects=res      }
    })
   // console.log("opp",this.projects);

  }


  createContactForm(): UntypedFormGroup {
    return this.fb.group({
     title: [this.myRisks.title],
     project: [this.myRisks.project],
     action: [this.myRisks.action],
     impact: [this.myRisks.impact],
     date: [
        formatDate(this.myRisks.date, "yyyy-MM-dd", "en"),
        [Validators.required],
      ],

      details: [this.myRisks.details],
    });
  }

  public confirmAdd(): void {
let data ={
  "title":this.myRiskForm.value.title,
  "project":this.myRiskForm.value.project,
  "action":this.myRiskForm.value.action,
  "impact":this.myRiskForm.value.impact,
  "date":this.myRiskForm.value.date,
  "details":this.myRiskForm.value.details,
  "user":this.authserv.currentUserValue.id
}


console.log("daaaa",data);
if(this.action=="add"){this.riskSrv.addRisk(data).subscribe({
  next:(res)=>{
  //  console.log(res);

  },
  error:(err)=>{
    console.log(err);

  }
})
}
else {
  this.riskSrv.updateProbleme(this.myRisks._id,data).subscribe({
    next:(res)=>{
    //  console.log(res);

    },
    error:(err)=>{
      console.log(err);

    }


  })
}




  }




}

