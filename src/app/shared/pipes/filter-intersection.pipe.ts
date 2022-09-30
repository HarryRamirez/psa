import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "filterIntersection",
})
export class FilterIntersectionPipe implements PipeTransform {
  transform(
    list1: any[],
    list1Id: string,
    list2: any[],
    list2Id: string,
    changeIndicator: number
  ): any[] {
    if (list1.length > 0 && list2.length > 0)
      return list1.filter(
        (item1) =>
          list2.filter((item2) => item2[list2Id] == item1[list1Id]).length == 0
      );
    return list1;
  }
}
