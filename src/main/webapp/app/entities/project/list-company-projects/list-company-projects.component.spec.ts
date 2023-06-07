import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCompanyProjectsComponent } from './list-company-projects.component';

describe('ListCompanyProjectsComponent', () => {
  let component: ListCompanyProjectsComponent;
  let fixture: ComponentFixture<ListCompanyProjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListCompanyProjectsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ListCompanyProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
