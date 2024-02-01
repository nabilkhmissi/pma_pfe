import { Router, NavigationEnd } from "@angular/router";
import { DOCUMENT } from "@angular/common";
import {
  Component,
  Inject,
  ElementRef,
  OnInit,
  Renderer2,
  HostListener,
  OnDestroy,
} from "@angular/core";
import { ROUTES } from "./sidebar-items";
import { AuthService } from "src/app/core/service/auth.service";
import { Role } from "src/app/core/models/role";
@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.sass"],
})
export class SidebarComponent implements OnInit, OnDestroy {
  public sidebarItems: any[];
  public innerHeight: any;
  public bodyTag: any;
  listMaxHeight: string;
  listMaxWidth: string;
  userFullName: string;
  userImg: string;
  userType: any;
  headerHeight = 60;
  currentRoute: string;
  routerObj = null;
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    public elementRef: ElementRef,
    private router: Router,
    private authService :AuthService
  ) {
    const body = this.elementRef.nativeElement.closest("body");
    this.routerObj = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // close sidebar on mobile screen after menu select
        this.renderer.removeClass(this.document.body, "overlay-open");
      }
    });
  }
  @HostListener("window:resize", ["$event"])
  windowResizecall(event) {
    this.setMenuHeight();
    this.checkStatuForResize(false);
  }
  @HostListener("document:mousedown", ["$event"])
  onGlobalClick(event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.renderer.removeClass(this.document.body, "overlay-open");
    }
  }
  callToggleMenu(event: any, length: any) {
    if (length > 0) {
      const parentElement = event.target.closest("li");
      const activeClass = parentElement.classList.contains("active");

      if (activeClass) {
        this.renderer.removeClass(parentElement, "active");
      } else {
        this.renderer.addClass(parentElement, "active");
      }
    }
  }
  ngOnInit() {
   if (this.authService.currentUserValue) {
      const userRole = this.authService.currentUserValue.roles;
     // console.log("user oog",userRole[0]);

      this.userFullName =
        this.authService.currentUserValue.fullName ;

      this.userImg = this.authService.currentUserValue.image;

    /*   this.sidebarItems = ROUTES.filter(
        (x) =>{ x.role.includes(userRole) === true  || x.role.includes("All") === true
        console.log("xx",x);}

      ); */
      if (userRole == Role.Admin) {
        this.userType = Role.Admin;
      } else if (userRole == Role.Client) {
        this.userType = Role.Client ;
      } else if (userRole == Role.Engineer) {
        this.userType = Role.Engineer;
      }
      else if(userRole==Role.TeamLeader){
        this.userType = Role.TeamLeader;
      }
      else {
        this.userType = Role.Admin;
      }

    }

    this.sidebarItems = ROUTES.filter((sidebarItem) => sidebarItem.role.indexOf(this.userType)!==-1 ||sidebarItem.role.indexOf("All")!==-1  );
    this.initLeftSidebar();
    this.bodyTag = this.document.body;
  }
  ngOnDestroy() {
    this.routerObj.unsubscribe();
  }
  initLeftSidebar() {
    const _this = this;
    // Set menu height
    _this.setMenuHeight();
    _this.checkStatuForResize(true);
  }
  setMenuHeight() {
    this.innerHeight = window.innerHeight;
    const height = this.innerHeight - this.headerHeight;
    this.listMaxHeight = height + "";
    this.listMaxWidth = "500px";
  }
  isOpen() {
    return this.bodyTag.classList.contains("overlay-open");
  }
  checkStatuForResize(firstTime) {
    if (window.innerWidth < 1170) {
      this.renderer.addClass(this.document.body, "ls-closed");
    } else {
      this.renderer.removeClass(this.document.body, "ls-closed");
    }
  }
  mouseHover(e) {
    const body = this.elementRef.nativeElement.closest("body");
    if (body.classList.contains("submenu-closed")) {
      this.renderer.addClass(this.document.body, "side-closed-hover");
      this.renderer.removeClass(this.document.body, "submenu-closed");
    }
  }
  mouseOut(e) {
    const body = this.elementRef.nativeElement.closest("body");
    if (body.classList.contains("side-closed-hover")) {
      this.renderer.removeClass(this.document.body, "side-closed-hover");
      this.renderer.addClass(this.document.body, "submenu-closed");
    }
  }
  logout() {
   /*   this.authService.logout().subscribe((res) => {
      if (!res.success) {
        this.router.navigate(["/authentication/signin"]);
      }
    }); */
    this.authService.logout();
  }
}
