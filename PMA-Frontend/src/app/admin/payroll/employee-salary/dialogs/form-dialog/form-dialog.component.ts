import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Component, Inject } from "@angular/core";
import { EmployeeSalaryService } from "../../employee-salary.service";
import {
  UntypedFormControl,
  Validators,
  UntypedFormGroup,
  UntypedFormBuilder,
} from "@angular/forms";
import { EmployeeSalary } from "../../employee-salary.model";
import { formatDate } from "@angular/common";
@Component({
  selector: "app-form-dialog",
  templateUrl: "./form-dialog.component.html",
  styleUrls: ["./form-dialog.component.sass"],
})
export class FormDialogComponent {
  action: string;
  dialogTitle: string;
  employeeSalaryForm: UntypedFormGroup;
  employeeSalary: EmployeeSalary;
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public employeeSalaryService: EmployeeSalaryService,
    private fb: UntypedFormBuilder
  ) {
    // Set the defaults
    this.action = data.action;
    if (this.action === "edit") {
      this.dialogTitle = data.employeeSalary.name;
      this.employeeSalary = data.employeeSalary;
    } else {
      this.dialogTitle = "New EmployeeSalary";
      this.employeeSalary = new EmployeeSalary({});
    }
    this.employeeSalaryForm = this.createContactForm();
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
      id: [this.employeeSalary.id],
      img: [this.employeeSalary.img],
      name: [this.employeeSalary.name],
      email: [this.employeeSalary.email],
      payslip: [this.employeeSalary.payslip],
      role: [this.employeeSalary.role],
      empID: [this.employeeSalary.empID],
      department: [this.employeeSalary.department],
      salary: [this.employeeSalary.salary],
    });
  }
  submit() {
    // emppty stuff
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  public confirmAdd(): void {
    this.employeeSalaryService.addEmployeeSalary(
      this.employeeSalaryForm.getRawValue()
    );
  }
}
