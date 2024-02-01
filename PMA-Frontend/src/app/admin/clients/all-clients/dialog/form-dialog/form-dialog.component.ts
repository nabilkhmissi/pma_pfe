import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Component, Inject } from "@angular/core";
import {
  UntypedFormControl,
  Validators,
  UntypedFormGroup,
  UntypedFormBuilder,
} from "@angular/forms";
import { formatDate } from "@angular/common";
import { ClientsService } from "../../clients.service";
import { Clients } from "../../clients.model";
import { AuthService } from "src/app/core/service/auth.service";
@Component({
  selector: "app-form-dialog",
  templateUrl: "./form-dialog.component.html",
  styleUrls: ["./form-dialog.component.sass"],
})
export class FormDialogComponent {
  action: string;
  dialogTitle: string;
  clientForm: UntypedFormGroup;
  clients: any;
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public authserv: AuthService,
    private fb: UntypedFormBuilder
  ) {
    // Set the defaults
    this.action = data.action;
    if (this.action === "edit") {
      this.dialogTitle = data.clients.fullName;
      this.clients = data.clients;
    } else {
      this.dialogTitle = "New Client";
    //  this.clients = new Clients({});
    }
    this.clientForm = this.createContactForm();
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
      id: [this.clients.id],
      image: [this.clients.image],
      fullName: [this.clients.fullName],
      email: [this.clients.email],
      phone: [this.clients.phone],
      company: [this.clients.company],
    //  currency: [this.clients.currency],
     // Billing: [this.clients.Billing],
    });
  }
  submit() {
    // emppty stuff
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  public confirmAdd(): void {
    //console.log("hahah",this.clientForm.getRawValue());

this.authserv.updateuser(this.clients._id,this.clientForm.getRawValue()).subscribe({
  next:(res)=>{
    console.log(res);

  },
  error:(err)=>{
    console.log(err);

  }
})
  }
}
