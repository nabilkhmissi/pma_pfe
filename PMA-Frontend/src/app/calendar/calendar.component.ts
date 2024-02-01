import { Component, ViewChild, OnInit } from "@angular/core";
import {
  CalendarOptions,
  DateSelectArg,
  EventClickArg,
  EventApi,
} from "@fullcalendar/core";
import { EventInput } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";

import { MatDialog } from "@angular/material/dialog";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { Calendar } from "./calendar.model";
import { FormDialogComponent } from "./dialogs/form-dialog/form-dialog.component";
import { CalendarService } from "./calendar.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { INITIAL_EVENTS } from "./events-util";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { UnsubscribeOnDestroyAdapter } from "../shared/UnsubscribeOnDestroyAdapter";
import { EventService } from "../core/service/event.service";
import { AuthService } from "../core/service/auth.service";

@Component({
  selector: "app-calendar",
  templateUrl: "./calendar.component.html",
  styleUrls: ["./calendar.component.scss"],
})
export class CalendarComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{
  @ViewChild("calendar", { static: false })
  calendar: any;
  public addCusForm: UntypedFormGroup;
  dialogTitle: string;
  filterOptions = "All";
  calendarData: any;
  filterItems: string[] = [
    "Work",
    "Personal",
    "Important",
    "Travel",
    "Friends",
  ];

  Events: any[]=[];
  tempEvents: any[]=[];
  currentEvents: EventApi[] = [];
  public filters = [
    { name: "Work", value: "Work", checked: true },
    { name: "Personal", value: "Personal", checked: true },
    { name: "Important", value: "Important", checked: true },
    { name: "Travel", value: "Travel", checked: true },
    { name: "Friends", value: "Friends", checked: true },
  ];

