import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Component, ElementRef, Inject, OnInit, ViewChild } from "@angular/core";
import {
  UntypedFormControl,
  Validators,
  UntypedFormGroup,
  UntypedFormBuilder,
} from "@angular/forms";
import { formatDate } from "@angular/common";
import { ProjectsService } from "src/app/core/service/projects.service";
import { AuthService } from "src/app/core/service/auth.service";
import { ProcesVerbalService } from "src/app/core/service/proces-verbal.service";
import html2pdf from 'html2pdf.js';
import { environment } from "src/environments/environment";

@Component({
  selector: "app-form",
  templateUrl: "./form.component.html",
  styleUrls: ["./form.component.sass"],
})
export class FormComponent implements OnInit {
  @ViewChild('pdfContent') pdfContent: ElementRef;

  serverUrl = `${environment.apiUrl}'/static/images';
} `
  action: string;
  dialogTitle: string;
  isDetails = false;
  contactsForm: UntypedFormGroup;
  projects: any
  pv: any;
  users: any
  equipe: any;
  engineers = [];
  selectedProject: any;
  p: any
  pr: any
  selected: any[] = []
  constructor(
    public dialogRef: MatDialogRef<FormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private projectServ: ProjectsService,
    private procesSer: ProcesVerbalService,
    private fb: UntypedFormBuilder,
    private auhtSer: AuthService
  ) {
    this.action = data.action;
  }
  ngOnInit() {
    if (this.action === "edit") {
      this.initEditMode();
    } else if (this.action === "details") {
      this.showMode();
    } else {
      this.addPVMode()
    }
    this.getEngineers();
    this.getProjects();
  }

  getEngineers() {
    this.auhtSer.getallEngineer().subscribe({
      next: (res) => {
        this.engineers = res
      }
    })
  }
  getProjects() {
    this.projectServ.getAllProjects().subscribe({
      next: (res) => {
        this.projects = res;
      }
    })
  }

  initEditMode() {
    this.isDetails = false;
    this.dialogTitle = this.data.pv.Title;
    this.pv = this.data.pv;
    this.pr = this.pv.Project
    for (let i = 0; i < this.pv.equipe.length; i++) {
      this.selected.push(this.pv.equipe[i]._id);
    }
    this.createContactForm();
  }

  showMode() {
    this.pv = this.data.pv;
    this.isDetails = true;
    this.equipe = this.pv.equipe;
    this.fetchProjectClient();
  }

  addPVMode() {
    this.isDetails = false;
    this.dialogTitle = "New proces Verbal";
    this.initEmptyForm();
  }



  formControl = new UntypedFormControl("", [Validators.required]);

  fetchProjectClient() {
    this.auhtSer.getUserById(this.pv.Project.client).subscribe(resultat => {
      this.p = resultat
    })
  }
  generatePDF() {
    const content = this.pdfContent.nativeElement;
    const options = {
      margin: [10, 10],
      filename: 'PV-pdf.pdf',
      image: { type: 'png' },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    const pdfContainer = document.createElement('div');
    pdfContainer.appendChild(content);
    html2pdf().from(content).set(options).save();
  }

  getErrorMessage() {
    return this.formControl.hasError("required")
      ? "Required field"
      : this.formControl.hasError("email")
        ? "Not a valid email"
        : "";
  }
  createContactForm() {
    this.contactsForm = this.fb.group({
      Titre: [this.pv.Titre],
      description: [
        this.pv.description,
      ],
      Date: [
        formatDate(this.pv.Date, "yyyy-MM-dd", "en"),
        [Validators.required],
      ],
      Type_Communication: [this.pv.Type_Communication],
      Project: [this.pv.Project._id],
      Sender: [this.pv.Sender],
      equipe: [this.selected],
    });
  }
  initEmptyForm() {
    this.contactsForm = this.fb.group({
      Titre: [],
      description: [],
      Date: [
        formatDate(Date.now(), "yyyy-MM-dd", "en"),
        [Validators.required],
      ],
      Type_Communication: [],
      Project: [],
      Sender: [],
      equipe: [],
    });
  }
  submit() {
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  public confirmAdd() {
    let data = {
      ...this.contactsForm.value,
      Sender: this.auhtSer.currentUserValue
    }
    if (this.action === "add") {
      this.procesSer.addProceVerbal(data).subscribe({
        next: (res) => {
        },
        error: (err) => {
          console.log(err);
        }
      })
    }
    if (this.action === "edit") {
      this.procesSer.updateProcesv(this.pv._id, data).subscribe({
        next: (res) => {
        },
        error: (err) => {
          console.log(err);
        }
      })
    }
  }

  get filteredFormData() {
    if (this.selectedProject) {
      return this.selectedProject.equipe;
    }
  }

  compareProjects(project1: any, project2: any) {
    return project1 === project2 ? project1 : project2
  }
}
