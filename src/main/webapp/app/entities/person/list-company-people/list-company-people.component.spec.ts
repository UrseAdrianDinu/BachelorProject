import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCompanyPeopleComponent } from './list-company-people.component';

describe('ListCompanyPeopleComponent', () => {
  let component: ListCompanyPeopleComponent;
  let fixture: ComponentFixture<ListCompanyPeopleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListCompanyPeopleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ListCompanyPeopleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
