import {Employee} from "./Employee";

export class Qualification {
  constructor(public id?: number,
              public skill?: string,
              public employees?: Employee[]) {}
}

export class QualificationPut {
  constructor(public skill: string) {
  }
}

export class QualificationEmployees {
  constructor(public qualification: {skill: string, id: number},
              public employees: {id: number, lastName: string, firstName: string}[]) {}
}
