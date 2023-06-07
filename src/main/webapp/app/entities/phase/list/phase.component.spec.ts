import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { PhaseService } from '../service/phase.service';

import { PhaseComponent } from './phase.component';

describe('Phase Management Component', () => {
  let comp: PhaseComponent;
  let fixture: ComponentFixture<PhaseComponent>;
  let service: PhaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'phase', component: PhaseComponent }]), HttpClientTestingModule],
      declarations: [PhaseComponent],
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
      .overrideTemplate(PhaseComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PhaseComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(PhaseService);

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
    expect(comp.phases?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to phaseService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getPhaseIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getPhaseIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
