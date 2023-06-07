import { IPhase } from 'app/entities/phase/phase.model';
import { ProbabilityValue } from 'app/entities/enumerations/probability-value.model';

export interface IRisk {
  id: number;
  description?: string | null;
  probability?: ProbabilityValue | null;
  impact?: string | null;
  phase?: Pick<IPhase, 'id'> | null;
}

export type NewRisk = Omit<IRisk, 'id'> & { id: null };
