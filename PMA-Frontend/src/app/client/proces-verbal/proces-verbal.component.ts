import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Project } from 'src/app/admin/projects/all-projects/core/project.model';
import { AuthService } from 'src/app/core/service/auth.service';
import { ProcesVerbalService } from 'src/app/core/service/proces-verbal.service';
import { ProjectsService } from 'src/app/core/service/projects.service';
import { FormComponent } from 'src/app/procesverbal/form/form.component';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';
import html2pdf from 'html2pdf.js';


@Component({
  selector: 'app-proces-verbal',
  templateUrl: './proces-verbal.component.html',
  styleUrls: ['./proces-verbal.component.sass']
})
export class ProcesVerbalComponent extends UnsubscribeOnDestroyAdapter
implements OnInit
{
  idProject:string
  project:Project[]
  filterToggle = false;
  displayedColumns = [

    "Titre",
    "description",
    "Project",
    "Type_Communication",
    "Sender",
    "Present",
   // "actions",
  ];

  dataSource: MatTableDataSource<any[]>;

  id: number;
  pv: any | null;

  
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    private authSer:AuthService,
    private procesServ:ProcesVerbalService,
    private projectServ:ProjectsService,
    private snackBar: MatSnackBar
  ) {
    super();
  }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild("filter", { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: "0px", y: "0px" };

  ngOnInit() {
  this.projectServ.getprojectbyClient(this.authSer.currentUserValue.id).subscribe({
    next :(res)=>{
      for(let i=0 ; i<res.length;i++){
        this.project= res[i]
      }
      this.idProject=this.project["_id"]
      this.procesServ.getProcesByProject(this.idProject).subscribe({
        next :(res)=>{
          
         // console.log(res)
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error :(err)=>{
          this.snackBar.open("Erreur lors de la récupération des procés verbaux", "Fermer", {
            duration: 2000,
            });
            }
      })
      
    }
  })
  
  }
  


  refresh() {
    this.procesServ.getProcesByProject(this.idProject).subscribe({
      next :(res)=>{
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error :(err)=>{
        this.snackBar.open("Erreur lors de la récupération des procés verbaux", "Fermer", {
          duration: 2000,
          });
          }
    })
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
  // addNew() {
  //   let tempDirection;
  //   if (localStorage.getItem("isRtl") === "true") {
  //     tempDirection = "rtl";
  //   } else {
  //     tempDirection = "ltr";
  //   }
  //   const dialogRef = this.dialog.open(FormComponent, {
  //     data: {
  //       contacts: this.pv,
  //       action: "add",
  //     },

  //     direction: tempDirection,
  //   });
  //   this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
  //     if (result === 1) {
  //       // After dialog is closed we're doing frontend updates
  //       // For add we're just pushing a new row inside DataServicex
  //      /*  this.exampleDatabase.dataChange.value.unshift(
  //         this.contactsService.getDialogData()
  //       ); */
  //       console.log("ffffffffffffff",this.procesServ.getDialogDate());

  //       this.dataSources.data= this.dataSources.data.concat(this.procesServ.getDialogDate())

  //       this.refreshTable();
  //       this.showNotification(
  //         "snackbar-success",
  //         "Proces Verbal added Successfully...!!!",
  //         "bottom",
  //         "center"
  //       );
  //     }
  //   });
  // }
  detailsCall(row) {
    this.dialog.open(FormComponent, {
      data: {
        pv: row,
        action: "details",
      },
      height: "75%",
      width: "50%",
    });
  }
  toggleStar(row) {
    //console.log(row);
  }
  // editCall(row) {
  //   this.id = row.id;
  //   let tempDirection;
  //   if (localStorage.getItem("isRtl") === "true") {
  //     tempDirection = "rtl";
  //   } else {
  //     tempDirection = "ltr";
  //   }
  //   const dialogRef = this.dialog.open(FormComponent, {
  //     data: {
  //       pv: row,
  //       action: "edit",
  //     },
  //     direction: tempDirection,
  //   });
  //   this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
  //     if (result === 1) {
  //       const foundIndex = this.dataSources.data.findIndex(
  //         (x:any) => x._id == this.id
  //       );

  //       console.log("dtaa dilag",this.procesServ.getDialogDate());
  //       let procev=[]
  //       procev=this.dataSources.data
  //       console.log("",foundIndex);

  //       procev[foundIndex]=this.procesServ.getDialogDate()
  //       this.dataSources.data=procev
  //       this.refreshTable();
  //       this.showNotification(
  //         "black",
  //         "Edit Record Successfully...!!!",
  //         "bottom",
  //         "center"
  //       );
  //     }
  //   });
  // }
  applyfilter(filter:any){
    this.dataSource.filter=filter.target.value
  }
  // deleteItem(row) {
  //   this.id = row._id;
  //   let tempDirection;
  //   if (localStorage.getItem("isRtl") === "true") {
  //     tempDirection = "rtl";
  //   } else {
  //     tempDirection = "ltr";
  //   }
  //   const dialogRef = this.dialog.open(DeleteComponent, {
  //     height: "370px",
  //     width: "409px",
  //     data: row,
  //     direction: tempDirection,
  //   });
  //   this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
  //     if (result === 1) {
  //       this.dataSources.data=this.dataSources.data.filter((item:any)=>{
  //         return item._id !== this.id;
  //        });

  //       this.refreshTable();
  //       this.showNotification(
  //         "snackbar-danger",
  //         "Delete Record Successfully...!!!",
  //         "bottom",
  //         "center"
  //       );
  //     }
  //   });
  // }
  // private refreshTable() {
  //   this.paginator._changePageSize(this.paginator.pageSize);
  // }





  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, "", {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }
}