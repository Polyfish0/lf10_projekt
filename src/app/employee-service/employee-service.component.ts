import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from "@angular/core";
import {AuthService} from "../app.auth.service";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {Employee, EmployeeHTML} from "../utils/Employee";
import {ApiService} from "../utils/api.service";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatSort, MatSortModule} from "@angular/material/sort";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {MatIconModule} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {DeleteDialog} from "../dialogs/delete-dialog/DeleteDialog";
import {MatDialog} from "@angular/material/dialog";
import {EditEmployeeDialog} from "../dialogs/edit-employee-dialog/EditEmployeeDialog";
import {SelectionModel} from "@angular/cdk/collections";
import {MatToolbarModule, MatToolbarRow} from "@angular/material/toolbar";
import {NgIf} from "@angular/common";
import {MatCheckbox} from "@angular/material/checkbox";
import {ErrorDialog} from "../dialogs/error-dialog/ErrorDialog";
import {HttpResponse} from "@angular/common/http";

@Component({
  selector: "app-employee-service",
  standalone: true,
  templateUrl: "./employee-service.component.html",
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
    MatToolbarRow,
    NgIf,
    MatCheckbox
  ],
  styleUrl: "./employee-service.component.css"
})
export class EmployeeServiceComponent implements OnInit {
  @ViewChild(MatSort) set sort(sort: MatSort) {
    this.dataSource.sort = sort;
  }

  @ViewChild(MatPaginator) set paginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }

  @ViewChild(MatPaginator) getPaginator!: MatPaginator;

  protected isLoading = true;

  displayedColumns: string[] = ["id", "lastName", "firstName", "street", "postcode", "city", "phone", "skillSet", "buttons"];
  dataSource: MatTableDataSource<EmployeeHTML> = new MatTableDataSource<EmployeeHTML>();
  originalDataSource: Employee[] = [];

  constructor(private readonly authService: AuthService, private readonly apiService: ApiService, private readonly dialog: MatDialog) {
  }

  public ngOnInit() {
    if (!this.authService.isLoggedIn())
      this.authService.login();

    this.loadData();
  }

  applyFilter($event: KeyboardEvent) {
    const filterValue = ($event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.getPaginator.pageIndex = 0;
  }

  formatSkills(skillSet: any[]): string {
    return skillSet.map(obj => obj.skill).join(', ');
  }

  openDeleteDialog(element: EmployeeHTML) {
    this.dialog.open(DeleteDialog, {
      data: {_data: this.HTML2Normal(element), isEmployee: true}
    }).componentInstance.reloadEmployeeList.subscribe(_ => this.loadData());
  }

  openEditDialog(element: EmployeeHTML) {
    this.dialog.open(EditEmployeeDialog, {
      data: this.HTML2Normal(element)
    }).componentInstance.reloadEmployeeList.subscribe(_ => this.loadData());
  }

  openNewDialog() {
    this.dialog.open(EditEmployeeDialog, {
      data: new Employee()
    }).componentInstance.reloadEmployeeList.subscribe(_ => this.loadData());
  }

  loadData() {
    this.apiService.getAllEmployee()
      .then(result => {
          this.originalDataSource = result;
          let htmlData: EmployeeHTML[] = []

          result.forEach(currentElement => htmlData.push(
            new EmployeeHTML(
              currentElement.id,
              currentElement.lastName,
              currentElement.firstName,
              currentElement.street,
              currentElement.postcode,
              currentElement.city,
              currentElement.phone,
              this.formatSkills(currentElement.skillSet!)
            )
          ));

          this.dataSource.data = htmlData;
          this.dataSource._updatePaginator(result.length);
          this.isLoading = false;
        }
      ).catch(error => {
        let httpError: HttpResponse<object> = error.response as HttpResponse<object>;

        this.isLoading = false;
        this.dialog.open(ErrorDialog, {
          data: {
            header: "Konnte die Daten nicht vom Server Abrufen",
            content: [
              "Status Code: " + httpError.status + " " + httpError.statusText,
              "Short error: " + error.text,
              "Long error: " + httpError.body
            ]
          }
        });
      }
    );
  }

  HTML2Normal(element: EmployeeHTML): Employee {
    return this.originalDataSource.find(currentEmployee => currentEmployee.id == element.id)!;
  }
}
