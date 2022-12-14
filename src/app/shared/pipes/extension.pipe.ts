import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "extension",
})
export class ExtensionPipe implements PipeTransform {
  transform(value: any): string {
    return value.replace(/\.[^/.]+$/, "");
  }
}
