import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from "@angular/core";
import {AuthService} from "../app.auth.service";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {Employee} from "../utils/Employee";
import {ApiService} from "../utils/api.service";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatSort, MatSortModule} from "@angular/material/sort";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {MatIconModule} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {DeleteDialog} from "../dialogs/delete-dialog/DeleteDialog";
import {MatDialog} from "@angular/material/dialog";
import {EditEmployeeDialog} from "../dialogs/edit-employee-dialog/EditEmployeeDialog";
import {CollectionViewer, DataSource, SelectionModel} from "@angular/cdk/collections";
import {Observable, ReplaySubject} from "rxjs";
import {MatToolbar, MatToolbarModule, MatToolbarRow} from "@angular/material/toolbar";
import {NgIf} from "@angular/common";
import {MatCheckbox} from "@angular/material/checkbox";
import {Qualification} from "../utils/Qualification";

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
export class EmployeeServiceComponent implements OnInit, OnChanges {
  @ViewChild(MatSort) set sort(sort: MatSort) {
    this.dataSource.sort = sort;
  }

  @ViewChild(MatPaginator) set paginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }

  @ViewChild(MatPaginator) getPaginator!: MatPaginator;

  @Input() displayRowButtons: boolean = true;
  @Input() displayQualificationMenuSelection: boolean = false;

  protected isLoading = true;

  displayedColumns: string[] = ["id", "lastName", "firstName", "street", "postcode", "city", "phone", "skillSet", "buttons"];
  dataSource: MatTableDataSource<Employee> = new MatTableDataSource<Employee>();
  selection = new SelectionModel<Employee>(true, []);

  constructor(private readonly authService: AuthService, private readonly apiService: ApiService, private readonly dialog: MatDialog) {}

  ngOnChanges() {
    let result: string[] = [];

    if(this.displayQualificationMenuSelection)
      result = result.concat(["select"]);

    result = result.concat(["id", "lastName", "firstName", "street", "postcode", "city", "phone", "skillSet"]);

    if(this.displayRowButtons)
      result = result.concat(["buttons"])

    console.log(result);
    this.displayedColumns = result;
  }

  public ngOnInit() {
    if(!this.authService.isLoggedIn())
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

  openDeleteDialog(element: Employee) {
    this.dialog.open(DeleteDialog, {
      data: {_data: element, isEmployee: true}
    }).componentInstance.reloadEmployeeList.subscribe(_ => this.loadData());
  }

  openEditDialog(element: Employee) {
    this.dialog.open(EditEmployeeDialog, {
      data: element
    }).componentInstance.reloadEmployeeList.subscribe(_ => this.loadData());
  }

  openNewDialog() {
    this.dialog.open(EditEmployeeDialog, {
      data: new Employee()
    }).componentInstance.reloadEmployeeList.subscribe(_ => this.loadData());
  }

  loadData() {
    this.apiService.getAllEmployee().then(result => {
      this.dataSource.data = result;
      this.dataSource._updatePaginator(result.length);
      this.isLoading = false;
    });
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
}
