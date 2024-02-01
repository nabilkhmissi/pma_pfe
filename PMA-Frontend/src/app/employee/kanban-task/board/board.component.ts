import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/service/auth.service';
import { TasksService } from 'src/app/core/service/tasks.service';
import { TaskStatus } from '../core/task.model';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.sass'],
})
export class BoardComponent implements OnInit {
  public lists: object;

  constructor(
    //private projectService: ProjectService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private taskServ: TasksService,
    //private router:Router,
    private authSer: AuthService
  ) // private senderServ:SenderService

  {
    this.lists = {};
  }

  ngOnInit(): void {
    //throw new Error('Method not implemented.');
    this.getTask();
  }
  getTask() {
    this.taskServ
      .getTaskByExecutor(this.authSer.currentUserValue.id)
      .subscribe((tasks: any) => {
        this.lists = {
          PENDING: tasks.filter((task) => task.Status == TaskStatus.PENDING),
          OPEN: tasks.filter((task) => task.Status == TaskStatus.OPEN),
          CLOSED: tasks.filter((task) => task.Status == TaskStatus.CLOSED),
        };
      });
  }
  public unsorted(): void {
    // empty function to pass as an argument to keyvalue pipe in template
  }

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 1000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }
  public drop(event: CdkDragDrop<string[]>): void {
    if (event.previousContainer !== event.container) {
      const task = event.item.data;
      //console.log('before', task);
      //console.log('ddddddddd', TaskStatus[event.container.id]);

      task.Status = TaskStatus[event.container.id];
      let data = {
        Status: TaskStatus[event.container.id],
      };
      //task.Status = TaskStatus[event.container.id];
     // console.log('after', task);

    //  console.log(data);

      this.taskServ.updateTaskStatus(task._id,task).subscribe({
        next: (res) => {
        //  console.log('fffffffffff', res);
          this.getTask();
        },
      });
    }
  }

  /* removeTask(task:any){

      let tempDirection;
      if (localStorage.getItem("isRtl") === "true") {
        tempDirection = "rtl";
      } else {
        tempDirection = "ltr";
      }
      // open angular material dialog
      const dialogRef=this.dialog.open(DeleteComponent, {
        height: "350px",
        width: "400px",
        autoFocus: true,
        data: task,

        direction: tempDirection,
      });
      dialogRef.afterClosed().subscribe({
        next:(res)=>{
          setTimeout(() => { location.reload()},1000)

        }
      })
  } */
  getColor(k){
   // console.log(typeof(k))
      if(k=="PENDING"){
        return "col-red"
      }
      else if(k=="OPEN")
      { return "col-blue"}

      else if(k=="CLOSED")
      { return "col-green"}

    }


}
