// backendMock.ts
import {
  Chances,
  UserAnswer,
  ProfessionAptitude,
  CalculateChancesRequest,
  SetupChancesRequest,
  SetupChancesResponse,
} from './types';

function bayesUpdate(prior: number, pPlus: number, pMinus: number, R: number): number {
  const eps = 1e-12;

  const pGivenYes = (pPlus * prior) / (pPlus * prior + pMinus * (1 - prior) + eps);
  const pGivenNo = ((1 - pPlus) * prior) / ((1 - pPlus) * prior + (1 - pMinus) * (1 - prior) + eps);

  return R * pGivenYes + (1 - R) * pGivenNo;
}

// === ФУНКЦИЯ ВМЕСТО ЗАПРОСА НА /setupchances ===
export function mockSetupChances(request: SetupChancesRequest): SetupChancesResponse {
  const chances: Chances = {};
  for (const apt of request.professionAptitudes) {
    chances[apt.name] = apt.priorProbability;
  }
  return { chances };
}

// === ФУНКЦИЯ ВМЕСТО ЗАПРОСА НА /calculatechances ===
export function mockCalculateChances(request: CalculateChancesRequest): { chances: Chances } {
  const { chances, userAnswer, professionAptitudes } = request;
  const R = userAnswer.value;
  console.log(R);

  const newChances: Chances = { ...chances };

  for (const apt of professionAptitudes) {
    const evidence = apt.probabilitiedEvidences.find(e => e.evidenceId === userAnswer.evidenceId);
    if (evidence) {
      const current = newChances[apt.name] ?? apt.priorProbability;
      newChances[apt.name] = bayesUpdate(
        current,
        evidence.probabilityOfTrue,
        evidence.probabilityOfFalse,
        R
      );
    }
  }

  return { chances: newChances };
}