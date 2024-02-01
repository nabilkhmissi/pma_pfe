import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { DataSource } from "@angular/cdk/collections";
import { FormDialogComponent } from "./dialog/form-dialog/form-dialog.component";
import { DeleteDialogComponent } from "./dialog/delete/delete.component";
import { MatSnackBar } from "@angular/material/snack-bar";
import { BehaviorSubject, fromEvent, merge, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { SelectionModel } from "@angular/cdk/collections";
import { UnsubscribeOnDestroyAdapter } from "src/app/shared/UnsubscribeOnDestroyAdapter";
import { ClientsService } from "./clients.service";
import { Clients } from "./clients.model";
import { MatTableDataSource } from "@angular/material/table";
import { AuthService } from "src/app/core/service/auth.service";
//import { Third1Component } from "src/app/multilevel/thirdlevel/third1/third1.component";
@Component({
  selector: "app-all-clients",
  templateUrl: "./all-clients.component.html",
  styleUrls: ["./all-clients.component.sass"],
})
export class AllclientComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit {
  displayedColumns = [
    "img",
    "name",
    "mobile",
    "email",
    "company_name",
    "actions",
  ];
  dataSource: MatTableDataSource<any[]> | [];
  filter: string

  index: number;
  id: number;
  clients: Clients | null;
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public clientService: ClientsService,
    private snackBar: MatSnackBar,
    private authService: AuthService

  ) {
    super();
  }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  ngOnInit() {
    this.authService.getallCient().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

      },
      error: (err) => {
        console.log(err);
      }
    })
  }
  refresh() {
    this.authService.getallCient().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.filter = ""
      },
      error: (err) => {
        console.log(err);
      }
    })
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
        clients: this.clients,
        action: "add",
      },
      direction: tempDirection,
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        // After dialog is closed we're doing frontend updates
        // For add we're just pushing a new row inside DataService
        this.refreshTable();
        this.showNotification(
          "snackbar-success",
          "Add Record Successfully...!!!",
          "bottom",
          "center"
        );
      }
    });
  }
  editCall(row) {
    this.id = row.id;
    let tempDirection;
    if (localStorage.getItem("isRtl") === "true") {
      tempDirection = "rtl";
    } else {
      tempDirection = "ltr";
    }
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        clients: row,
        action: "edit",
      },
      direction: tempDirection,
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        // When using an edit things are little different, firstly we find record inside DataService by id
        this.ngOnInit();


        // And lastly refresh table
        this.refreshTable();
        this.showNotification(
          "black",
          "Edit Record Successfully...!!!",
          "bottom",
          "center"
        );
      }
    });
  }
  deleteItem(i: number, row) {
    this.index = i;
    this.id = row.id;
    let tempDirection;
    if (localStorage.getItem("isRtl") === "true") {
      tempDirection = "rtl";
    } else {
      tempDirection = "ltr";
    }
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      height: "300px",
      width: "420px",
      data: row,
      direction: tempDirection,
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {

        this.refresh()
        // for delete we use splice in order to remove single object from DataService
        this.refreshTable();
        this.showNotification(
          "snackbar-danger",
          "client deleted",
          "bottom",
          "center"
        );
      }
    });
  }
  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }

  applyfilter(filter: any) {
    this.dataSource.filter = filter.target.value
  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */


  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, "", {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }
}

