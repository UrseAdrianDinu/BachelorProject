import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCompanyDepartmentsComponent } from './list-company-departments.component';

describe('ListCompanyDepartmentsComponent', () => {
  let component: ListCompanyDepartmentsComponent;
  let fixture: ComponentFixture<ListCompanyDepartmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListCompanyDepartmentsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ListCompanyDepartmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
