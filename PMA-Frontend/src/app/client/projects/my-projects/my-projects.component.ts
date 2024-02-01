import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { DataSource } from "@angular/cdk/collections";
import { MatSnackBar } from "@angular/material/snack-bar";
import { BehaviorSubject, fromEvent, merge, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { FormDialogComponent } from "./dialogs/form-dialog/form-dialog.component";
import { SelectionModel } from "@angular/cdk/collections";
import { UnsubscribeOnDestroyAdapter } from "src/app/shared/UnsubscribeOnDestroyAdapter";
import { MyProjects } from "./my-projects.model";
import { DeleteComponent } from "./dialogs/delete/delete.component";
import { MatTableDataSource } from "@angular/material/table";
import { ProjectsService } from "src/app/core/service/projects.service";
import { AuthService } from "src/app/core/service/auth.service";
import { DialogNoteComponent } from "./dialogs/dialog-note/dialog-note.component";
import { Router } from "@angular/router";
import { SenderService } from "src/app/core/service/sender.service";
import { AddfileComponent } from "./dialogs/addfile/addfile.component";
@Component({
  selector: "app-myprojects",
  templateUrl: "./my-projects.component.html",
  styleUrls: ["./my-projects.component.sass"],
})
export class MyProjectsComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{
  displayedColumns = [
    "Project Name",
    "type",
    "Deadline",
    "Note",
    "progress",
/*     "price",
 */    "status",

    "actions",
  ];
  dataSource: MatTableDataSource<any[]> | null;
  index: number;
  id: number;
  myProject: any | null;
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public projectServ: ProjectsService,
    private snackBar: MatSnackBar,
    private authSer:AuthService,
   private router :Router,
   private sender:SenderService,
  ) {
    super();
  }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild("filter", { static: true }) filter: ElementRef;
  ngOnInit() {
    //this.loadData();
    this.projectServ.getprojectbyClient(this.authSer.currentUserValue.id).subscribe({
      next: (response) => {
        this.dataSource = new MatTableDataSource(response);
      this.dataSource.paginator=this.paginator;
      this.dataSource.sort=this.sort;
      },
      error:(err)=>{
        console.log(err);

      }
    })
  }
  refresh() {
    this.projectServ.getprojectbyClient(this.authSer.currentUserValue.id).subscribe({
      next: (response) => {
      this.dataSource=new MatTableDataSource(response);
      this.dataSource.paginator=this.paginator;
      this.dataSource.sort=this.sort;
      },
      error:(err)=>{
        console.log(err);

      }
    })
  }
  rate(row){
    let tempDirection;
    if (localStorage.getItem("isRtl") === "true") {
      tempDirection = "rtl";
    } else {
      tempDirection = "ltr";
    }
    const dialogRef = this.dialog.open(DialogNoteComponent, {
      data: {


        myProjects: row,
        action: "edit",
      },
      direction: tempDirection,
      width:" 60%",
      height: "70%",
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {

        this.refresh()
        this.refreshTable();
        this.showNotification(
          "snackbar-success",
          "Note assigned Successfully...!!!",
          "bottom",
          "center"
        );



      }})
  }

  addfile(row){
    let tempDirection;
    if (localStorage.getItem("isRtl") === "true") {
      tempDirection = "rtl";
    } else {
      tempDirection = "ltr";
    }
    const dialogRef = this.dialog.open(AddfileComponent, {
      data: {
        project:row,
        action: "add",
      },
      direction: tempDirection,
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {

        this.refreshTable();
        this.showNotification(
          "snackbar-success",
          "Appreciation letter added Successfully...!!!",
          "bottom",
          "center"
        );
      }
    });
  }
  addNew() {
    let tempDirection;
    if (localStorage.getItem("isRtl") === "true") {
      tempDirection = "rtl";
    } else {
      tempDirection = "ltr";
    }
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        user: this.authSer.currentUserValue,
        action: "add",
      },
      direction: tempDirection,
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        setTimeout(() => {console.log("bbbbbb",this.sender.project);

        this.dataSource.data = this.dataSource.data.concat(this.sender.project)},1000)
      //  this.refresh()
        // After dialog is closed we're doing frontend updates
        this.refreshTable();
        this.showNotification(
          "snackbar-success",
          "Project added Successfully...!!!",
          "bottom",
          "center"
        );
      }
    });
  }

  editCall(row) {
    this.id = row._id;
    let tempDirection;
    if (localStorage.getItem("isRtl") === "true") {
      tempDirection = "rtl";
    } else {
      tempDirection = "ltr";
    }
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        myProjects: row,
        action: "edit",
      },
      direction: tempDirection,
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        const foundIndex = this.dataSource.data.findIndex(
          (x:any) => x._id == this.id
        );

        //console.log("dtaa dilag",this.projectServ.getDialogData());
        let proj=[]
        proj=this.dataSource.data
        //console.log("",foundIndex);

        proj[foundIndex]=this.projectServ.getDialogData()
        this.dataSource.data=proj
       // this.refresh()
        this.refreshTable();
        this.showNotification(
          "black",
          "Project edited Successfully...!!!",
          "bottom",
          "center"
        );
      }
    });
  }
  deleteItem(i: number, row) {
    this.index = i;
    this.id = row._id;
    let tempDirection;
    if (localStorage.getItem("isRtl") === "true") {
      tempDirection = "rtl";
    } else {
      tempDirection = "ltr";
    }
    const dialogRef = this.dialog.open(DeleteComponent, {
      height: "360px",
      width: "400px",
      data: row,
      direction: tempDirection,
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {


        this.dataSource.data=this.dataSource.data.filter((item:any)=>{
          return item._id !== this.id;
         });
         this.refreshTable();
        this.showNotification(
          "snackbar-danger",
          "Delete Record Successfully...!!!",
          "bottom",
          "center"
        );
      }
    });
  }
  showDetails(row){

    this.router.navigate(["client/projects/projectDetails",row._id])
  }



  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }



  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, "", {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }

  applyfilter(filter:any){
    this.dataSource.filter=filter.target.value
  }
  checkp(row){
    if((row.status==="Completed" &&  row.progress===100) ){
      this.rate(row)
     // console.log("fffffffffff");

    }

  }
}

