import { Component } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AuthService } from "src/app/core/service/auth.service";

@Component({
  selector: "app-add-client",
  templateUrl: "./add-client.component.html",
  styleUrls: ["./add-client.component.sass"],
})
export class AddClientComponent {
  clientForm: UntypedFormGroup;
  hide3 = true;
  agree3 = false;
  constructor(private fb: UntypedFormBuilder,private snackBar:MatSnackBar,private authService:AuthService) {
    this.clientForm = this.fb.group({
      name: ["", [Validators.required]],
      mobile: ["", [Validators.required]],
      email: ["",[Validators.required, Validators.email, Validators.minLength(5)],],
      date: ["", [Validators.required]],
      company_name: ["", [Validators.required]],
      uploadImg: [""],
      password: ["", [Validators.required]],
      conformPassword: ["", [Validators.required]],
    });
  }
  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, "", {
      duration: 1000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });}
  onSubmit() {
    console.log("Form Value", this.clientForm.value);
    if (this.clientForm.value.password==this.clientForm.value.conformPassword)
   { let formData=new FormData();
    formData.append("fullName",this.clientForm.value.name);
    formData.append("email",this.clientForm.value.email);
    formData.append("password",this.clientForm.value.password);
    formData.append("phone",this.clientForm.value.mobile)
    formData.append("company",this.clientForm.value.company_name);
    formData.append("roles","Client");
    formData.append("image",this.clientForm.value.uploadImg,this.clientForm.value.uploadImg.name)


this.authService.adduser(formData).subscribe({
  next:(res)=>{
    this.showNotification("snackbar-success",
    "User added with success" ,
    "bottom",
    "center")
   this.resetFrom();
   window.scroll({
     top: 0,
     left: 0,
     behavior: 'smooth'
   });

  },
  error:(err)=> {
    this.showNotification("snackbar-danger",err,"bottom","center");
    this.clientForm.markAsPristine();
        this.clientForm.markAsUntouched();
        this.clientForm.updateValueAndValidity();
       this.clientForm.markAsUntouched();
  }
})

  }
  else{
    this.showNotification("snackbar-danger",
    "verify your passwords" ,
    "bottom",
    "center")
  }
}

resetFrom(){
  this.clientForm.reset();

  this.clientForm.reset();
Object.keys(this.clientForm.controls).forEach(key => {
this.clientForm.get(key).setErrors(null) ;
})
}
}
