import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AuthService } from "src/app/core/service/auth.service";
import { UtilsService } from "src/app/core/service/utils.service";
@Component({
  selector: "app-add-employee",
  templateUrl: "./add-employee.component.html",
  styleUrls: ["./add-employee.component.sass"],
})
export class AddEmployeeComponent implements OnInit {
  docForm: UntypedFormGroup;
  hide3 = true;
  agree3 = false;
  emplllForm:FormGroup
  constructor(private fb: UntypedFormBuilder,private authService:AuthService,private formBuilder: FormBuilder,private snackBar:MatSnackBar,private utils:UtilsService) {
    this.docForm = this.formBuilder.group({
      first: ["", [Validators.required]],
      gender: ["", [Validators.required]],
      mobile: ["", [Validators.required]],
      password: ["", [Validators.required]],
      conformPassword: ["", [Validators.required]],
      HiringDate: [""],
      department: ["",[Validators.required]],
      address: [""],
      email: ["",[Validators.required, Validators.email, Validators.minLength(5)],],
      dob: ["", [Validators.required]],
      education: [""],
      uploadImg: [""],
    });
  }
  ngOnInit(): void {

  }
  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, "", {
      duration: 1000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }
  resertFrom(){
    this.docForm.reset();

        this.docForm.reset();
Object.keys(this.docForm.controls).forEach(key => {
    this.docForm.get(key).setErrors(null) ;
});

  }
  onSubmit() {

    //console.log("Form Value", this.utils.bufferToBase64(this.docForm.value.uploadImg));
    //console.log(this.docForm.getRawValue());
    if(this.docForm.value.password==this.docForm.value.conformPassword){
let formData = new FormData();
  formData.append( "fullName",this.docForm.value.first)
  formData.append("email",this.docForm.value.email)
  formData.append("password",this.docForm.value.password)
  formData.append("image",this.docForm.value.uploadImg,this.docForm.value.uploadImg.name)
 formData.append("DateOfBirth",this.docForm.value.dob)
 formData.append("phone",this.docForm.value.mobile)
 formData.append("department",this.docForm.value.department)
 formData.append("gender",this.docForm.value.gender)
 formData.append("hiringDate",this.docForm.value.HiringDate)
 formData.append("roles","Engineer")




//console.log("dddddd",formData);


this.authService.adduser(formData).subscribe({
  next:(res)=>{
    //console.log(res);
    this.showNotification("snackbar-success",
    "User added with success" ,
    "bottom",
    "center")
this.resertFrom();
window.scroll({
  top: 0,
  left: 0,
  behavior: 'smooth'
});


  },
  error:(err)=> {
    //console.log(err);
    this.showNotification("snackbar-danger",err,"bottom","center");
  //  this.docForm.reset();
    this.docForm.markAsPristine();
        this.docForm.markAsUntouched();
        this.docForm.updateValueAndValidity();
       this.docForm.markAsUntouched();
  }
})

  }else{
    this.showNotification("snackbar-danger",
    "verify your passwords" ,
    "bottom",
    "center")
  }
}
}
