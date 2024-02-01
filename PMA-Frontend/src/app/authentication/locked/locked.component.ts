import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from 'src/app/core/service/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SenderService } from 'src/app/core/service/sender.service';
import { timer } from 'rxjs';
@Component({
  selector: 'app-locked',
  templateUrl: './locked.component.html',
  styleUrls: ['./locked.component.scss'],
})
export class LockedComponent implements OnInit {
  passForm: UntypedFormGroup;
  submitted = false;
  default = '../../../assets/images/sa.jpg';
  userImg: string;
  userFullName: string;
  hide = true;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private authService: AuthService,
    private senderService: SenderService,
    private snackBar: MatSnackBar
  ) {}
  ngOnInit() {
    this.passForm = this.formBuilder.group({
      password: ['', Validators.required],
      cpassword: ['', Validators.required],
    });
    /*    this.userImg = this.authService.currentUserValue.img;
    this.userFullName =
      this.authService.currentUserValue.firstName +
      " " +
      this.authService.currentUserValue.lastName; */
  }
  get f() {
    return this.passForm.controls;
  }
  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 3000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }
  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.passForm.invalid) {
      return;
    } else {
      if (this.f.password.value == this.f.cpassword.value) {
      //  console.log('true');

        let ide = this.senderService.id;
       // console.log('forgot ide', ide);
        this.authService.changePswdAutorisation(ide.ide).subscribe({
          next: (res) => {
            if (res == "ok") {
              let data = {
                email: this.senderService.email,
                password: this.f.password.value,
              };
            //  console.log('aut', data);
              this.authService.change_psw(ide.ide, data).subscribe({
                next: (response) => {console.log(response);
                  this.showNotification(
                    'snackbar-success',
                    'password updated succefully',
                    'bottom',
                    'center'
                  );
                  const sub=timer(3000).subscribe(() => {
                    this.router.navigate(["authentication/signin"]);}

                )
                sub
                },
                error: (err) => {
                  this.showNotification(
                    'snackbar-danger',
                    'password cannot be updated',
                    'bottom',
                    'center'
                  );
                },
              });
            }
          },
          error: (err) => {

          },
        });
      } else {
        this.showNotification(
          'snackbar-danger',
          'verify that the two passwords are identical',
          'bottom',
          'center'
        );
      }
    }
  }
}
