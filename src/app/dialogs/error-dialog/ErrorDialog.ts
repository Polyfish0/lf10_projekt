import {Component, EventEmitter, Inject, Output} from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialogActions, MatDialogContainer,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {FormsModule} from "@angular/forms";
import {ApiService} from "../../utils/api.service";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatIcon} from "@angular/material/icon";
import {NgForOf} from "@angular/common";

@Component({
  selector: "delete-dialog",
  templateUrl: "error-dialog.html",
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDialogActions,
    MatButtonModule,
    MatDialogContent,
    MatDialogTitle,
    FormsModule,
    MatProgressSpinner,
    MatDialogContainer,
    MatIcon,
    NgForOf
  ]
})
export class ErrorDialog {
  constructor(
    private dialogRef: MatDialogRef<ErrorDialog>,
    private api: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: {header: string, content: string},
  ) {}

  closeDialog() {
    this.dialogRef.close();
  }
}
