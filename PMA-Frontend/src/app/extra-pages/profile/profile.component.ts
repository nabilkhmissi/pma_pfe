import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/service/auth.service';
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {

  id: any;
  CurrentUser: any;
  fullname: String;
  phone: String;
  role: string;
  isdisable: true
  userdata
  SecuForm: UntypedFormGroup;
  accForm: UntypedFormGroup
  constructor(private authServ: AuthService, private fb: UntypedFormBuilder, private snackBar: MatSnackBar) {
    this.SecuForm = this.fb.group({
/*       fullName: ["",[Validators.required]],
 */      password: ["", [Validators.required]],
      newpassword: ["", [Validators.required]],
    });
    this.accForm = this.fb.group({
      fullName: ["", [Validators.required]],
      City: ["", [Validators.required]],
      phone: ["", [Validators.required]],
      Country: ["", [Validators.required]],
      Address: ["", [Validators.required]],
      nationality: ["", [Validators.required]],
      Img: [""]
    })


  }
  ngOnInit() {

    this.CurrentUser = this.authServ.currentUserValue;
    this.authServ.getUserById(this.CurrentUser.id).subscribe({
      next: (res) => {
        this.userdata = res
        this.accForm = this.fb.group({
          fullName: [this.userdata.fullName, [Validators.required]],
          City: ["", [Validators.required]],
          phone: [this.userdata.phone, [Validators.required]],
          Country: ["", [Validators.required]],
          Address: [this.userdata.address, [Validators.required]],
          nationality: [this.userdata.nationality, [Validators.required]],
          Img: [""]
        })
        //console.log("userdata",this.userdata);
      }
    })




  }

  getuser(id: any) {
    this.authServ.getUserById(id).subscribe({
      next: (res) => {

        this.CurrentUser = res;
        //console.log(this.CurrentUser);

      },
      error: (err) => {
        console.log(err);

      }

    })
  }
  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, "", {
      duration: 1000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }

  SaveSecSettings() {
    let passwordchange = {

      "password": this.SecuForm.value.newpassword

    }
    // console.log("newpass",passwordchange);

    let check = {
      "id": this.CurrentUser.id,
      "password": this.SecuForm.value.password
    }
    this.authServ.checkpass(check).subscribe({
      next: (res) => {
        if (res == "ok") {
          //  console.log("ok");

          this.authServ.updateuser(this.CurrentUser.id, passwordchange).subscribe({
            next: (res) => {
              console.log(res);
              this.showNotification("snackbar-success",
                " password updated ",
                "bottom",
                "center")
              this.SecuForm.reset();
              this.SecuForm.controls.password.setErrors(null);
              this.SecuForm.controls.newpassword.setErrors(null)

            },
            error: (err) => {
              console.log(err);

            }

          })

        }

      },
      error: (err) => {
        console.log(err);
        this.showNotification("snackbar-danger",
          "current password not correct",
          "bottom",
          "center")

      }
    })



  }

  getClassNme(): string {
    if (this.CurrentUser.roles == "Admin") {
      return 'l-bg-purple-dark'
    } else if (this.CurrentUser.roles == "Engineer" || this.CurrentUser.roles == "Team Leader") {
      return 'l-bg-green-dark'
    }
    else { return 'l-bg-cyan' }
  }


  Save() {

    let formdata = new FormData();


    let add = this.accForm.value.Country + " ," + this.accForm.value.City + " ," + this.accForm.value.Address
    formdata.append("fullName", this.accForm.value.fullName)
    formdata.append("phone", this.accForm.value.phone)
    formdata.append("address", add)
    formdata.append("nationality", this.accForm.value.nationality)
    formdata.append("image", this.accForm.value.Img, this.accForm.value.Img.name)

    //console.log("acc",formdata);
    this.authServ.updateuser(this.CurrentUser.id, formdata).subscribe({
      next: (res) => {
        //console.log(res);
        this.showNotification("snackbar-success",
          " informations updated ",
          "bottom",
          "center")
        this.getuser(this.CurrentUser.id);
        add = ""
        this.accForm.reset();
        this.accForm.controls.City.setErrors(null);
        this.accForm.controls.Country.setErrors(null)
        this.accForm.controls.phone.setErrors(null)
        this.accForm.controls.fullName.setErrors(null)
        this.accForm.controls.Address.setErrors(null)
        this.accForm.controls.nationality.setErrors(null)

      },
      error: (err) => {
        console.log(err);

      }

    })

  }
}


