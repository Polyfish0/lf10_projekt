import {Component, OnInit, ViewChild} from "@angular/core";
import {AuthService} from "../app.auth.service";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {ApiService} from "../utils/api.service";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatSort, MatSortModule} from "@angular/material/sort";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {MatIconModule} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {DeleteDialog} from "../dialogs/delete-dialog/DeleteDialog";
import {MatDialog} from "@angular/material/dialog";
import {MatToolbarModule, MatToolbarRow} from "@angular/material/toolbar";
import {Qualification} from "../utils/Qualification";
import {EditQualificationDialog} from "../dialogs/edit-qualification-dialog/EditQualificationDialog";
import {Employee} from "../utils/Employee";

@Component({
  selector: "app-qualification-service",
  standalone: true,
  templateUrl: "./qualifications.component.html",
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule,
    MatIconButton,
    MatToolbarModule,
    MatToolbarRow
  ],
  styleUrl: "./qualifications.component.css"
})
export class QualificationsComponent implements OnInit {
  @ViewChild(MatSort) set sort(sort: MatSort) {
    this.dataSource.sort = sort;
  }

  @ViewChild(MatPaginator) set paginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }

  private isLoggedIn = false;
  protected isLoading = true;

  displayedColumns: string[] = ["buttons", "id", "skill", "employee"];
  dataSource: MatTableDataSource<Qualification> = new MatTableDataSource<Qualification>();

  constructor(private readonly authService: AuthService, private readonly apiService: ApiService, private readonly dialog: MatDialog) {}

  public ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();

    if(!this.isLoggedIn)
      this.authService.login();

    this.loadData();
  }

  applyFilter($event: KeyboardEvent) {
    const filterValue = ($event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.paginator.pageIndex = 0;
  }

  openDeleteDialog(element: Qualification) {
    this.dialog.open(DeleteDialog, {
      data: {_data: element, isEmployee: false}
    }).componentInstance.reloadEmployeeList.subscribe(_ => this.loadData());
  }

  openEditDialog(element: Qualification) {
    this.dialog.open(EditQualificationDialog, {
      data: element
    }).componentInstance.reloadEmployeeList.subscribe(_ => this.loadData());
  }

  openNewDialog() {
    this.dialog.open(EditQualificationDialog, {
      data: new Qualification()
    }).componentInstance.reloadEmployeeList.subscribe(_ => this.loadData());
  }

  loadData() {
    this.apiService.getAllQualifications().then(async result => {
      for(let i = 0; i < result.length; i++) {
        result[i].employees = (await this.apiService.getEmployeesByQualification(result[i].id!)).employees;
      }

      this.dataSource.data = result;
      this.isLoading = false;
    });
  }

  format(element: {id: number, firstName: string, lastName: string}[]) {
    return element.map(e => `${e.firstName} ${e.lastName}`).join(", ");
  }
}
