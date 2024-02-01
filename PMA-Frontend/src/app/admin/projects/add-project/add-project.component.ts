import { Component, OnInit, ViewChild } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { AuthService } from "src/app/core/service/auth.service";
import { ProjectsService } from "src/app/core/service/projects.service";
import { ChangeEvent } from "@ckeditor/ckeditor5-angular/ckeditor.component";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-add-project",
  templateUrl: "./add-project.component.html",
  styleUrls: ["./add-project.component.sass"],
})
export class AddprojectsComponent implements OnInit {
  projectForm: UntypedFormGroup;
  hide3 = true;
  agree3 = false;
  clients: []
  teamlist: any[]
  TeamLeaders: any[]//are the Team Leaders
  data
  retrieveddata: string = null;
  @ViewChild("myEditor", { static: false }) myEditor: any;
  public Editor = ClassicEditor;
  /*   teamList: string[] = [
      "Sarah Smith",
      "John Deo",
      "Pankaj Patel",
      "Pooja Sharma",
    ]; */
  constructor(private fb: UntypedFormBuilder, private authServ: AuthService, private projectServ: ProjectsService, private snackBar: MatSnackBar) {
    this.projectForm = this.fb.group({
/*       projectID: ["", [Validators.required]],
 */      projectTitle: ["", [Validators.required]],
      type: ["", [Validators.required]],
      priority: ["", [Validators.required]],
      client: ["", [Validators.required]],
      // price: ["", [Validators.required]],
      startDate: ["", [Validators.required]],
      endDate: ["", [Validators.required]],
      team: ["", [Validators.required]],
      //status: ["", [Validators.required]],
      //TeamLeader must added
      TeamLeader: ["", [Validators.required]],
      //file: [""],
    });
  }
  ngOnInit(): void {
    this.authServ.getallCient().subscribe({
      next: (res) => {
        this.clients = res;
        //console.log("clients",this.clients);

      }
    })
    this.authServ.getEngineer().subscribe({
      next: (res) => {
        this.teamlist = res;
        //console.log("team",this.teamlist);

      }
    })
    this.authServ.getallTeamLeader().subscribe({
      next: (res) => {
        this.TeamLeaders = res;
        this.TeamLeaders = this.TeamLeaders.concat(this.teamlist)
        //console.log("teamleaders",this.TeamLeaders);
      }
    })
  }
  resetForm() {

    this.projectForm.reset();


    this.projectForm.reset();
    Object.keys(this.projectForm.controls).forEach(key => {
      this.projectForm.get(key).setErrors(null);
    });

  }

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, "", {
      duration: 1000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }

  public onChange({ editor }: ChangeEvent) {
    const data = editor.getData();


    this.retrieveddata = data.replace(/<\/?[^>]+(>|$)/g, "");;
  }
  onSubmit() {

    //console.log("",this.projectForm.value.team);

    let formData = new FormData();
    formData.append("Projectname", this.projectForm.value.projectTitle)
    formData.append("description", this.retrieveddata)
    formData.append("TeamLeader", this.projectForm.value.TeamLeader)
    formData.append("type", this.projectForm.value.type)
    formData.append("equipe", JSON.stringify(this.projectForm.value.team))
    formData.append("client", this.projectForm.value.client)
    //formData.append("price",this.projectForm.value.price)
    formData.append("dateFin", this.projectForm.value.endDate)
    formData.append("dateDebut", this.projectForm.value.startDate)
    formData.append("priority", this.projectForm.value.priority)
    formData.append("status", "Pending")
    //formData.append("file","","")
    //console.log("Form Value", formData);

    this.projectServ.addProject(formData).subscribe({
      next: (res) => {
        this.showNotification("snackbar-success",
          "project added with success",
          "bottom",
          "center")
        this.resetForm();
        //.retrieveddata=""
        // this.myEditor.instance.setData('');
        window.scroll({
          top: 0,
          left: 0,
          behavior: 'smooth'
        });
      },
      error: (err) => {
        this.showNotification("snackbar-danger",
          "Something went wrong!",
          "bottom",
          "center")
      }
    })

  }
}
