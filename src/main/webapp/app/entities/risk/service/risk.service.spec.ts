import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IRisk } from '../risk.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../risk.test-samples';

import { RiskService } from './risk.service';

const requireRestSample: IRisk = {
  ...sampleWithRequiredData,
};

describe('Risk Service', () => {
  let service: RiskService;
  let httpMock: HttpTestingController;
  let expectedResult: IRisk | IRisk[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(RiskService);
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

    it('should create a Risk', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const risk = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(risk).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Risk', () => {
      const risk = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(risk).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Risk', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Risk', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Risk', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addRiskToCollectionIfMissing', () => {
      it('should add a Risk to an empty array', () => {
        const risk: IRisk = sampleWithRequiredData;
        expectedResult = service.addRiskToCollectionIfMissing([], risk);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(risk);
      });

      it('should not add a Risk to an array that contains it', () => {
        const risk: IRisk = sampleWithRequiredData;
        const riskCollection: IRisk[] = [
          {
            ...risk,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addRiskToCollectionIfMissing(riskCollection, risk);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Risk to an array that doesn't contain it", () => {
        const risk: IRisk = sampleWithRequiredData;
        const riskCollection: IRisk[] = [sampleWithPartialData];
        expectedResult = service.addRiskToCollectionIfMissing(riskCollection, risk);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(risk);
      });

      it('should add only unique Risk to an array', () => {
        const riskArray: IRisk[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const riskCollection: IRisk[] = [sampleWithRequiredData];
        expectedResult = service.addRiskToCollectionIfMissing(riskCollection, ...riskArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const risk: IRisk = sampleWithRequiredData;
        const risk2: IRisk = sampleWithPartialData;
        expectedResult = service.addRiskToCollectionIfMissing([], risk, risk2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(risk);
        expect(expectedResult).toContain(risk2);
      });

      it('should accept null and undefined values', () => {
        const risk: IRisk = sampleWithRequiredData;
        expectedResult = service.addRiskToCollectionIfMissing([], null, risk, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(risk);
      });

      it('should return initial array if no Risk is added', () => {
        const riskCollection: IRisk[] = [sampleWithRequiredData];
        expectedResult = service.addRiskToCollectionIfMissing(riskCollection, undefined, null);
        expect(expectedResult).toEqual(riskCollection);
      });
    });

    describe('compareRisk', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareRisk(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareRisk(entity1, entity2);
        const compareResult2 = service.compareRisk(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareRisk(entity1, entity2);
        const compareResult2 = service.compareRisk(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareRisk(entity1, entity2);
        const compareResult2 = service.compareRisk(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
