// types.ts

export interface EvidenceItem {
  id: number;
  description: string;
}

export interface ProbabilitiedEvidence {
  evidenceId: number;
  probabilityOfTrue: number;
  probabilityOfFalse: number;
}

export interface ProfessionAptitude {
  name: string;
  priorProbability: number;
  probabilitiedEvidences: ProbabilitiedEvidence[];
}

export interface KnowledgeBase {
  name: string;
  professionAptitudes: ProfessionAptitude[];
  evidenceList: EvidenceItem[];
}

export interface Chances {
  [aptitudeName: string]: number;
}

export interface UserAnswer {
  evidenceId: number;
  value: number; // 1.0 для "да", -1.0 для "нет"
}

export interface CalculateChancesRequest {
  chances: Chances;
  userAnswer: UserAnswer;
  professionAptitudes: ProfessionAptitude[];
}

export interface SetupChancesResponse {
  chances: Chances;
}

export interface ProfessionAptitudesDTO {
  professionAptitudes: ProfessionAptitude[];
}

export interface SetupChancesRequest {
  professionAptitudes: ProfessionAptitude[];
}

