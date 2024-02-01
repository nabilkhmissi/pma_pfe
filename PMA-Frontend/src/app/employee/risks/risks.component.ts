import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'src/app/core/service/auth.service';
import { RisksService } from 'src/app/core/service/risks.service';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';
import { DeleteComponent } from './dialogs/delete/delete.component';
import { FormComponent } from './dialogs/form/form.component';

@Component({
  selector: 'app-risks',
  templateUrl: './risks.component.html',
  styleUrls: ['./risks.component.sass']
})
export class RisksComponent extends UnsubscribeOnDestroyAdapter
implements OnInit
{
displayedColumns = [

  "Title",
  "project",


  "impact",
  "date",
  "details",


  "actions",
];

dataSource: MatTableDataSource<any> | null;
index: number;
id: number;
myRisks: any | null;
constructor(
  public httpClient: HttpClient,
  public dialog: MatDialog,
  public myRiskServ: RisksService,
  private snackBar: MatSnackBar,
  private authSer:AuthService
) {
  super();
}
@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
@ViewChild(MatSort, { static: true }) sort: MatSort;
@ViewChild("filter", { static: true }) filter: ElementRef;
ngOnInit() {
  //this.loadData();
  this.myRiskServ.getProbyUSer(this.authSer.currentUserValue.id).subscribe({
    next: (data) => {
      this.dataSource=new MatTableDataSource(data)
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
     // console.log("mytasks",this.dataSource.data);


    },
    error: (err) => {
      this.snackBar.open(err, "Close", {
        duration: 1000,
        });
        }
  })
}
refresh() {
  //this.loadData();
  this.myRiskServ.getProbyUSer(this.authSer.currentUserValue.id).subscribe({
    next: (data) => {
      this.dataSource=new MatTableDataSource(data)
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      //console.log("mytasks",this.dataSource.data);


    },
    error: (err) => {
      this.snackBar.open(err, "Close", {
        duration: 1000,
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
      myRisks: this.myRisks,
      action: "add",
    },
    direction: tempDirection,
  });
  this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
    if (result === 1) {

    //  console.log(  "ffffffffffffff",this.myRiskServ.getDialogData());
let t=this.myRiskServ.getDialogData()
      // After dialog is closed we're doing frontend updates
      // For add we're just pushing a new row inside DataServicex
     this.dataSource.data= this.dataSource.data.concat(t)
     // this.refresh()
      this.refreshTable();
      this.showNotification(
        "snackbar-success",
        "Add Reclamations Successfully...!!!",
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
  const dialogRef = this.dialog.open(FormComponent, {
    data: {
      myRisks: row,
      action: "edit",
    },
    direction: tempDirection,
  });
  this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
    if (result === 1) {
      const foundIndex = this.dataSource.data.findIndex(
        (x:any) => x._id == this.id
      );

    //  console.log("dtaa dilag",this.myRiskServ.getDialogData());
      let risks=[]
      risks=this.dataSource.data
      //console.log("",foundIndex);

      risks[foundIndex]=this.myRiskServ.getDialogData()
      this.dataSource.data=risks
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
  this.id = row._id;
  let tempDirection;
  if (localStorage.getItem("isRtl") === "true") {
    tempDirection = "rtl";
  } else {
    tempDirection = "ltr";
  }
  const dialogRef = this.dialog.open(DeleteComponent, {
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

applyfilter(filter:any){
  this.dataSource.filter=filter.target.value
}

private refreshTable() {
  this.paginator._changePageSize(this.paginator.pageSize);
}
/*
detailsCall(row) {
  this.dialog.open(FormDialogComponent, {
    data: {
      myRisks: row,
      action: "details",
    },
    height: "60%",
    width: "45%",
  });
} */

showNotification(colorName, text, placementFrom, placementAlign) {
  this.snackBar.open(text, "", {
    duration: 2000,
    verticalPosition: placementFrom,
    horizontalPosition: placementAlign,
    panelClass: colorName,
  });
}


setupFilter() {
  this.dataSource.filterPredicate = (d: any, filter: string) => {
//console.log("filter ", filter);

    const projectName = d.Project.Projectname;
    const Action = d.description;
    const Title = d.Titre;
    const Type_Communication =d.Type_Communication;
    //const mem=d.equipe.fullName
    const username=d.Sender.fullName

    //const filterValue = filter.;

    // Return true if the project name contains the filter value
    return projectName.indexOf(filter)!==-1||Title.indexOf(filter)!==-1||Type_Communication.indexOf(filter)!==-1||username.indexOf(filter)!==-1||Action.indexOf(filter)!==-1;
/*       return textToSearch.indexOf(filter) !== -1;
*/    };
}
}
