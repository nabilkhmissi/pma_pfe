import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/service/auth.service';
import { SenderService } from 'src/app/core/service/sender.service';
import { TasksService } from 'src/app/core/service/tasks.service';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';
import { DeleteMyComponent } from './Dialogs/delete-my/delete-my.component';
import { FormMyComponent } from './Dialogs/form-my/form-my.component';
import { ProjectsService } from 'src/app/core/service/projects.service';

@Component({
  selector: 'app-my-tasks',
  templateUrl: './my-tasks.component.html',
  styleUrls: ['./my-tasks.component.sass']
})
export class MyTasksComponent   extends UnsubscribeOnDestroyAdapter
implements OnInit
{
displayedColumns = [

  "Title",
  "project",

  "status",
  //"type",
  "priority",
  "progress",
  "Start",
  "deadline",

  "actions",
];

dataSource: MatTableDataSource<any> | null;
index: number;
id: number;
loading:boolean=true
myTasks: any | null;
projects:any[]=[]
constructor(
  public httpClient: HttpClient,
  public dialog: MatDialog,
  public myTasksService: TasksService,
  private snackBar: MatSnackBar,
  private authSer:AuthService,private router:Router,
  private senderServ:SenderService,
  public projectServ: ProjectsService,

) {
  super();
}
@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
@ViewChild(MatSort, { static: true }) sort: MatSort;
@ViewChild("filter", { static: true }) filter: ElementRef;
ngOnInit() {
  this.projectServ.getProjectsByTeamleader(this.authSer.currentUserValue.id).subscribe(res=>{
    this.projects = res
    //console.log("pp",this.projects);

})
  this.fetchTasks()
  //this.loadData();
  // this.myTasksService.getTaskByExecutor(this.authSer.currentUserValue.id).subscribe({
  //   next: (data) => {
  //     this.dataSource=new MatTableDataSource(data)
  //     this.dataSource.paginator = this.paginator;
  //     this.dataSource.sort = this.sort;
  //   //  console.log("mytasks",this.dataSource.data);


  //   },
  //   error: (err) => {
  //     this.snackBar.open(err, "Close", {
  //       duration: 1000,
  //       });
  //       }
  // })
}
handleProjectSelect(e: any) {
  this.loading = true
  const project_id = e.target.value;
  if (project_id) {
    this.fetchTasksByProjectId(project_id);
  } else {
    this.fetchTasks();
  }
}
fetchTasksByProjectId(id: string) {
  this.myTasksService.getTaskbyproject(id).subscribe({
    next: (res) => {
      this.loading = false
      this.myTasks = res
      this.dataSource=new MatTableDataSource(this.myTasks)
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  })
}
fetchTasks() {
  this.myTasksService.getTaskByExecutor(this.authSer.currentUserValue.id).subscribe({
    next: (res) => {
      this.loading = false
      this.myTasks = res
      this.dataSource=new MatTableDataSource(this.myTasks)
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  })
}
refresh() {
  //this.loadData();
  this.myTasksService.getTaskByExecutor(this.authSer.currentUserValue.id).subscribe({
    next: (data) => {
      this.myTasks = data
      this.dataSource=new MatTableDataSource(this.myTasks)
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    //  console.log("mytasks",this.dataSource.data);


    },
    error: (err) => {
      this.snackBar.open(err, "Close", {
        duration: 1000,
        });
        }
  })
}
addNew(){
  let tempDirection;
  if (localStorage.getItem("isRtl") === "true") {
    tempDirection = "rtl";
  } else {
    tempDirection = "ltr";
  }
  const dialogRef = this.dialog.open(FormMyComponent, {
    data: {
      myTasks: this.myTasks,
      action: "add",
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
      setTimeout(() => {console.log("bbbbbb",this.senderServ.task);

      this.dataSource.data = this.dataSource.data.concat(this.senderServ.task)},1000)
      this.refreshTable();
      this.showNotification(
        "snackbar-success",
        "Add task Successfully...!!!",
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
  const dialogRef = this.dialog.open(FormMyComponent, {
    data: {
      myTasks: row,
      action: "edit",
    },
    direction: tempDirection,
  });
  this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
    if (result === 1) {
      const foundIndex = this.dataSource.data.findIndex(
        (x:any) => x._id == this.id
      );

     // console.log("dtaa dilag",this.myTasks.getDialogDate());
      let task=[]
      task=this.dataSource.data
     // console.log("",foundIndex);

      task[foundIndex]=this.myTasks.getDialogDate()
      this.dataSource.data=task
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
setupFilter(column: string,clo:string,col:string) {
  this.dataSource.filterPredicate = (d: any, filter: string) => {

    const projectName = d.Project.Projectname;
    const useName = d.Executor.fullName;
    const Title = d.Title;
    const Status =d.Status;
    const type=d.Type

    //const filterValue = filter.;

    // Return true if the project name contains the filter value
    return projectName.indexOf(filter)!==-1 ||useName.indexOf(filter)!==-1||Title.indexOf(filter)!==-1||Status.indexOf(filter)!==-1||type.indexOf(filter)!==-1;
/*       return textToSearch.indexOf(filter) !== -1;
*/    };
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
  const dialogRef = this.dialog.open(DeleteMyComponent, {
    height: "300px",
    width: "400px",
    data: row,
    direction: tempDirection,
  });
  this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
    if (result === 1) {
//delete task fom datasource
this.dataSource.data=this.dataSource.data.filter((item:any)=>{
return item._id !==this.id ;
})



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

detailsCall(row) {
  this.dialog.open(FormMyComponent, {
    data: {
      myTasks: row,
      action: "details",
    },
    height: "60%",
    width: "45%",
  });
}

showNotification(colorName, text, placementFrom, placementAlign) {
  this.snackBar.open(text, "", {
    duration: 2000,
    verticalPosition: placementFrom,
    horizontalPosition: placementAlign,
    panelClass: colorName,
  });
}
/* kanban(){
  this.router.navigate(["employee/KanbanTasks"]);
} */

}
