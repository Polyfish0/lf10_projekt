import { Routes } from '@angular/router';
import {EmployeeListComponent} from "./employee-list/employee-list.component";
import {HomeComponent} from "./home/home.component";
import {EmployeeServiceComponent} from "./employee-service/employee-service.component";

export const routes: Routes = [
  {path: "", component: HomeComponent, pathMatch: "full"},
  {path: "employee", component: EmployeeServiceComponent}
];
