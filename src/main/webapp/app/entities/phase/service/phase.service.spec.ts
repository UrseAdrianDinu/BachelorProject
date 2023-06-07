import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IPhase } from '../phase.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../phase.test-samples';

import { PhaseService, RestPhase } from './phase.service';

const requireRestSample: RestPhase = {
  ...sampleWithRequiredData,
  startDate: sampleWithRequiredData.startDate?.format(DATE_FORMAT),
  endDate: sampleWithRequiredData.endDate?.format(DATE_FORMAT),
};

describe('Phase Service', () => {
  let service: PhaseService;
  let httpMock: HttpTestingController;
  let expectedResult: IPhase | IPhase[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PhaseService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Phase', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const phase = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(phase).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Phase', () => {
      const phase = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(phase).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Phase', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Phase', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Phase', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addPhaseToCollectionIfMissing', () => {
      it('should add a Phase to an empty array', () => {
        const phase: IPhase = sampleWithRequiredData;
        expectedResult = service.addPhaseToCollectionIfMissing([], phase);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(phase);
      });

      it('should not add a Phase to an array that contains it', () => {
        const phase: IPhase = sampleWithRequiredData;
        const phaseCollection: IPhase[] = [
          {
            ...phase,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addPhaseToCollectionIfMissing(phaseCollection, phase);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Phase to an array that doesn't contain it", () => {
        const phase: IPhase = sampleWithRequiredData;
        const phaseCollection: IPhase[] = [sampleWithPartialData];
        expectedResult = service.addPhaseToCollectionIfMissing(phaseCollection, phase);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(phase);
      });

      it('should add only unique Phase to an array', () => {
        const phaseArray: IPhase[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const phaseCollection: IPhase[] = [sampleWithRequiredData];
        expectedResult = service.addPhaseToCollectionIfMissing(phaseCollection, ...phaseArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const phase: IPhase = sampleWithRequiredData;
        const phase2: IPhase = sampleWithPartialData;
        expectedResult = service.addPhaseToCollectionIfMissing([], phase, phase2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(phase);
        expect(expectedResult).toContain(phase2);
      });

      it('should accept null and undefined values', () => {
        const phase: IPhase = sampleWithRequiredData;
        expectedResult = service.addPhaseToCollectionIfMissing([], null, phase, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(phase);
      });

      it('should return initial array if no Phase is added', () => {
        const phaseCollection: IPhase[] = [sampleWithRequiredData];
        expectedResult = service.addPhaseToCollectionIfMissing(phaseCollection, undefined, null);
        expect(expectedResult).toEqual(phaseCollection);
      });
    });

    describe('comparePhase', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.comparePhase(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.comparePhase(entity1, entity2);
        const compareResult2 = service.comparePhase(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.comparePhase(entity1, entity2);
        const compareResult2 = service.comparePhase(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.comparePhase(entity1, entity2);
        const compareResult2 = service.comparePhase(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
