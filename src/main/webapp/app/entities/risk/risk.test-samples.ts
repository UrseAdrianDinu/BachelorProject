import { ProbabilityValue } from 'app/entities/enumerations/probability-value.model';

import { IRisk, NewRisk } from './risk.model';

export const sampleWithRequiredData: IRisk = {
  id: 12458,
};

export const sampleWithPartialData: IRisk = {
  id: 83095,
  description: 'Forward auxiliary',
  probability: ProbabilityValue['HIGH'],
  impact: 'Dynamic flexibility transmitting',
};

export const sampleWithFullData: IRisk = {
  id: 65346,
  description: 'Macao auxiliary',
  probability: ProbabilityValue['MEDIUM'],
  impact: 'Metal Pennsylvania portals',
};

export const sampleWithNewData: NewRisk = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
