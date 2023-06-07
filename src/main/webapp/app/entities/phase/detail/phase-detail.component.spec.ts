import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PhaseDetailComponent } from './phase-detail.component';

describe('Phase Management Detail Component', () => {
  let comp: PhaseDetailComponent;
  let fixture: ComponentFixture<PhaseDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PhaseDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ phase: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(PhaseDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(PhaseDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load phase on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.phase).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
