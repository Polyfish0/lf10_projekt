import {HttpResponse} from "@angular/common/http";

export function getErrorString(error: {response: HttpResponse<any>, text: string}): string {
  return `Status code: ${error.response.status} ${error.response.statusText}\n` +
    `Short error: ${error.text}\n` +
    `Long error: ${error.response.body}`;
}
