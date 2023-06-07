import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { DepartmentFormService } from './department-form.service';
import { DepartmentService } from '../service/department.service';
import { IDepartment } from '../department.model';
import { ICompany } from 'app/entities/company/company.model';
import { CompanyService } from 'app/entities/company/service/company.service';

import { DepartmentUpdateComponent } from './department-update.component';

describe('Department Management Update Component', () => {
  let comp: DepartmentUpdateComponent;
  let fixture: ComponentFixture<DepartmentUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let departmentFormService: DepartmentFormService;
  let departmentService: DepartmentService;
  let companyService: CompanyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [DepartmentUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(DepartmentUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DepartmentUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    departmentFormService = TestBed.inject(DepartmentFormService);
    departmentService = TestBed.inject(DepartmentService);
    companyService = TestBed.inject(CompanyService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Department query and add missing value', () => {
      const department: IDepartment = { id: 456 };
      const parentDept: IDepartment = { id: 65922 };
      department.parentDept = parentDept;

      const departmentCollection: IDepartment[] = [{ id: 63634 }];
      jest.spyOn(departmentService, 'query').mockReturnValue(of(new HttpResponse({ body: departmentCollection })));
      const additionalDepartments = [parentDept];
      const expectedCollection: IDepartment[] = [...additionalDepartments, ...departmentCollection];
      jest.spyOn(departmentService, 'addDepartmentToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ department });
      comp.ngOnInit();

      expect(departmentService.query).toHaveBeenCalled();
      expect(departmentService.addDepartmentToCollectionIfMissing).toHaveBeenCalledWith(
        departmentCollection,
        ...additionalDepartments.map(expect.objectContaining)
      );
      expect(comp.departmentsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Company query and add missing value', () => {
      const department: IDepartment = { id: 456 };
      const company: ICompany = { id: 13325 };
      department.company = company;

      const companyCollection: ICompany[] = [{ id: 84227 }];
      jest.spyOn(companyService, 'query').mockReturnValue(of(new HttpResponse({ body: companyCollection })));
      const additionalCompanies = [company];
      const expectedCollection: ICompany[] = [...additionalCompanies, ...companyCollection];
      jest.spyOn(companyService, 'addCompanyToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ department });
      comp.ngOnInit();

      expect(companyService.query).toHaveBeenCalled();
      expect(companyService.addCompanyToCollectionIfMissing).toHaveBeenCalledWith(
        companyCollection,
        ...additionalCompanies.map(expect.objectContaining)
      );
      expect(comp.companiesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const department: IDepartment = { id: 456 };
      const parentDept: IDepartment = { id: 48299 };
      department.parentDept = parentDept;
      const company: ICompany = { id: 58703 };
      department.company = company;

      activatedRoute.data = of({ department });
      comp.ngOnInit();

      expect(comp.departmentsSharedCollection).toContain(parentDept);
      expect(comp.companiesSharedCollection).toContain(company);
      expect(comp.department).toEqual(department);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDepartment>>();
      const department = { id: 123 };
      jest.spyOn(departmentFormService, 'getDepartment').mockReturnValue(department);
      jest.spyOn(departmentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ department });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: department }));
      saveSubject.complete();

      // THEN
      expect(departmentFormService.getDepartment).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(departmentService.update).toHaveBeenCalledWith(expect.objectContaining(department));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDepartment>>();
      const department = { id: 123 };
      jest.spyOn(departmentFormService, 'getDepartment').mockReturnValue({ id: null });
      jest.spyOn(departmentService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ department: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: department }));
      saveSubject.complete();

      // THEN
      expect(departmentFormService.getDepartment).toHaveBeenCalled();
      expect(departmentService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDepartment>>();
      const department = { id: 123 };
      jest.spyOn(departmentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ department });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(departmentService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareDepartment', () => {
      it('Should forward to departmentService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(departmentService, 'compareDepartment');
        comp.compareDepartment(entity, entity2);
        expect(departmentService.compareDepartment).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareCompany', () => {
      it('Should forward to companyService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(companyService, 'compareCompany');
        comp.compareCompany(entity, entity2);
        expect(companyService.compareCompany).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
