import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SortService {
  private collator = new Intl.Collator(undefined, {
    numeric: true,
    sensitivity: 'base',
  });

  public startSort(property: string, order: number): (a: any, b: any) => number {
    return (a: any, b: any) => this.collator.compare(a[property], b[property]) * order;
  }

  public startSortPeopleUser(property: string, where: string, order: number): (a: any, b: any) => number {
    if (where === 'person' || property === 'id') {
      return (a: any, b: any) => this.collator.compare(a.personDTO[property], b.personDTO[property]) * order;
    } else {
      return (a: any, b: any) => this.collator.compare(a.adminUserDTO[property], b.adminUserDTO[property]) * order;
    }
  }
}
