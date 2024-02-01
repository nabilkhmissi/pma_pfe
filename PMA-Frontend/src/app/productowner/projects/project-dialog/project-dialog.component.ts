import { Component, Inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/core/service/auth.service';
import { ProjectsService } from 'src/app/core/service/projects.service';
import { ProjectStatus, ProjectPriority, ProjectType } from '../../../admin/projects/all-projects/core/project.model';

@Component({
  selector: 'app-project-dialog',
  templateUrl: './project-dialog.component.html',
  styleUrls: ['./project-dialog.component.sass']
})
export class ProjectDialogComponent {
  public project: any;
  public dialogTitle: string;
  public projectForm: UntypedFormGroup;
  public statusChoices: typeof ProjectStatus;
  public priorityChoices: typeof ProjectPriority;
  public projectType: typeof ProjectType;
  usr: any
  TeamLeaders: [];
  teamlist: [];
  selected: any[] = [];
  constructor(
    private formBuilder: UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ProjectDialogComponent>,
    private snackBar: MatSnackBar,
    private projectServ: ProjectsService,
    private authServ: AuthService
  ) {
    this.dialogTitle = data.title;
    this.project = data.project;
    this.statusChoices = ProjectStatus;
    this.priorityChoices = ProjectPriority;
    this.projectType = ProjectType;
    //  console.log("pppp ",this.project);
    this.usr = this.authServ.currentUserValue

    for (let i = 0; i < this.project.equipe.length; i++) {
      this.selected.push(this.project.equipe[i]._id);
      //console.log("selcted",this.selected);

    }


    this.authServ.getallTeamLeader().subscribe({
      next: (res) => {
        this.TeamLeaders = res;
        // console.log('teamleaders', this.TeamLeaders);
      },
    });
    this.authServ.getEngineer().subscribe({
      next: (res) => {
        this.teamlist = res;
        // console.log('team', this.teamlist);
      },
    });

    const nonWhiteSpaceRegExp: RegExp = new RegExp('\\S');

    this.projectForm = this.formBuilder.group({

      type: [""],

      File: [""],

    });
  }

  public ngOnInit(): void { }

  public save(): void {
    // console.log('save');
    if (!this.projectForm.valid) {
      return;
    }
    if (this.project) {

      let formData = new FormData();

      formData.append("file", this.projectForm.value.File, this.projectForm.value.File.name)
      if (this.projectForm.value.type == "Kick Off") {
        this.projectServ.addkik(this.project._id, formData).subscribe({
          next: (res) => {
           // console.log(res);

          }
        })

      }
      else if (this.projectForm.value.type == "Build Book") {
        this.projectServ.addbuild(this.project._id, formData).subscribe({
          next: (res) => {
            // console.log(res);

          }
        })
      }
      else if (this.projectForm.value.type == "Access Document") {
        this.projectServ.addaccesd(this.project._id, formData).subscribe({
          next: (res) => {
            //  console.log(res);

          }
        })
      }
      else if (this.projectForm.value.type == "HLD-LLD") {
        this.projectServ.addHLDLLD(this.project._id, formData).subscribe({
          next: (res) => {
            //   console.log(res);

          }
        })
      }
      else if (this.projectForm.value.type == "Other") {
        this.projectServ.addOther(this.project._id, formData).subscribe({
          next: (res) => {
            //   console.log(res);

          }
        })
      }
      else if (this.projectForm.value.type == "Additional-1") {
        this.projectServ.addOther1(this.project._id, formData).subscribe({
          next: (res) => {
            //   console.log(res);

          }
        })
      }
      else if (this.projectForm.value.type == "Additional-2") {
        this.projectServ.addOther2(this.project._id, formData).subscribe({
          next: (res) => {
            //   console.log(res);

          }
        })
      }
      else if (this.projectForm.value.type == "Additional-3") {
        this.projectServ.addOther3(this.project._id, formData).subscribe({
          next: (res) => {
            //   console.log(res);

          }
        })
      }

      this.snackBar.open('Project updated Successfully...!!!', '', {
        duration: 2000,
        verticalPosition: 'bottom',
        horizontalPosition: 'center',
        panelClass: 'black',
      });

      this.dialogRef.close();
    } else {
      //this.projectService.createOject(this.projectForm.value);
      this.snackBar.open('Project created Successfully...!!!', '', {
        duration: 2000,
        verticalPosition: 'bottom',
        horizontalPosition: 'center',
        panelClass: 'black',
      });

      this.dialogRef.close();
    }
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
