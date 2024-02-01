import { formatDate } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormDialogComponent } from 'src/app/calendar/dialogs/form-dialog/form-dialog.component';
import { AuthService } from 'src/app/core/service/auth.service';
import { ProjectsService } from 'src/app/core/service/projects.service';
import { SenderService } from 'src/app/core/service/sender.service';
import { TasksService } from 'src/app/core/service/tasks.service';

@Component({
  selector: 'app-form-my',
  templateUrl: './form-my.component.html',
  styleUrls: ['./form-my.component.sass']
})
export class FormMyComponent {
  tasks:any
  action: string;
  dialogTitle: string;
  myTasksForm: UntypedFormGroup;
  myTasks: any;
employee:any
project:any
username:String
user
ProjectName:String
selectedProject:any;

  constructor(
    public dialogRef: MatDialogRef<FormMyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public taskserv: TasksService,
    private fb: UntypedFormBuilder,
    private authserv:AuthService,
    private projectser:ProjectsService,
    private senderSev:SenderService
  ) {
    // Set the defaults
    this.action = data.action;
    if (this.action === "edit") {
      this.dialogTitle = data.myTasks.Title;
      this.myTasks = data.myTasks;
      console.log(this.myTasks.Project)
    } else  {
      this.dialogTitle = "New Tasks";
      this.myTasks = {"Project":"",
        //"Status":"",
        "Priority":"",
        "Type":"",
        "Deadline":new Date(),
        "Details":"",
        "StartDate":new Date()
      };
    }
    this.myTasksForm = this.createContactForm();
  }
  ngOnInit(): void {
    /* this.authserv.getEngineer().subscribe({
      next:(res)=>{
        this.employee=res
      }
    }) */
    this.projectser.getProjectsByTeamleader(this.authserv.currentUserValue.id).subscribe({
      next:(res)=>{
        this.project=res
      }
    })
//console.log("ddddddddddd",this.myTasks);

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
  getProjectId(project1: any, project2: any): boolean {
    // Compare the _id of each specific project with the _id of each project in the select
    return project1 && project2 ? project1._id === project2._id : project1 === project2;
  }
  // getExecutorId(executor1: any, executor2: any): boolean {
  //   return executor1 && executor2 ? executor1._id === executor2._id : executor1 === executor2;
  // }
  createContactForm(): UntypedFormGroup {
    return this.fb.group({
     // id: [this.myTasks.id],
     Title: [this.myTasks.Title],
      Project: [this.myTasks.Project],
      StartDate: [
        formatDate(this.myTasks.StartDate, "yyyy-MM-dd", "en"),
        [Validators.required],
      ],
      progress:[this.myTasks.progress],
      Status: [this.myTasks.Status],
      Priority: [this.myTasks.Priority],
      Type: [this.myTasks.Type],
      Executor: [this.myTasks.Executor._id],
      Deadline: [
        formatDate(this.myTasks.Deadline, "yyyy-MM-dd", "en"),
        [Validators.required],
      ],
      Details: [this.myTasks.Details],
    });
  }
  submit() {
    // emppty stuff
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  public confirmAdd(): void {
    let Ex={
      "_id":this.authserv.currentUserValue.id
    }


if(this.action === "edit") {
  let da = {
    Title: this.myTasksForm.value.Title,
    Project: this.myTasksForm.value.Project,
    Status: this.myTasksForm.value.Status,
    Priority: this.myTasksForm.value.Priority,
    Type: this.myTasksForm.value.Type,
    Executor: this.myTasksForm.value.Executor,
    Deadline: this.myTasksForm.value.Deadline,
    StartDate: this.myTasksForm.value.StartDate,
    Details: this.myTasksForm.value.Details,
    progress:this.myTasksForm.value.progress
  };
  this.taskserv.updatetask(this.myTasks._id,da).subscribe(
    {

      next:(res)=>{

       // console.log("resssssss",res);
        if((da.Status==="Closed")&&(da.progress==100)&&(this.myTasks.Project.progress<100))


          {
           // console.log("155");
            this.taskserv.getTaskbyproject(this.myTasks.Project._id).subscribe({
            next:(res)=>{
              this.tasks=res.length
              //console.log(100/this.tasks);
              let p ={
                progress:this.myTasks.Project.progress+(100/this.tasks)
              }
              this.projectser.updateProg(this.myTasks.Project._id,p).subscribe({
                next:(res)=>{
                  console.log(res);

                }
              })

            }
          })
          }



      },
      error:(err)=>{
        console.log("err",err);

      }
    }
  ) }

else{
  let data={
    "Title":this.myTasksForm.value.Title,
    "Project":this.myTasksForm.value.Project,
   // "Status":this.myTasksForm.value.Status,
    "Priority":this.myTasksForm.value.Priority,
    "Type":this.myTasksForm.value.Type,
    "Executor":Ex,
    "Deadline":this.myTasksForm.value.Deadline,
    "StartDate":this.myTasksForm.value.StartDate,
    "Details":this.myTasksForm.value.Details,
   // "progress":this.myTasksForm.value.progress

  }
  //console.log("ggggggggggg",data);
    this.taskserv.addTask(data).subscribe({
      next:(res)=>{
        //console.log(res);
        this.senderSev.task=res
      }
    });}
  }


  get filteredFormData() {
    // selectedContinent would be undefined if no option is selected
    // therefore, we return all of the continents
  //  console.log(this.selectedProject);


    if (this.selectedProject) {


      return this.selectedProject.equipe}
    // filter out all of the continents that don't match the criteria

  }

}
