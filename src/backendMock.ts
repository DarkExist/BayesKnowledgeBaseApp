import {
  Chances,
  UserAnswer,
  ProfessionAptitude,
  CalculateChancesRequest,
  SetupChancesRequest,
  SetupChancesResponse,
} from './types';

// Вспомогательная функция: пересчёт по формуле Нейлора
function updateProbability(
  prior: number,
  pPlus: number,
  pMinus: number,
  R: number
): number {
  const eps = 1e-12;

  // P(H | j)
  const numYes = pPlus * prior;
  const denYes = numYes + pMinus * (1 - prior);
  const pGivenYes = denYes < eps ? 0 : numYes / denYes;

  // P(H | ¬j)
  const numNo = (1 - pPlus) * prior;
  const denNo = numNo + (1 - pMinus) * (1 - prior);
  const pGivenNo = denNo < eps ? 0 : numNo / denNo;

  // Нечёткий ответ: P(H | R) = R * P(H|j) + (1 - R) * P(H|¬j)
  return R * pGivenYes + (1 - R) * pGivenNo;
}

// 1. Инициализация шансов (априорные вероятности)
export function setupChances(request: SetupChancesRequest): SetupChancesResponse {
  const chances: Chances = {};
  for (const apt of request.professionAptitudes) {
    chances[apt.name] = apt.priorProbability;
  }
  return { chances };
}

// 2. Обновление шансов по одному ответу
export function calculateChances(request: CalculateChancesRequest): { chances: Chances } {
  const { chances, userAnswer, professionAptitudes } = request;
  const { evidenceId, value } = userAnswer;

  // Преобразуем value ∈ {-1, 1} → R ∈ {0, 1}
  const R = value === 1.0 ? 1.0 : 0.0;

  const newChances: Chances = { ...chances };

  for (const apt of professionAptitudes) {
    // Ищем, есть ли у этой профессии информация по данному evidenceId
    const probEvidence = apt.probabilitiedEvidences.find(pe => pe.evidenceId === evidenceId);
    if (probEvidence) {
      const currentProb = chances[apt.name] ?? apt.priorProbability;
      const updated = updateProbability(
        currentProb,
        probEvidence.probabilityOfTrue,
        probEvidence.probabilityOfFalse,
        R
      );
      newChances[apt.name] = updated;
    }
  }

  return { chances: newChances };
}