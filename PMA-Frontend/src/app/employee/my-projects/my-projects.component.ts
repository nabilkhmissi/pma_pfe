import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MyProjectsService } from './my-projects.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MyProjects } from './my-projects.model';
import { MatSnackBar } from '@angular/material/snack-bar';

import { MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { FormComponent } from './form/form.component';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';
import { MatTableDataSource } from '@angular/material/table';
import { ProjectsService } from 'src/app/core/service/projects.service';
import { AuthService } from 'src/app/core/service/auth.service';
import { SurveyComponent } from '../dashboard/survey/survey/survey.component';
import { RowHeightCache } from '@swimlane/ngx-datatable';
import { Router } from '@angular/router';
//import { Underline } from "angular-feather/icons";

@Component({
  selector: 'app-my-projects',
  templateUrl: './my-projects.component.html',
  styleUrls: ['./my-projects.component.sass'],
})
export class MyProjectsComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit {
  iduser: any;
  filterToggle = false;
  displayedColumns = [
    'title',
    'clientName',
    'startDate',
    'deadLine',
    'noOfMembers',
    'priority',
    'progress',
    'status',
    'actions',
  ];
  exampleDatabase: MyProjectsService | null;
  dataSource: MatTableDataSource<any[]>;
  id: number;
  f: boolean;

  myProjects: any | null;
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public projectServ: ProjectsService,
    private snackBar: MatSnackBar,
    private authServ: AuthService,
    private router : Router
  ) {
    super();
  }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };

  ngOnInit() {
    this.iduser = this.authServ.currentUserValue.id;
    //this.loadData();
    this.projectServ.getmyProject(this.authServ.currentUserValue.id).subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        //console.log('my Project', this.dataSource.data);

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  showDetails(project) {
    //console.log(project._id);

    //this.senderServ.project=project
    this.router.navigate(['employee/projectDetails', project._id]);
  }
  // detailsCall(row) {
  //   this.dialog.open(FormComponent, {
  //     data: {
  //       myProjects: row,
  //       action: 'details',
  //     },
  //     height: '80%',
  //     width: '56%',
  //   });
  // }
  toggleStar(row) {
    // console.log(row);
  }
  applyfilter(filter: any) {
    this.dataSource.filter = filter.target.value;
  }
  isNoted(r) {
    //console.log("hhhhhhhhh");
  }

  isCompleted(row) {
    if (row.note_equipe != null) {
      for (let i = 0; i < row.note_equipe.length; i++) {
        if (row.note_equipe[i].user === this.authServ.currentUserValue.id) {
          this.f = false;
          // console.log("jfjfjjfj" ,row.note_equipe[i].note, this.authServ.currentUserValue.id);
        }
      }
    }
    else {
      this.f = true;
    }


    /*
    (row.progress==100&&row.status=="Completed") */
    if (this.f == false && row.progress == 100 && row.status == 'Completed') {
      return true;
    } else return false;
  }
  Note(row) {
    let tempDirection;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(SurveyComponent, {
      height: '600px',
      width: '800px',
      data: {
        proj: row,
        action: 'add',
      },
      direction: tempDirection,
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        // After dialog is closed we're doing frontend updates
        // For add we're just pushing a new row inside DataServicex
        /* this.exampleDatabase.dataChange.value.unshift(
        this.myTasksService.getDialogData()
      ); */
        //this.refresh()
        // this.dataSource.data=this.dataSource.data.concat(this.projectServ.())
        //this.refreshTable();
        this.showNotification(
          'snackbar-success',
          'Add Note    Successfully...!!!',
          'bottom',
          'center'
        );
      }
    });
  }
  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }
}
