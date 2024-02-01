import { Component, OnInit } from "@angular/core";
import { Event, Router, NavigationStart, NavigationEnd } from "@angular/router";
import { PlatformLocation } from "@angular/common";
import { AuthService } from "./core/service/auth.service";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  currentUrl: string;
  constructor(public _router: Router, location: PlatformLocation,private authservice:AuthService,    private router: Router,
    ) {
    this._router.events.subscribe((routerEvent: Event) => {
      if (routerEvent instanceof NavigationStart) {
        // location.onPopState(() => {
        //   window.location.reload();
        // });
        this.currentUrl = routerEvent.url.substring(
          routerEvent.url.lastIndexOf("/") + 1
        );
      }
      if (routerEvent instanceof NavigationEnd) {
      }
      window.scrollTo(0, 0);
    });
  }
  ngOnInit(){}
  checkUserSession(){
if(this.authservice.currentUserValue===undefined || this.authservice.currentUserValue===null) {
  this.authservice.logout().subscribe((res) => {
    if (!res.success) {
      this.router.navigate(["/authentication/signin"]);
    }
  });
}
  }
}
