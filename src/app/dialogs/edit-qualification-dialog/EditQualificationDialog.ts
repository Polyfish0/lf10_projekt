import {Component, EventEmitter, Inject, OnInit, Output, ViewChild} from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Employee, EmployeePut} from "../../utils/Employee";
import {ApiService} from "../../utils/api.service";
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable,
  MatTableDataSource
} from "@angular/material/table";
import {MatCheckbox} from "@angular/material/checkbox";
import {SelectionModel} from "@angular/cdk/collections";
import {Qualification, QualificationPut} from "../../utils/Qualification";
import {MatSort, MatSortHeader} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {MatDivider} from "@angular/material/divider";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: "delete-dialog",
  templateUrl: "edit-qualification-dialog.html",
  styleUrl: "edit-qualification-dialog.css",
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDialogActions,
    MatButtonModule,
    MatDialogContent,
    MatDialogTitle,
    FormsModule,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCheckbox,
    MatCell,
    MatCellDef,
    MatHeaderRow,
    MatRow,
    MatHeaderRowDef,
    MatRowDef,
    MatSort,
    MatSortHeader,
    MatPaginator,
    MatDivider,
    MatIcon,
    ReactiveFormsModule
  ]
})
export class EditQualificationDialog implements OnInit {
  @Output() reloadEmployeeList = new EventEmitter<void>();

  @ViewChild(MatSort) set sort(sort: MatSort) {
    this.dataSource.sort = sort;
  }

  @ViewChild(MatPaginator) set paginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }

  displayedColumns: string[] = ["select", "id", "skill"];
  dataSource = new MatTableDataSource<Qualification>();
  selection = new SelectionModel<Qualification>(true, []);

  skillValidation = new FormControl("", [Validators.required]);

  constructor(
    protected dialogRef: MatDialogRef<EditQualificationDialog>,
    private api: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: Qualification,
  ) {}

  ngOnInit() {
    this.skillValidation.setValue(this.data.skill!);

    if(this.data.id !== undefined)
      this.skillValidation.markAllAsTouched();
  }

  saveQualification() {
    let newQualification: QualificationPut = new QualificationPut(this.skillValidation.value!)

    if(this.data.id === undefined) {
      this.api.createQualification(newQualification).then(_ => this.finish());
    }else {
      this.api.updateQualification(newQualification, this.data.id!).then(_ => this.finish());
    }
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  isAllSelected() {
    return this.dataSource.data.length === this.selection.selected.length;
  }

  applyFilter($event: KeyboardEvent) {
    const filterValue = ($event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  finish() {
    this.reloadEmployeeList.emit();
    this.dialogRef.close();
  }
}
