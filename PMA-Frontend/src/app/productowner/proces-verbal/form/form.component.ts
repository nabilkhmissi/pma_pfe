import { formatDate } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/core/service/auth.service';
import { ProcesVerbalService } from 'src/app/core/service/proces-verbal.service';
import { ProjectsService } from 'src/app/core/service/projects.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.sass']
})
export class FormComponent {
  action: string;
  dialogTitle: string;
  isDetails = false;
  contactsForm: UntypedFormGroup;
  projects:any
  pv: any;
  users:any
  equipe
  selectedProject:any;
  p:any
  selected:any[]=[]
  constructor(
    public dialogRef: MatDialogRef<FormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    //public contactsService: ContactsService,
    private projectServ:ProjectsService,
    private procesSer:ProcesVerbalService,
    private fb: UntypedFormBuilder,
  private auhtSer:AuthService
  ) {
    // Set the defaults
    this.action = data.action;
    if (this.action === "edit") {
      this.isDetails = false;
      this.dialogTitle = data.pv.Title;
      this.pv = data.pv;
    //  console.log("pccc",this.pv);

      for(let i=0;i<this.pv.equipe.length;i++){
        this.selected.push(this.pv.equipe[i]._id);
       // console.log("selcted",this.selected);

        }

      this.contactsForm = this.createContactForm();
    } else if (this.action === "details") {
      this.pv = data.pv;

      this.isDetails = true;
      this.equipe=this.pv.equipe
      //console.log("equipe",this.pv);

    } else {
      this.isDetails = false;
      this.dialogTitle = "New proces Verbal";
      this.pv ={
        "Titre":"",
        "description":"",
         "Date": new Date(),
         "Type_Communication":"",
         "Project": "",

         "Sender": "",
         "equipe":"",
      };
      this.contactsForm = this.createContactForm();
    }
    this.projectServ.getProjectsByTeamleader(this.auhtSer.currentUserValue.id).subscribe({
      next :(res)=>{
        this.projects=res
       // console.log("project",this.projects);

      },
      error:(err)=>{
console.log(err);

      }
    })
    this.auhtSer.getallEngineer().subscribe({
      next:(res)=>{
        this.users=res
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
     // id: [this.pv.id],
     // img: [this.pv.img],
     Titre: [this.pv.Titre],
     description: [
        this.pv.description,
      ],
      Date: [
        formatDate(this.pv.Date, "yyyy-MM-dd", "en"),
        [Validators.required],
      ],
      Type_Communication: [this.pv.Type_Communication],
      Project: [this.pv?.Project],

      Sender: [this.pv.Sender],
      equipe: [this.selected],
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
    "Titre":this.contactsForm.value.Titre,
    "description": this.contactsForm.value.description,
     "Date": this.contactsForm.value.Date,
     "Type_Communication": this.contactsForm.value.Type_Communication,
     "Project": this.contactsForm.value.Project,
     "Sender":this.auhtSer.currentUserValue,
     "equipe": JSON.stringify(this.contactsForm.value.equipe),
   }
   if(this.action==="add"){
   // console.log("fffffffffffff",data);
    this.procesSer.addProceVerbal(data).subscribe({
      next:(res)=>{
       // console.log(res);
      },
      error:(err)=>{
        console.log(err);
      }
    })
   }
   else if(this.action==="edit"){
    this.procesSer.updateProcesv(this.pv._id,data).subscribe({
      next:(res)=>{
      //  console.log(res);
      },
      error:(err)=>{
        console.log(err);
        }
    })
   }
  }
  get filteredFormData() {
    // selectedContinent would be undefined if no option is selected
    // therefore, we return all of the continents
  //  console.log(this.selectedProject);


    if (this.selectedProject) {
      return this.selectedProject.equipe;
    }
    // filter out all of the continents that don't match the criteria

  }
}
