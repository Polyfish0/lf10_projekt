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
import {Qualification, QualificationHTML} from "../utils/Qualification";
import {EditQualificationDialog} from "../dialogs/edit-qualification-dialog/EditQualificationDialog";
import {Employee} from "../utils/Employee";
import {HttpResponse} from "@angular/common/http";
import {ErrorDialog} from "../dialogs/error-dialog/ErrorDialog";

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

  displayedColumns: string[] = ["id", "skill", "employee", "buttons"];
  dataSource: MatTableDataSource<QualificationHTML> = new MatTableDataSource<QualificationHTML>();
  realDataSource: Qualification[] = [];

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

  openDeleteDialog(element: QualificationHTML) {
    if(element.employees!.length > 0) {
      this.dialog.open(ErrorDialog, {
        data: {
          header: "Qualifikation noch in verwendung",
          content: ["Um eine Qualifikation löschen zu können, müssen erst alle Mitarbeiter aus dieser Entfernt werden!"]
        }
      });

      return;
    }

    this.dialog.open(DeleteDialog, {
      data: {_data: this.HTML2Normal(element), isEmployee: false}
    }).componentInstance.reloadEmployeeList.subscribe(_ => this.loadData());
  }

  openEditDialog(element: QualificationHTML) {
    this.dialog.open(EditQualificationDialog, {
      data: this.HTML2Normal(element)
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
        result[i].employees = (await this.apiService.getEmployeesByQualification(result[i].id!).catch(error => {
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
        }))!.employees;
      }

      this.realDataSource = result;
      let htmlData: QualificationHTML[] = [];

      result.forEach(currentElement => htmlData.push(
        new QualificationHTML(
          currentElement.id,
          currentElement.skill,
          this.formatNames(currentElement.employees!)
        )
      ));

      this.dataSource.data = htmlData;
      this.dataSource._updatePaginator(result.length);
      this.isLoading = false;
    });
  }

  formatNames(element: Employee[]) {
    return element.map(e => `${e.firstName} ${e.lastName}`).join(", ");
  }

  HTML2Normal(element: QualificationHTML): Qualification {
    return this.realDataSource.find(currentElement => currentElement.id === element.id)!;
  }
}
