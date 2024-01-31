import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Employee, EmployeePut} from "./Employee";
import {AuthService} from "../app.auth.service";
import {Qualification, QualificationEmployees, QualificationPut} from "./Qualification";

@Injectable({providedIn: "root"})
export class ApiService {
  constructor(private readonly http: HttpClient, private readonly authService: AuthService) {}

  getAllEmployee(): Promise<Employee[]> {
    return new Promise<Employee[]>(async (resolve, reject) => {
      const token = await this.authService.getToken();

      this.http.get<Employee[]>('/backend/employees', {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${token}`),
        observe: "response"
      }).subscribe(response => {
        switch (response.status) {
          case 200:
            if(response.body === null) {
              return reject({response: response, text: "[getAllEmployee] body is null"});
            }

            return resolve(response.body);

          case 401:
            this.authService.logout().then(_ => this.authService.login());
            return;

          default:
            return reject({response: response, text: "[getAllEmployee] status code is not 201"});
        }
      });
    });
  }

  deleteEmployee(id: number): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const token = await this.authService.getToken();

      this.http.delete("/backend/employees/" + id, {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${token}`),
        observe: "response"
      }).subscribe(response => {
        switch (response.status) {
          case 204:
            return resolve();

          case 401:
            this.authService.logout().then(_ => this.authService.login());
            return;

          default:
            return reject({response: response, text: "[deleteEmployee] status code is not 204"});
        }
      });
    });
  }

  updateEmployee(employee: EmployeePut, id: number): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const token = await this.authService.getToken();

      this.http.put("/backend/employees/" + id, employee, {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${token}`),
        observe: "response"
      }).subscribe(response => {
        switch (response.status) {
          case 200:
            return resolve();

          case 401:
            this.authService.logout().then(_ => this.authService.login());
            return;

          default:
            return reject({response: response, text: "[updateEmployee] status code is not 200"});
        }
      });
    });
  }

  createEmployee(employee: EmployeePut): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      const token = await this.authService.getToken();

      this.http.post("/backend/employees/", employee, {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${token}`),
        observe: "response"
      }).subscribe(response => {
        switch (response.status) {
          case 201:
            return resolve();

          case 401:
            this.authService.logout().then(_ => this.authService.login());
            return;

          default:
            return reject({response: response, text: "[createEmployee] status code is not 201"});
        }
      });
    });
  }

  addQualificationToUser(id: number, skill: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const token = await this.authService.getToken();

      this.http.post("/backend/employees/" + id + "/qualifications/", {
        "skill": skill
      }, {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${token}`),
        observe: "response"
      }).subscribe(response => {
        switch (response.status) {
          case 200:
            return resolve();

          case 401:
            this.authService.logout().then(_ => this.authService.login());
            return;

          default:
            return reject({response: response, text: "[addQualificationToUser] status code is not 200"});
        }
      });
    });
  }

  deleteQualificationFromUser(id: number, skill: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const token = await this.authService.getToken();

      this.http.request("delete", "/backend/employees/" + id + "/qualifications/", {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${token}`),
        observe: "response",
        body: {
          "skill": skill
        }
      }).subscribe(response => {
        switch (response.status) {
          case 200:
            return resolve();

          case 401:
            this.authService.logout().then(_ => this.authService.login());
            return;

          default:
            return reject({response: response, text: "[deleteQualificationFromUser] status code is not 201"});
        }
      });
    });
  }

  getAllQualifications(): Promise<Qualification[]> {
    return new Promise<Qualification[]>(async (resolve, reject) => {
      const token = await this.authService.getToken();

      this.http.get<Qualification[]>("/backend/qualifications/", {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${token}`),
        observe: "response"
      }).subscribe(response => {
        switch (response.status) {
          case 200:
            if(response.body === null) {
              return reject({response: response, text: "[getAllQualifications] body is null"});
            }

            return resolve(response.body);

          case 401:
            this.authService.logout().then(_ => this.authService.login());
            return;

          default:
            return reject({response: response, text: "[getAllQualifications] status code is not 201"});
        }
      });
    });
  }

  getEmployeesByQualification(id: number): Promise<QualificationEmployees> {
    return new Promise<QualificationEmployees>(async (resolve, reject) => {
      const token = await this.authService.getToken();

      this.http.get<QualificationEmployees>("/backend/qualifications/" + id + "/employees", {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${token}`),
        observe: "response"
      }).subscribe(response => {
        switch (response.status) {
          case 200:
            if(response.body === null) {
              return reject({response: response, text: "[getEmployeesByQualification] body is null"});
            }

            return resolve(response.body);

          case 401:
            this.authService.logout().then(_ => this.authService.login());
            return;

          default:
            reject({response: response, text: "[getEmployeesByQualification] status code is not 201"});
        }
      });
    });
  }

  updateQualification(qualification: QualificationPut, id: number): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const token = await this.authService.getToken();

      this.http.put("/backend/qualifications/" + id, qualification, {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${token}`),
        observe: "response"
      }).subscribe(response => {
        switch (response.status) {
          case 200:
            return resolve();

          case 401:
            this.authService.logout().then(_ => this.authService.login());
            return;

          default:
            return reject({response: response, text: "[updateQualification] status code is not 200"});
        }
      });
    });
  }

  createQualification(qualification: QualificationPut): Promise<Qualification> {
    return new Promise<Qualification>(async (resolve, reject) => {
      const token = await this.authService.getToken();

      this.http.post("/backend/qualifications/", qualification, {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${token}`),
        observe: "response"
      }).subscribe(response => {
        switch (response.status) {
          case 201:
            if(response.body === null)
              return reject({response: response, text: "[createQualification] response body is null"});

            return resolve(response.body!);

          case 401:
            this.authService.logout().then(_ => this.authService.login());
            return;

          default:
            return reject({response: response, text: "[createQualification] status code is not 201"});
        }
      });
    });
  }

  deleteQualification(id: number): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const token = await this.authService.getToken();

      this.http.delete("/backend/qualifications/" + id, {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${token}`),
        observe: "response"
      }).subscribe(response => {
        switch (response.status) {
          case 204:
            return resolve();

          case 401:
            this.authService.logout().then(_ => this.authService.login());
            break;

          default:
            return reject({response: response, text: "[deleteQualification] status code is not 204"});
        }
      });
    });
  }
}