  constructor(
    private fb: UntypedFormBuilder,
    private dialog: MatDialog,
    //public calendarService: CalendarService,
    private snackBar: MatSnackBar,
    private eventServ:EventService,
    private authserv:AuthService
  ) {
    super();
    this.dialogTitle = "Add New Event";
    this.calendar = new Calendar({});
    this.addCusForm = this.createCalendarForm(this.calendar);
  }
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
    },
    initialView: "dayGridMonth",
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    events:[]
  };

  public ngOnInit(): void {
    this.getEvent();
   // this.calendarEvents = INITIAL_EVENTS;
   // this.tempEvents = this.Events;
    //this.calendarOptions.initialEvents = this.Events;



  }
  getEvent(){
    this.eventServ.getEventByuser(this.authserv.currentUserValue.id).subscribe({
      next:(res)=>{
        this.Events=res;
        //console.log("dddddddd",this.Events);

        this.Events.forEach(e=>{
          let data ={
            id:e._id,
            title:e.title,
            start:e.startDate,
            end:e.endDate,
            //category:e.category,
            allDay:true,
            groupId:e.category,
            details:e.details,
            className:e.className

          }
          this.tempEvents.push(data);
         // console.log("tmp",this.tempEvents);


        })
       //this.calendarOptions.initialEvents=this.Events
       this.calendarOptions.events=this.tempEvents
      // console.log(this.calendarOptions.initialEvents);


        //console.log(this.calendarOptions.initialEvents);

      }
    })
  }



  handleDateSelect(selectInfo: DateSelectArg) {
    this.addNewEvent();
  }

  addNewEvent() {
    let tempDirection;
    if (localStorage.getItem("isRtl") === "true") {
      tempDirection = "rtl";
    } else {
      tempDirection = "ltr";
    }
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        calendar: this.calendar,
        action: "add",
      },
      direction: tempDirection,
    });

    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === "submit") {
let data=this.eventServ.getDialogData()
        this.tempEvents = this.tempEvents.concat({
          // add new event data. must create new array
          id: data._id,
          title: data.title,
          start: data.startDate,
          end:data.endDate,
          className: data.className,
          groupId: data.category,
          details:data.details,
          allDay:true,

        });

        this.calendarOptions.events = this.tempEvents;
       // this.getEvent();
        this.addCusForm.reset();
        this.showNotification(
          "snackbar-success",
          "Add Record Successfully...!!!",
          "bottom",
          "center"
        );
      }
    });
  }

  changeCategory(event: MatCheckboxChange, filter) {
    if (event.checked) {
      this.filterItems.push(filter.name);
    } else {
      this.filterItems.splice(this.filterItems.indexOf(filter.name), 1);
    }
    this.filterEvent(this.filterItems);
  }

  filterEvent(element) {
    const list = this.tempEvents.filter((x) =>
      element.map((y) => y).includes(x.groupId)
    );

    this.calendarOptions.events = list;
  }

  handleEventClick(clickInfo: EventClickArg) {
    this.eventClick(clickInfo);
  }

  eventClick(row) {
    //console.log("rowwwww",row.event.id);

    const calendarData: any = {
      id: row.event.id,
      title: row.event.title,
      category: row.event.groupId,
      startDate: row.event.start,
      endDate: row.event.end,
      details: row.event.extendedProps.details,
    };
    let tempDirection;
    if (localStorage.getItem("isRtl") === "true") {
      tempDirection = "rtl";
    } else {
      tempDirection = "ltr";
    }
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        calendar: calendarData,
        action: "edit",
      },
      direction: tempDirection,
    });

    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === "submit") {
      /*   let data = this.eventServ.getDialogData();
       let edit={
          id: row.event.id,
          title: data.title,
          start: data.startDate,
          end:data.endDate,
          className: data.className,
          groupId: data.category,
          details:data.details,
          allDay:true,
        }
        this.tempEvents.forEach(function (element, index) {
          if (.id === element.id) {
            this.editEvent(index, edit);
          }
        }, this);
 */
       this.getEvent();
        this.showNotification(
          "snackbar-succes",
          "Edit Record Successfully...!!!",
          "bottom",
          "center"
        );
        this.addCusForm.reset();
      } else if (result === "delete") {
        //this.data = this.calendarService.getDialogData();
        this.tempEvents.forEach(function (element, index) {
          if (calendarData.id === element.id) {
            row.event.remove();
          }
        }, this);

        this.showNotification(
          "snackbar-danger",
          "Delete Record Successfully...!!!",
          "bottom",
          "center"
        );
      }
    });
  }

  editEvent(eventIndex, calendarData) {
    const calendarEvents = this.tempEvents.slice();
  const singleEvent = Object.assign({}, calendarEvents[eventIndex]);
    singleEvent.id = calendarData.id;
    singleEvent.title = calendarData.title;
    singleEvent.start = calendarData.start;
    singleEvent.end = calendarData.end;
    singleEvent.className = calendarData.className;
    singleEvent.groupId = calendarData.groupId;
    singleEvent.details = calendarData.details;
singleEvent.allDay=calendarData.allDay
    calendarEvents[eventIndex]= singleEvent;

    this.tempEvents=calendarEvents
   // console.log("bbbbbbbbbbbbb",this.Events );
     // reassign the array

    this.calendarOptions.events = this.tempEvents;
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
  }

  createCalendarForm(calendar): UntypedFormGroup {
    return this.fb.group({
      id: [calendar.id],
      title: [
        calendar.title,
        [Validators.required, Validators.pattern("[a-zA-Z]+([a-zA-Z ]+)*")],
      ],
      category: [calendar.category],
      startDate: [calendar.startDate, [Validators.required]],
      endDate: [calendar.endDate, [Validators.required]],
      details: [
        calendar.details,
        [Validators.required, Validators.pattern("[a-zA-Z]+([a-zA-Z ]+)*")],
      ],
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

  getClassNameValue(category) {
    let className: string;

    if (category === "work") className = "fc-event-success";
    else if (category === "personal") className = "fc-event-warning";
    else if (category === "important") className = "fc-event-primary";
    else if (category === "travel") className = "fc-event-danger";
    else if (category === "friends") className = "fc-event-info";

    return className;
  }
}
