import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Component, Inject } from "@angular/core";
//import { CalendarService } from "../../calendar.service";
import {
  UntypedFormControl,
  Validators,
  UntypedFormGroup,
  UntypedFormBuilder,
} from "@angular/forms";
import { Calendar } from "../../calendar.model";
import { formatDate } from "@angular/common";
import { EventService } from "src/app/core/service/event.service";
import { AuthService } from "src/app/core/service/auth.service";
@Component({
  selector: "app-form-dialog",
  templateUrl: "./form-dialog.component.html",
  styleUrls: ["./form-dialog.component.sass"],
})
export class FormDialogComponent {
  action: string;
  dialogTitle: string;
  calendarForm: UntypedFormGroup;
  calendar: Calendar;
  showDeleteBtn = false;
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public eventServ: EventService,
    private fb: UntypedFormBuilder,
    private authserv:AuthService
  ) {
    // Set the defaults
    this.action = data.action;
    if (this.action === "edit") {
      this.dialogTitle = data.calendar.title;
      this.calendar = data.calendar;
      this.showDeleteBtn = true;
    } else {
      this.dialogTitle = "New Event";
      this.calendar = new Calendar({});
      this.showDeleteBtn = false;
    }

    this.calendarForm = this.createContactForm();
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
     _id: [this.calendar._id],
      title: [this.calendar.title, [Validators.required]],
      category: [this.calendar.category],
      startDate: [this.calendar.startDate, [Validators.required]],
      endDate: [this.calendar.endDate, [Validators.required]],
      details: [this.calendar.details],
      className:this.getClassNameValue(this.calendar.category),
    });
  }
  getClassNameValue(category) {
    let className: string;

    if (category === "Work") className = "fc-event-success";
    else if (category === "Personal") className = "fc-event-warning";
    else if (category === "Important") className = "fc-event-primary";
    else if (category === "Travel") className = "fc-event-danger";
    else if (category === "Friends") className = "fc-event-info";

    return className;
  }
  submit() {
    // emppty stuff
  }
  deleteEvent() {
 //   console.log("ddddddddddddddd",this.data);

    this.eventServ.deleteEvent(this.data.calendar.id).subscribe({
      next:(res)=>{
        //console.log(res);

      }
    });
    this.dialogRef.close("delete");
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  public confirmAdd(): void {

   // console.log('eeeeeeeeeeee', this.calendarForm.getRawValue());
    let data = {
     // _id: [this.calendar._id],
      title: this.calendarForm.value.title,
      category: this.calendarForm.value.category,
      startDate: this.calendarForm.value.startDate,
      endDate: this.calendarForm.value.endDate,
      details: this.calendarForm.value.details,
      className: this.getClassNameValue(this.calendarForm.value.category),
      user:this.authserv.currentUserValue.id


    };
   // console.log('rrrrrrrrrrrrr', data);
    if(this.action ==="add"){
    this.eventServ.addEvent(data).subscribe({
      next: (res) => {
      //  console.log('created res', res);
      },
    });}
    else if(this.action ==="edit"){
this.eventServ.updatEvent(this.data.calendar.id,data).subscribe({
  next:(res)=>{
  //  console.log(res);

  }
})
    }
    this.dialogRef.close('submit');

}}
