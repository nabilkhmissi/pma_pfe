import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";

import { HttpClient } from "@angular/common/http";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { DataSource } from "@angular/cdk/collections";
import { BehaviorSubject, fromEvent, merge, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { UnsubscribeOnDestroyAdapter } from "src/app/shared/UnsubscribeOnDestroyAdapter";
import { MatTableDataSource } from "@angular/material/table";
import { RisksService } from "src/app/core/service/risks.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialog } from "@angular/material/dialog";
import { DeleteRComponent } from "./dialog/delete-r/delete-r.component";


@Component({
  selector: 'app-expense',
  templateUrl: './risks.component.html',
  styleUrls: ['./risks.component.sass'],
})
export class RisksComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{
  filterToggle = false;
  displayedColumns = [
    "Title",
    "Project",
    "User",
    "Action",
    "Impact",
    "Date",
    "Details",
    "actions",
  ];


  dataSource:  MatTableDataSource<any[]>;
  id: number;
  index: number;
  leaves: any | null;
  //filter:string

  constructor(
    public httpClient: HttpClient,
    private riskSer:RisksService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,

  ) {
    super();
  }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild("filter", { static: true }) filter: ElementRef;
  ngOnInit() {
   // this.loadData();
   this.riskSer.getAllProblemes().subscribe({
    next:(res)=>{
      this.dataSource= new MatTableDataSource(res);
      this.dataSource.paginator=this.paginator;
      this.dataSource.sort=this.sort
    }
   })
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
    const dialogRef = this.dialog.open(DeleteRComponent, {
      height: "415px",
      width: "390px",
      data: row,
      direction: tempDirection,
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
               // for delete we use splice in order to remove single object from DataSource

       this.dataSource.data=this.dataSource.data.filter((item:any)=>{
        return item._id !== this.id;
       });


        // for delete we use splice in order to remove single object from DataService

       // this.refresh()
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

  refresh(): void{
    this.riskSer.getAllProblemes().subscribe({
    next:(res)=>{
      this.dataSource=new MatTableDataSource(res);
      this.dataSource.paginator=this.paginator;
      this.dataSource.sort=this.sort
    },
    error:(err)=>{
      console.log(err);

    }
  })}

  applyfilter(filter:any){
    this.dataSource.filter=filter.target.value
  }
  setupFilter() {
    this.dataSource.filterPredicate = (d: any, filter: string) => {
console.log("filter ", filter);

      const projectName = d.project.Projectname;
      const Action = d.action;
      const Title = d.title;
      const Impact =d.impact;
      const Date=d.date
      const username=d.user.fullName

      //const filterValue = filter.;

      // Return true if the project name contains the filter value
      return projectName.indexOf(filter)!==-1||Title.indexOf(filter)!==-1||Impact.indexOf(filter)!==-1||Date.indexOf(filter)!==-1||username.indexOf(filter)!==-1||Action.indexOf(filter)!==-1;
  /*       return textToSearch.indexOf(filter) !== -1;
  */    };
  }
}

