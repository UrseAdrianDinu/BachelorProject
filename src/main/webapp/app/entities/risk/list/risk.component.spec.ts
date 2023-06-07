import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { RiskService } from '../service/risk.service';

import { RiskComponent } from './risk.component';

describe('Risk Management Component', () => {
  let comp: RiskComponent;
  let fixture: ComponentFixture<RiskComponent>;
  let service: RiskService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'risk', component: RiskComponent }]), HttpClientTestingModule],
      declarations: [RiskComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(RiskComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(RiskComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(RiskService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.risks?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to riskService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getRiskIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getRiskIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
