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
import {Qualification} from "../../utils/Qualification";
import {MatSort, MatSortHeader} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {MatDivider} from "@angular/material/divider";
import {MatIcon} from "@angular/material/icon";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {getErrorString} from "../../utils/Utils";

@Component({
  selector: "delete-dialog",
  templateUrl: "edit-employee-dialog.html",
  styleUrl: "edit-employee-dialog.css",
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
    ReactiveFormsModule,
    MatProgressSpinner
  ]
})
export class EditEmployeeDialog implements OnInit {
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
  saving: boolean = false;

  firstNameValidation = new FormControl("", [Validators.required]);
  lastNameValidation = new FormControl("", [Validators.required]);
  streetValidation = new FormControl("", [Validators.required]);
  postcodeValidation = new FormControl("", [Validators.pattern("^[0-9]{5}$")]);
  cityValidation = new FormControl("", [Validators.required]);
  phoneValidation = new FormControl("", [Validators.required]);

  constructor(
    protected dialogRef: MatDialogRef<EditEmployeeDialog>,
    private api: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: Employee,
  ) {}

  ngOnInit() {
    this.api.getAllQualifications().then(data => {
      this.dataSource.data = data;

      if(this.data.id !== undefined)
        data.forEach(i => this.hasQualification(i.id!) ? this.selection.select(i) : null);
    }).catch(error => alert(getErrorString(error)));

    this.firstNameValidation.setValue(this.data.firstName!);
    this.lastNameValidation.setValue(this.data.lastName!);
    this.streetValidation.setValue(this.data.street!);
    this.postcodeValidation.setValue(this.data.postcode!);
    this.cityValidation.setValue(this.data.city!);
    this.phoneValidation.setValue(this.data.phone!);

    if(this.data.id !== undefined) {
      this.firstNameValidation.markAllAsTouched();
      this.lastNameValidation.markAllAsTouched();
      this.streetValidation.markAllAsTouched();
      this.postcodeValidation.markAllAsTouched();
      this.cityValidation.markAllAsTouched();
      this.phoneValidation.markAllAsTouched();
    }
  }

  saveEmployee() {
    this.saving = true;
    let newEmployee: EmployeePut = new EmployeePut(
      this.lastNameValidation.value!,
      this.firstNameValidation.value!,
      this.streetValidation.value!,
      this.postcodeValidation.value!,
      this.cityValidation.value!,
      this.phoneValidation.value!,
      this.selection.selected.map(skill => skill.id!)
    );

    if(this.data.id === undefined) {
      this.api.createEmployee(newEmployee).then(_ => this.finish()).catch(error => {
        alert(getErrorString(error));
        this.saving = false;
      });
    }else {
      this.api.updateEmployee(newEmployee, this.data.id!)
        .then(_ => this.finish())
        .catch(error => {
        alert(getErrorString(error));
        this.saving = false;
      });
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

  hasQualification(qualificationId: number) {
    console.log(this.data.skillSet);
    return this.data.skillSet!.some(skill => skill.id === qualificationId);
  }

  finish() {
    this.reloadEmployeeList.emit();
    this.dialogRef.close();
  }
}
