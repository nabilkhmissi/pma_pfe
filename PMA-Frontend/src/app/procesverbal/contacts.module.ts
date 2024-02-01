import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AdvanceTableRoutingModule } from "./contacts-routing.module";
import { ProcesverbalComponent } from "./procesverbal.component";
import { FormComponent as contactForm } from "./form/form.component";
import { DeleteComponent } from "./delete/delete.component";
import { MatTableExporterModule } from "mat-table-exporter";

import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatButtonModule } from "@angular/material/button";
import { MatRadioModule } from "@angular/material/radio";
import { MatIconModule } from "@angular/material/icon";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatSelectModule } from "@angular/material/select";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

import { MatCardModule } from "@angular/material/card";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSortModule } from "@angular/material/sort";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatMenuModule } from "@angular/material/menu";
import { ContactsService } from "./contacts.service";
import { ComponentsModule } from "../shared/components/components.module";
import { MatTooltipModule } from "@angular/material/tooltip";
import { SharedModule } from "../shared/shared.module";

@NgModule({
  declarations: [ProcesverbalComponent, contactForm, DeleteComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AdvanceTableRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule,
    MatSelectModule,
    MatCheckboxModule,
    MatCardModule,
    MatDatepickerModule,
    MatDialogModule,
    MatSortModule,
    MatSelectModule,
    MatToolbarModule,
    MatMenuModule,
    MatTooltipModule,
    MatTableExporterModule,
    MatProgressSpinnerModule,
    ComponentsModule,
    SharedModule
  ],
  providers: [ContactsService],
})
export class ContactsModule { }
