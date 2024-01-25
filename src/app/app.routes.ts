import { Routes } from '@angular/router';
import {EmployeeListComponent} from "./employee-list/employee-list.component";
import {HomeComponent} from "./home/home.component";
import {EmployeeServiceComponent} from "./employee-service/employee-service.component";
import {QualificationsComponent} from "./qualifications/qualifications.component";

export const routes: Routes = [
  {path: "", component: HomeComponent, pathMatch: "full"},
  {path: "employees", component: EmployeeServiceComponent},
  {path: "qualifications", component: QualificationsComponent}
];
