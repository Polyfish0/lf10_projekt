import {Component, EventEmitter, Inject, Output} from "@angular/core";
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
import {FormsModule} from "@angular/forms";
import {Employee} from "../../utils/Employee";
import {ApiService} from "../../utils/api.service";
import {Qualification} from "../../utils/Qualification";
import {TypeofExpr} from "@angular/compiler";

@Component({
  selector: "delete-dialog",
  templateUrl: "delete-dialog.html",
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDialogActions,
    MatButtonModule,
    MatDialogContent,
    MatDialogTitle,
    FormsModule
  ]
})
export class DeleteDialog {
  @Output() reloadEmployeeList = new EventEmitter<void>();

  employee: Employee | undefined;
  qualification: Qualification | undefined;

  constructor(
    private dialogRef: MatDialogRef<DeleteDialog>,
    private api: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: { _data: Employee | Qualification, isEmployee: boolean },
  ) {
    if(this.data.isEmployee)
      this.employee = data._data as Employee;
    else
      this.qualification = data._data as Qualification;
  }

  delete() {
    if(this.data.isEmployee)
      this.api.deleteEmployee(this.data._data.id!).then(_ => this.finish());
    else
      this.api.deleteQualification(this.data._data.id!).then(_ => this.finish());
  }

  finish() {
    this.reloadEmployeeList.emit();
    this.closeDialog()
  }

  closeDialog() {
    this.dialogRef.close();
  }

  protected readonly Employee = Employee;
}
