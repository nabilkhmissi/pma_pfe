import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ProjectsService } from 'src/app/core/service/projects.service';
import { ReclamationService } from 'src/app/core/service/reclamation.service';
import { TasksService } from 'src/app/core/service/tasks.service';
import { saveAs } from 'file-saver';
import { RisksService } from 'src/app/core/service/risks.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.sass']
})
export class ProjectsComponent {
  note=0
  projectRisks:any
  projectID:any;
  project:any
  projectTasks:any
  projectReclamation:any
    constructor(private activatedRoute: ActivatedRoute,private projectServ:ProjectsService,private taskServ:TasksService,private reclServ:ReclamationService,private riskServ:RisksService
) { }

    ngOnInit(): void {


     this.activatedRoute.paramMap.subscribe({
      next: (p: ParamMap) => {
        this.projectID = p.get('id');
      //  console.log(this.projectID);

        this.projectServ.getProject(p.get('id')).subscribe({
          next: (res:any) => {
  this.project=res
 // console.log("fteched",this.project);
  this.getReclamation(this.project)
  this.getTasks(this.project)
  this.getRisks(this.project)
  this.notecalc(this.project)

          },
          error:(err)=>{console.log(err);
          }



        })

      }}
      )


    }

  getTasks(p:any){

    this.taskServ.getTaskbyproject(p._id).subscribe({
      next:(res)=>{
        this.projectTasks=res
      },
      error:(err)=>{
        console.log(err);

      }
    })
  }

  getReclamation(project:any){
    this.reclServ.getReclamationByProject(project._id).subscribe({
      next:(res)=>{
        this.projectReclamation=res
      //  console.log("gagag",this.projectReclamation);

      },
      error:(err)=>{
        console.log(err);
      }

    })
  }
  getRisks(project:any){
    this.riskServ.getProbyProj(project._id).subscribe({
      next:(res)=>{this.projectRisks=res
    //  console.log("projectRiks",this.projectRisks);

      },
      error:(err)=>{
        console.log(err);

      }
    })
  }



    download(file) {
      this.projectServ.downloadfile(file).subscribe((response: any) => {
        let blob:any = new Blob([response], { type: 'file' });
        const url = window.URL.createObjectURL(blob);
        //window.open(url);
        saveAs(blob, file);
        }), (error: any) => console.log('Error downloading the file'),
        () => console.info('File downloaded successfully');
    }
    notecalc(project:any){
      let sum=0
      project.note_equipe.forEach(n => {

        sum+=n
      });
      this.note=(project.note_Client*0.5 + project.note_Admin*0.25 +sum*0.25)
    //  console.log(this.note);

    }
}
