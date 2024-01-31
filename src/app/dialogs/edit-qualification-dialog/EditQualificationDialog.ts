import {Component, EventEmitter, Inject, OnInit, Output, ViewChild} from "@angular/core";
import {
  MAT_DIALOG_DATA, MatDialog,
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
import {MatCheckbox, MatCheckboxChange} from "@angular/material/checkbox";
import {SelectionModel} from "@angular/cdk/collections";
import {Qualification, QualificationPut} from "../../utils/Qualification";
import {MatSort, MatSortHeader} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {MatDivider} from "@angular/material/divider";
import {MatIcon} from "@angular/material/icon";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {getErrorString} from "../../utils/Utils";

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
    ReactiveFormsModule,
    MatProgressSpinner
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

  displayedColumns: string[] = ["select", "id", "lastName", "firstName"];
  dataSource = new MatTableDataSource<Employee>();
  selection = new SelectionModel<Employee>(true, []);
  skillValidation = new FormControl("", [Validators.required]);
  usersAlreadyHaveSkill: Employee[] = [];
  usersToAddToSkill: Employee[] = [];
  usersToRemoveFromSkill: Employee[] = [];
  saving: boolean = false;

  constructor(
    protected dialogRef: MatDialogRef<EditQualificationDialog>,
    private api: ApiService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: Qualification,
  ) {}

  ngOnInit() {
    this.skillValidation.setValue(this.data.skill!);
    this.api.getAllEmployee().then(result => {
      this.dataSource.data = result;
      this.dataSource.paginator!.pageIndex = 0;
      this.dataSource._updatePaginator(result.length);

      if(this.data.id !== undefined) {
        this.usersAlreadyHaveSkill = result.filter(element => element.skillSet?.some(
          skill => skill.id == this.data.id)
        );

        this.usersAlreadyHaveSkill.forEach(element => this.selection.select(element));
      }
    }).catch(error => {
      alert(getErrorString(error));
      this.saving = false;
    });

    if(this.data.id !== undefined)
      this.skillValidation.markAllAsTouched();
  }

  saveQualification() {
    let newQualification: QualificationPut = new QualificationPut(this.skillValidation.value!)

    if(this.data.id === undefined) {
      this.api.createQualification(newQualification)
        .then(newQualification => this.saveEmployeeQualifications(newQualification.skill!))
        .catch(error => {
          alert(getErrorString(error));
          this.saving = false;
        });
    }else {
      this.api.updateQualification(newQualification, this.data.id!)
        .then(_ => this.saveEmployeeQualifications(this.data.skill!))
        .catch(error => {
        alert(getErrorString(error));
        this.saving = false;
      });
    }
  }

  saveEmployeeQualifications(skill: string) {
    this.saving = true;
    Promise.all([
      ...this.usersToRemoveFromSkill.map(user => this.api.deleteQualificationFromUser(user.id!, skill).catch(error => {
        alert(getErrorString(error));
        this.saving = false;
      })),
      ...this.usersToAddToSkill.map(user => !this.usersAlreadyHaveSkill.some(i => i.id == user.id) ? this.api.addQualificationToUser(user.id!, skill).catch(error => {
        alert(getErrorString(error));
        this.saving = false;
      }) : Promise.resolve(null)),
    ]).then(r => this.finish());
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      this.usersToAddToSkill = [];
      this.usersToRemoveFromSkill = this.usersAlreadyHaveSkill.map(x => ({...x}));

      return;
    }

    this.selection.select(...this.dataSource.data);
    this.usersToRemoveFromSkill = [];
    this.usersToAddToSkill = this.dataSource.data.map(x => ({...x}));
  }

  employeeSelectedEvent($event: MatCheckboxChange, row: Employee) {
    if($event.checked) {
      this.removeFromArray(this.usersToRemoveFromSkill, row);
      this.usersToAddToSkill.push(row);
    }else {
      this.removeFromArray(this.usersToAddToSkill, row);
      this.usersToRemoveFromSkill.push(row);
    }
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

  removeFromArray(array: any[], element: any) {
    const index = array.indexOf(element, 0);
    if(index > -1)
      array.splice(index, 1);
  }
}
