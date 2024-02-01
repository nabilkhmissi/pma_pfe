import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormDialogComponent } from './dialog/form-dialog/form-dialog.component';
import { DeleteDialogComponent } from './dialog/delete/delete.component';

import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';

import { MatTableDataSource } from '@angular/material/table';
import { ReclamationService } from 'src/app/core/service/reclamation.service';
import { AuthService } from 'src/app/core/service/auth.service';
import { SenderService } from 'src/app/core/service/sender.service';

@Component({
  selector: 'app-claims',
  templateUrl: './claims.component.html',
  styleUrls: ['./claims.component.sass'],
})
export class ClaimsComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{
  displayedColumns = [
    'Code',
    'Title',
    'Type Reclamation',
    'Project Title',
    'status',
    'date of creation',
    'Comment',

    'actions',
  ];
  dataSource:MatTableDataSource<any[]>;
  index: number;
  id: number;
  claim: any | null;
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public ReclamServ: ReclamationService,
    private snackBar: MatSnackBar,
    private authSer:AuthService,
    private SenderSer:SenderService
  ) {
    super();
  }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  ngOnInit() {
   this.ReclamServ.getReclamtionByCleit(this.authSer.currentUserValue.id).subscribe({
    next:(res)=>{
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.paginator=this.paginator;
      this.dataSource.sort=this.sort;
    },
    error:(err)=>{
      console.log(err)
    }
   })
  }
  refresh() {
    this.ReclamServ.getReclamtionByCleit(this.authSer.currentUserValue.id).subscribe({
      next:(res)=>{
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator=this.paginator;
        this.dataSource.sort=this.sort;
      },
      error:(err)=>{
        console.log(err)
      }
     })
    }
    applyfilter(filter:any){
      this.dataSource.filter=filter.target.value
    }
  addNew() {
    let tempDirection;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        claim: this.claim,
        action: 'add',
      },
      direction: tempDirection,
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        setTimeout(() => {
          //console.log("bbbbbb",this.SenderSer.claim);

        this.dataSource.data = this.dataSource.data.concat(this.SenderSer.claim)},1000)
        //this.dataSource.data= this.dataSource.data.concat(this.SenderSer.claim)

        this.refreshTable();
        this.showNotification(
          'snackbar-success',
          'Add Record Successfully...!!!',
          'bottom',
          'center'
        );
      }
    });
  }
  editCall(row) {
    this.id = row._id;
    let tempDirection;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        claim: row,
        action: 'edit',
      },
      direction: tempDirection,
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        const foundIndex = this.dataSource.data.findIndex(
          (x:any) => x._id == this.id
        );

       // console.log("dtaa dilag",this.ReclamServ.getDialogData());
        let claims=[]
        claims=this.dataSource.data
        //console.log("",foundIndex);

        claims[foundIndex]=this.ReclamServ.getDialogData()
        this.dataSource.data=claims
        this.refreshTable();
        this.showNotification(
          'black',
          'Edit Record Successfully...!!!',
          'bottom',
          'center'
        );
      }
    });
  }
  deleteItem(i: number, row) {
    this.index = i;
    this.id = row._id;
    let tempDirection;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      height: '50%',
      width: '50%',
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
          'snackbar-danger',
          'Delete Record Successfully...!!!',
          'bottom',
          'center'
        );
      }
    });
  }
  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }


  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }
  setupFilter() {
    this.dataSource.filterPredicate = (d: any, filter: string) => {
//console.log("filter ", filter);

      const projectName = d.project.Projectname;
      //const Action = d.action;
      const Title = d.Title;
      const Impact =d.Type_Reclamation;
      const Status=d.status
     // const username=d.client.fullName

      //const filterValue = filter.;

      // Return true if the project name contains the filter value
      return projectName.indexOf(filter)!==-1||Title.indexOf(filter)!==-1||Impact.indexOf(filter)!==-1||Status.indexOf(filter)!==-1;
  /*       return textToSearch.indexOf(filter) !== -1;
  */    };
  }
}

