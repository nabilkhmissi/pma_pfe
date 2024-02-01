import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { timer } from 'rxjs';
import { AuthService } from 'src/app/core/service/auth.service';
import { SenderService } from 'src/app/core/service/sender.service';

@Component({
  selector: 'app-validatecode',
  templateUrl: './validatecode.component.html',
  styleUrls: ['./validatecode.component.sass']
})
export class ValidatecodeComponent {
  codeForm: UntypedFormGroup;
  submitted = false;
email:string;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private authService: AuthService,
    private senderService:SenderService,
    private snackBar: MatSnackBar,

  ) {}

  ngOnInit() {
    this.codeForm = this.formBuilder.group({
      code: ["", Validators.required],
    });
  ////console.log("email from forgot ",this.senderService.email);

  }

  get f() {
    return this.codeForm.controls;
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
    this.submitted=true;

    if(this.codeForm.invalid){
      return;
    }else {
      var data = {
        code:this.f.code.value,
        email:this.senderService.email
      }
      ////console.log("dddddd",typeof(data.email));

      this.authService.validateCode(data).subscribe({
        next:(res)=>{
          this.showNotification( "snackbar-success",
          "code Validated ",
          "bottom",
          "center")
          //console.log(res);
          let result=res
          this.senderService.id=result;

          const sub=timer(3000).subscribe(() => {
            this.router.navigate(["authentication/locked"]);}

        )
        sub


        },
        error:(err)=>{
          this.showNotification( "snackbar-danger",
         err,
          "bottom",
          "center");

        }
      })
    }
  }
}
