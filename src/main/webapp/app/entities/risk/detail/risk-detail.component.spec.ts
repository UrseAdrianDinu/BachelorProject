import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { RiskDetailComponent } from './risk-detail.component';

describe('Risk Management Detail Component', () => {
  let comp: RiskDetailComponent;
  let fixture: ComponentFixture<RiskDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RiskDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ risk: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(RiskDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(RiskDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load risk on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.risk).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
