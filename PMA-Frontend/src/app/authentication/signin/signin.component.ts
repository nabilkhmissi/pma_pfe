import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { AuthService } from "src/app/core/service/auth.service";
import { Role } from "src/app/core/models/role";
import { UnsubscribeOnDestroyAdapter } from "src/app/shared/UnsubscribeOnDestroyAdapter";
import { MatSnackBar } from "@angular/material/snack-bar";
import { bottom } from "@popperjs/core";

@Component({
  selector: "app-signin",
  templateUrl: "./signin.component.html",
  styleUrls: ["./signin.component.scss"],
})
export class SigninComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{
  authForm: UntypedFormGroup;
  submitted = false;
  loading = false;
  error = "";
  hide = true;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar

  ) {
    super();
  }

  ngOnInit() {
    this.authForm = this.formBuilder.group({
      username: ["", Validators.required],
      password: ["", Validators.required],
    });
  }
  get f() {
    return this.authForm.controls;
  }
  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, "", {
      duration: 3000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }
  onSubmit() {
    this.submitted = true;
    this.loading = true;
    this.error = "";
    if (this.authForm.invalid) {
      this.error = "Username and Password not valid !";
      return;
    } else {
    this.subs.sink = this.authService
        .login(this.f.username.value, this.f.password.value)
        .subscribe(
          (res) => {
            if (res) {
                setTimeout(() => {
               const role = this.authService.currentUserValue.roles;
                if (role == Role.Admin) {
                  this.router.navigate(["/admin/dashboard/main"]);
                } else if (role == Role.Engineer){
                  this.router.navigate(["/employee/dashboard"]);
                } else if (role == Role.Client) {
                  this.router.navigate(["/client/dashboard"]);
                }
                else if(role==Role.TeamLeader){
                  this.router.navigate(["/TeamLeader/dashboard"])
                }
                else{
                  this.router.navigate(["authentication/signin"])
                }
                this.loading = false;

              }, 1000);
           //   this.authService.setAuthTimer(this.authService.currentUserValue.expiresIn)
            } else {
              this.error = "Invalid Login";
            }
          },
          (error) => {
            this.showNotification("snackbar-danger",error,"bottom","center")
          //his.error = error;
            this.submitted = false;
            this.loading = false;
          }
            );
    }
  }
}
