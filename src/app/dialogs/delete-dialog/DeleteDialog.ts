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
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {getErrorString} from "../../utils/Utils";

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
    FormsModule,
    MatProgressSpinner
  ]
})
export class DeleteDialog {
  @Output() reloadEmployeeList = new EventEmitter<void>();

  employee: Employee | undefined;
  qualification: Qualification | undefined;
  saving: boolean = false;

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
    this.saving = true;
    if(this.data.isEmployee)
      this.api.deleteEmployee(this.data._data.id!).then(_ => this.finish()).catch(error => {
        alert(getErrorString(error));
        this.saving = false;
      });
    else
      this.api.deleteQualification(this.data._data.id!).then(_ => this.finish()).catch(error => {
        alert(getErrorString(error));
        this.saving = false;
      });
  }

  finish() {
    this.reloadEmployeeList.emit();
    this.closeDialog()
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
