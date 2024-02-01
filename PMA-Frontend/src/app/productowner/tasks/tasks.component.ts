import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { DataSource } from "@angular/cdk/collections";
import { MatSnackBar } from "@angular/material/snack-bar";
import { BehaviorSubject, fromEvent, merge, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { FormDialogComponent } from "./dialogs/form-dialog/form-dialog/form-dialog.component";
import { DeleteComponent } from "./dialogs/delete/delete/delete.component";
import { SelectionModel } from "@angular/cdk/collections";
import { UnsubscribeOnDestroyAdapter } from "src/app/shared/UnsubscribeOnDestroyAdapter";
import { TasksService } from "../../core/service/tasks.service";
import { MatTableDataSource } from "@angular/material/table";
import { AuthService } from "../../core/service/auth.service";
import { ProjectsService } from "../../core/service/projects.service";
import { SenderService } from "src/app/core/service/sender.service";
@Component({
  selector: "app-task",
  templateUrl: "./tasks.component.html",
  styleUrls: ["./tasks.component.sass"],
})
export class TasksComponent  extends UnsubscribeOnDestroyAdapter
implements OnInit {

  filter:string
  displayedColumns = [
    "Title",
    "Project",
    //"client",
    "Status",
    //"Type",
    "Priority",
    "Executor",
    "Start",
    "Date",
    "Details",
    "Actions",
  ];
  filtredd: any
  project:any[]
  username:String
  user
  dataSource: MatTableDataSource<any[]> ;
  selection = new SelectionModel<any>(true, []);
  index: number;
  id: number;
  myTasks: any | null;
  projects: any[]=[];
  loading:boolean = true  
  nb_closed=0
  nb_open=0
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    private taskserv: TasksService,
    private snackBar: MatSnackBar,
    private authserv:AuthService,
    private projectserv:ProjectsService,
    private sender :SenderService
  ) {
    super();
  }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  //@ViewChild("filter", { static: true }) filter: ElementRef;
  ngOnInit() {
    //this.loadData();
//     this.taskserv.getTasksByTeamLeader(this.authserv.currentUserValue.id).subscribe({
//       next:(res :any)=>{
//         if(res){
//           this.dataSource=new MatTableDataSource(res);
//           this.dataSource.paginator=this.paginator;
//           this.dataSource.sort=this.sort
//         //console.log(this.dataSource.data);
// this.cal(this.dataSource.data)
//       }},
//       error:(err)=>{
//         console.log(err);

//       }
//     })
  this.projectserv.getProjectsByTeamleader(this.authserv.currentUserValue.id).subscribe(res=>{
    this.projects = res
  })
  this.fetchTasks()

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
    this.taskserv.getTaskbyproject(id).subscribe({
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
    this.taskserv.getTaskByExecutor(this.authserv.currentUserValue.id).subscribe({
      next: (res) => {
        this.loading = false
        this.myTasks = res
        this.dataSource=new MatTableDataSource(this.myTasks)
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    })
  }
  getProjectId(project: any): any {
    //console.log(project._id);
    return project._id;


  }
  refresh() {
    this.taskserv.getTasksByTeamLeader(this.authserv.currentUserValue.id).subscribe({
      next:(res :any)=>{
        if(res){
          this.dataSource=new MatTableDataSource(res);
          this.dataSource.paginator=this.paginator;
          this.dataSource.sort=this.sort
      //  console.log(this.dataSource.data);

      }},
      error:(err)=>{
        console.log(err);

      }
    })
  }
  applyfilter(filter:any){
    this.dataSource.filter=filter.target.value
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
        myTasks: this.myTasks,
        action: "add",
      },
      direction: tempDirection,
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
      setTimeout(() => {console.log("bbbbbb",this.sender.task);

      this.dataSource.data = this.dataSource.data.concat(this.sender.task)},1000)
       // this.dataSource.data=this.dataSource.data.concat(this.taskserv.getDialogData())
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
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        myTasks: row,
        action: "edit",
      },
      direction: tempDirection,
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
       //5555
        const foundIndex = this.dataSource.data.findIndex(
        (x:any) => x._id === this.id
      );
      let tasks=[]
      tasks=this.dataSource.data
      tasks[foundIndex]=this.taskserv.getDialogData()
      this.dataSource.data=tasks
        this.refresh();
        //this.refreshTable()
        this.showNotification(
          "snackbar-success",
          "Edit task Successfully...!!!",
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
      height: "325px",
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
  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }


  /** Selects all rows if they are not all selected; otherwise clear selection. */
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

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, "", {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }

  cal(tab:any[]){
    tab.forEach((item:any)=>{
      if(item.Status=="Open"){
        this.nb_open=this.nb_open+1
      }
      else{
        this.nb_closed++
      }
    })
  }
}
