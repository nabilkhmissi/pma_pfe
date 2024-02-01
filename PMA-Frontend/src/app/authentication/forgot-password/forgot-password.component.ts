import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { AuthService } from "src/app/core/service/auth.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { SenderService } from "src/app/core/service/sender.service";
import { timer } from "rxjs";

@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.scss"],
})
export class ForgotPasswordComponent implements OnInit {
  authForm: UntypedFormGroup;
  submitted = false;
  returnUrl: string;

  /* @Output() sendemail  =new EventEmitter();
 */
  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private authService :AuthService,
    private router:Router,
    private snackBar: MatSnackBar,
    private senderService:SenderService

  ) {}
  ngOnInit() {
    this.authForm = this.formBuilder.group({
      email: [
        "",
        [Validators.required, Validators.email, Validators.minLength(15)],
      ],
    });
    // get return url from route parameters or default to '/'
   // this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
  }
  get f() {
    return this.authForm.controls;
  }
  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, "", {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }
/*   sendemailtoValidateCode(email){
this.sendemail.emit(email)
  } */

  onSubmit() {



    this.submitted = true;
    // stop here if form is invalid
    if (this.authForm.invalid) {
      return;
    } else {
      let email={email:this.f.email.value};
     // console.log("ffffffffffffffffff",email);

      this.authService.forgotpasswd(email).subscribe(
        (res)=>{
       //   console.log("forgot",res);
          this.showNotification(
            "snackbar-success",
            "Check your email for to get the verification code ",
            "bottom",
            "center"
          );
          this.senderService.email=email.email;
          const sub=timer(3000).subscribe(() => {
            this.router.navigate(["authentication/Validatecode"]);}

        )
        sub
        },
        (err)=>{
          console.log("err",err);
          this.showNotification(
            "snackbar-danger",
            err,
            "bottom",
            "center"
          );
          return;
         // this.submitted=false;
        }
      )
    }
  }
}
