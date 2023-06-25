import { PhaseEVA } from './phaseEVA.model';

export interface ProjectEVA {
  projectName: string;
  phaseEstimatedVSActualDTOList: PhaseEVA[];
}
