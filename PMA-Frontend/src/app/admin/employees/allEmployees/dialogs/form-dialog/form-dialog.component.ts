import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Component, Inject } from "@angular/core";
import { EmployeesService } from "../../employees.service";
import {
  UntypedFormControl,
  Validators,
  UntypedFormGroup,
  UntypedFormBuilder,
} from "@angular/forms";
import { Employees } from "../../employees.model";
import { formatDate } from "@angular/common";
import { AuthService } from "src/app/core/service/auth.service";
@Component({
  selector: "app-form-dialog",
  templateUrl: "./form-dialog.component.html",
  styleUrls: ["./form-dialog.component.sass"],
})
export class FormDialogComponent {
  action: string;
  dialogTitle: string;
  employeesForm: UntypedFormGroup;
  employees: any;
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: UntypedFormBuilder,
    private authServie:AuthService
  ) {
    // Set the defaults
    this.action = data.action;
    if (this.action === "edit") {
      this.dialogTitle = data.employees.fullName;
      this.employees = data.employees;
    } else {
      this.dialogTitle = "New Employees";
      //this.employees = new Employees({});
    }
    this.employeesForm = this.createContactForm();
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
      id: [this.employees._id],
      img: [this.employees.image],
      name: [this.employees.fullName],
      email: [this.employees.email],
      hiringDate: [
        formatDate(this.employees.hiringDate, "yyyy-MM-dd", "en"),
        [Validators.required],
      ],
      role: [this.employees.roles],
      mobile: [this.employees.phone],
      department: [this.employees.department],
      gender: [this.employees.gender],
    });
  }
  submit() {
    // emppty stuff
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  public confirmAdd(): void {
    //console.log("hhh",this.employeesForm.getRawValue());

    this.authServie.updateuser(this.employees._id, this.employeesForm.getRawValue()).subscribe({
      next:(ress)=>{
//console.log(ress);


      }
    })
    //this.employeesService.addEmployees(this.employeesForm.getRawValue());
  }
}
