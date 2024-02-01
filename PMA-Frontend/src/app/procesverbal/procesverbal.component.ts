import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ContactsService } from "./contacts.service";
import { HttpClient } from "@angular/common/http";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { Contacts } from "./contacts.model";
import { DataSource } from "@angular/cdk/collections";
import { MatSnackBar } from "@angular/material/snack-bar";
import { BehaviorSubject, fromEvent, merge, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { MatMenuTrigger } from "@angular/material/menu";
import { SelectionModel } from "@angular/cdk/collections";
import { FormComponent } from "./form/form.component";
import { DeleteComponent } from "./delete/delete.component";
import { UnsubscribeOnDestroyAdapter } from "../shared/UnsubscribeOnDestroyAdapter";
import { MatTableDataSource } from "@angular/material/table";
import { AuthService } from "../core/service/auth.service";
import { ProcesVerbalService } from "../core/service/proces-verbal.service";
import { environment } from "src/environments/environment";

@Component({
  selector: 'app-procesverbal',
  templateUrl: './procesverbal.component.html',
  styleUrls: ['./procesverbal.component.sass'],
})
export class ProcesverbalComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit {
  filterToggle = false;
  displayedColumns = [

    "Titre",
    "description",
    "Project",
    "Type_Communication",
    "Sender",
    "Present",
    "actions",
  ];

  imageServer = `${environment.apiUrl}/static/images`;
  dataSource: MatTableDataSource<any[]>;

  id: number;
  pv: any | null;
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    private authSer: AuthService,
    private procesServ: ProcesVerbalService,
    private snackBar: MatSnackBar
  ) {
    super();
  }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild("filter", { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPositiondetailsCall = { x: "0px", y: "0px" };

  ngOnInit() {
    this.procesServ.getAllProcesVerbal().subscribe({
      next: (res) => {
        // console.log(res);

        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        this.snackBar.open("Erreur lors de la récupération des procés verbaux", "Fermer", {
          duration: 2000,
        });
      }
    })
  }
  refresh() {
    this.procesServ.getAllProcesVerbal().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        this.snackBar.open("Erreur lors de la récupération des procés verbaux", "Fermer", {
          duration: 2000,
        });
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
    const dialogRef = this.dialog.open(FormComponent, {
      data: {
        contacts: this.pv,
        action: "add",
      },

      direction: tempDirection,
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        //refresh data after dialog is closed
        this.ngOnInit();

        this.dataSource.data = this.dataSource.data.concat(this.procesServ.getDialogDate())

        this.refreshTable();
        this.showNotification(
          "snackbar-success",
          "Proces Verbal added Successfully...!",
          "bottom",
          "center"
        );
      }
    });
  }
  detailsCall(row) {
    this.dialog.open(FormComponent, {
      data: {
        pv: row,
        action: "details",
      },
      height: "90%",
      width: "70%",
    });
  }
  toggleStar(row) {
    // console.log(row);
  }
  editCall(row) {
    this.id = row._id;
    let tempDirection;
    if (localStorage.getItem("isRtl") === "true") {
      tempDirection = "rtl";
    } else {
      tempDirection = "ltr";
    }
    const dialogRef = this.dialog.open(FormComponent, {
      data: {
        pv: row,
        action: "edit",
      },
      direction: tempDirection,
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        const foundIndex = this.dataSource.data.findIndex(
          (x: any) => x._id == this.id
        );
        let procev = []
        procev = this.dataSource.data
        procev[foundIndex] = this.procesServ.getDialogDate()
        this.dataSource.data = procev
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
  applyfilter(filter: any) {
    this.dataSource.filter = filter.target.value
  }
  deleteItem(row) {
    this.id = row._id;
    let tempDirection;
    if (localStorage.getItem("isRtl") === "true") {
      tempDirection = "rtl";
    } else {
      tempDirection = "ltr";
    }
    const dialogRef = this.dialog.open(DeleteComponent, {
      height: "370px",
      width: "409px",
      data: row,
      direction: tempDirection,
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        this.dataSource.data = this.dataSource.data.filter((item: any) => {
          return item._id !== this.id;
        });

        this.refreshTable();
        this.showNotification(
          "snackbar-danger",
          "Delete Record Successfully...!",
          "bottom",
          "center"
        );
      }
    });
  }
  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }



  setupFilter() {
    this.dataSource.filterPredicate = (d: any, filter: string) => {
      //console.log("filter ", filter);

      const projectName = d.Project.Projectname;
      const Action = d.description;
      const Title = d.Titre;
      const Type_Communication = d.Type_Communication;
      //const mem=d.equipe.fullName
      const username = d.Sender.fullName

      //const filterValue = filter.;

      // Return true if the project name contains the filter value
      return projectName.indexOf(filter) !== -1 || Title.indexOf(filter) !== -1 || Type_Communication.indexOf(filter) !== -1 || username.indexOf(filter) !== -1 || Action.indexOf(filter) !== -1;
  /*       return textToSearch.indexOf(filter) !== -1;
  */    };
  }


  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, "", {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }
}
