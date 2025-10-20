import React, { useState, useEffect } from 'react';
import { KnowledgeBase, EvidenceItem, Chances, UserAnswer, CalculateChancesRequest, SetupChancesResponse, SetupChancesRequest } from '../types';
import { mockSetupChances, mockCalculateChances } from '../backendMock';
import ipConfig from "../ipconfig.json";

interface QuestionnaireProps {
  knowledgeBase: KnowledgeBase;
  onComplete: (chances: Chances) => void;
}

const Questionnaire: React.FC<QuestionnaireProps> = ({ knowledgeBase, onComplete }) => {
  const [chances, setChances] = useState<Chances | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(-1);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());
  const [questions, setQuestions] = useState<EvidenceItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEnd, setIsEnd] = useState(false);
  const [sliderValue, setSliderValue] = useState<number>(0.5);

  // Стили
  const pageStyle = {
    minHeight: '100vh',
    padding: '20px',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center'
  };

  const containerStyle = {
    maxWidth: '800px',
    width: '90%',
    backgroundColor: 'white',
    borderRadius: '15px',
    padding: '30px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    margin: '20px auto'
  };

  const buttonStyle = {
    padding: '15px 30px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600' as const,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    minWidth: '120px'
  };

  const yesButtonStyle = {
    ...buttonStyle,
    background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
    color: 'white',
  };

  const noButtonStyle = {
    ...buttonStyle,
    background: 'linear-gradient(135deg, #f44336 0%, #da190b 100%)',
    color: 'white',
  };

  const skipButtonStyle = {
    ...buttonStyle,
    background: 'linear-gradient(135deg, #757575 0%, #5d5d5d 100%)',
    color: 'white',
  };

  const disabledButtonStyle = {
    opacity: 0.6,
    cursor: 'not-allowed',
    transform: 'none !important'
  };

  const progressContainerStyle = {
    width: '100%',
    backgroundColor: '#f0f0f0',
    borderRadius: '10px',
    height: '12px',
    marginBottom: '20px',
    overflow: 'hidden'
  };

  const progressBarStyle = {
    height: '100%',
    backgroundColor: '#4facfe',
    borderRadius: '10px',
    transition: 'width 0.5s ease',
    background: 'linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)'
  };

  const questionCardStyle = {
    border: '1px solid #e0e0e0',
    padding: '25px',
    borderRadius: '12px',
    marginBottom: '25px',
    backgroundColor: '#fafafa',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
    textAlign: 'center' as const
  };

  const chancesCardStyle = {
    backgroundColor: '#f8f9fa',
    borderRadius: '10px',
    padding: '20px',
    marginTop: '25px',
    border: '1px solid #e9ecef'
  };

  const chanceItemStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0',
    borderBottom: '1px solid #eee'
  };

  const loadingStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px'
  };

  const loadingSpinnerStyle = {
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #4facfe',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    animation: 'spin 1s linear infinite'
  };

  // Добавляем CSS анимацию для спиннера
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Инициализация опроса
  useEffect(() => {
    const initializeQuestionnaire = async () => {
      try {
        setIsLoading(true);
        
        // Создаем DTO обертку для professionAptitudes
        const setupRequest: SetupChancesRequest = {
          professionAptitudes: knowledgeBase.professionAptitudes
        };
        
        // // Отправляем запрос на /setupchances
        // const response = await fetch(
        //     "http://localhost:5011/chance/setupchances", {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify(setupRequest),
        // });

        // setChances(setupRequest)

        // console.log(JSON.stringify({
        //     professionAptitudes: knowledgeBase.professionAptitudes
        //   }));
        // if (!response.ok) {
        //   throw new Error('Ошибка при инициализации опроса');
        // }

        // const data: Chances = await response.json();

        const data: Chances = mockSetupChances(setupRequest).chances
        setChances(data);
        
        // Сохраняем chances в localStorage
        localStorage.setItem('currentChances', JSON.stringify(data));
        
        // Перемешиваем вопросы в случайном порядке
        const shuffledQuestions = [...knowledgeBase.evidenceList].sort(() => Math.random() - 0.5);
        setQuestions(shuffledQuestions);
        setCurrentQuestionIndex(0);
        
      } catch (error) {
        console.error('Ошибка:', error);
        alert('Ошибка при запуске опроса');
      } finally {
        setIsLoading(false);
      }
    };

    initializeQuestionnaire();
  }, [knowledgeBase]);

  const handleEnd = () => {
    alert('Опрос завершен! Результаты сохранены.');
    setIsEnd(true)
  }

  const goBack = (newChances: Chances) => {
    setIsEnd(false);
    onComplete(newChances);
  }

  // Обработка ответа на вопрос
  const handleAnswer = async (value: number) => {
    if (!chances || currentQuestionIndex === -1) return;

    try {
      setIsLoading(true);
      const currentQuestion = questions[currentQuestionIndex];
      
      // Формируем userAnswer
      const userAnswer: UserAnswer = {
        evidenceId: currentQuestion.id,
        value: value
      };

      // Формируем запрос для /calculatechances
      const request: CalculateChancesRequest = {
        chances,
        userAnswer,
        professionAptitudes: knowledgeBase.professionAptitudes
      };

      // Отправляем запрос на сервер
      // const response = await fetch(ipConfig.serverip
      //       + ipConfig.chanceEndpoint
      //       + ipConfig.calculateChancesEndpoint, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(request),
      // });

      // if (!response.ok) {
      //   throw new Error('Ошибка при расчете шансов');
      // }



      // const newChances: Chances = await response.json();
      
      const newChances: Chances = mockCalculateChances(request).chances;
      // Обновляем состояния
      setChances(newChances);
      setAnsweredQuestions(new Set([...answeredQuestions, currentQuestion.id]));
      
      // Сохраняем новые chances в localStorage
      localStorage.setItem('currentChances', JSON.stringify(newChances));
      
      // Переходим к следующему вопросу или завершаем опрос
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        handleEnd();
      }
      
    } catch (error) {
      console.error('Ошибка:', error);
      alert('Ошибка при обработке ответа');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && currentQuestionIndex === -1) {
    return (
      <div style={pageStyle}>
        <div style={containerStyle}>
          <div style={loadingStyle}>
            <div style={loadingSpinnerStyle}></div>
          </div>
          <p style={{ textAlign: 'center', color: '#666', marginTop: '15px' }}>
            Загрузка опроса...
          </p>
        </div>
      </div>
    );
  }

  if (!chances || currentQuestionIndex === -1) {
    return (
      <div style={pageStyle}>
        <div style={containerStyle}>
          <h1 style={{ color: '#2c3e50', textAlign: 'center', marginBottom: '20px' }}>
            Ошибка инициализации опроса
          </h1>
          <p style={{ textAlign: 'center', color: '#7f8c8d' }}>
            Не удалось загрузить вопросы. Пожалуйста, попробуйте позже.
          </p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((answeredQuestions.size + 1) / questions.length) * 100;

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <h1 style={{ 
          color: '#2c3e50', 
          textAlign: 'center', 
          marginBottom: '10px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Опрос профессиональных склонностей
        </h1>
        
        {!isEnd && (<><div>
          {/* Прогресс-бар */}
          <div style={{ marginBottom: '25px' }}>
            <div style={progressContainerStyle}>
              <div style={{ ...progressBarStyle, width: `${progress}%` }}></div>
            </div>
            <p style={{
              textAlign: 'center',
              color: '#7f8c8d',
              fontWeight: '600',
              margin: '5px 0'
            }}>
              Вопрос {currentQuestionIndex + 1} из {questions.length}
            </p>
            <p style={{
              textAlign: 'center',
              color: '#4facfe',
              fontSize: '14px',
              margin: 0
            }}>
              Прогресс: {Math.round(progress)}%
            </p>
          </div>

          {/* Текущий вопрос */}
          <div style={questionCardStyle}>
            <h2 style={{
              color: '#2c3e50',
              margin: '0 0 15px 0',
              fontSize: '1.4em',
              lineHeight: '1.4'
            }}>
              {currentQuestion.description}
            </h2>
            <p style={{
              color: '#7f8c8d',
              fontSize: '14px',
              fontStyle: 'italic',
              margin: 0
            }}>
              Выберите вариант ответа
            </p>
          </div>

          {/* Кнопки ответов */}
          <div style={{ marginBottom: '25px', textAlign: 'center' }}>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={sliderValue}
              onChange={(e) => {
                setSliderValue(parseFloat(e.target.value));
              }}
              style={{
                width: '100%',
                height: '8px',
                borderRadius: '4px',
                background: 'linear-gradient(to right, #f44336, #ff9800, #379af8ff, #76c478ff, #45a049)',
                outline: 'none',
                WebkitAppearance: 'none',
              }}
              disabled={isLoading}
            />
            {/* Подписи под слайдером */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '8px',
              fontSize: '12px',
              color: '#7f8c8d'
            }}>
              <span>Нет</span>
              <span>Скорее нет</span>
              <span>Не знаю</span>
              <span>Скорее да</span>
              <span>Да</span>
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <button
              onClick={() => {
                handleAnswer(sliderValue);
              }}
              disabled={isLoading}
              style={{
                ...skipButtonStyle,
                ...(isLoading ? disabledButtonStyle : {}),
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                color: 'white',
              }}
              onMouseEnter={(e) => !isLoading && (e.currentTarget.style.transform = 'translateY(-3px)')}
              onMouseLeave={(e) => !isLoading && (e.currentTarget.style.transform = 'translateY(0)')}
            >
              Далее
            </button>
          </div>
        </div></>)}

        <div style={{ textAlign: 'center' }}>
            {isEnd && <button
              onClick={() => goBack(chances)}
              disabled={isLoading}
              style={{
                ...skipButtonStyle,
                ...(isLoading ? disabledButtonStyle : {}),
              }}
              onMouseEnter={(e) => !isLoading && (e.currentTarget.style.transform = 'translateY(-3px)')}
              onMouseLeave={(e) => !isLoading && (e.currentTarget.style.transform = 'translateY(0)')}
            >
              Перейти на главную
            </button>}
          </div>

        {/* Индикатор загрузки */}
        {isLoading && (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <div style={loadingSpinnerStyle}></div>
            <p style={{ color: '#7f8c8d', marginTop: '10px' }}>Обработка ответа...</p>
          </div>
        )}

        {/* Текущие шансы */}
        <div style={chancesCardStyle}>
          <h3 style={{ 
            color: '#2c3e50', 
            marginTop: 0,
            textAlign: 'center',
            borderBottom: '2px solid #4facfe',
            paddingBottom: '10px'
          }}>
            Текущие шансы:
          </h3>
          <div>
            {Object.entries(chances)
              .sort(([,a], [,b]) => b - a) // Сортировка по убыванию шансов
              .map(([aptitude, chance], index) => (
                <div key={aptitude} style={{
                  ...chanceItemStyle,
                  ...(index === 0
                    ? {
                        background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                        borderLeft: '4px solid #2196f3',
                        borderRadius: '8px',
                        fontWeight: '700',
                        padding: '12px',
                        boxShadow: '0 2px 6px rgba(33,150,243,0.2)',
                      }
                    : {})
                }}
                >
                  <span style={{ 
                    color: '#2c3e50',
                    fontWeight: index === 0 ? '700' : '500'
                    }}>
                      {index === 0 && '🏆 '}
                      {aptitude}</span>
                  <span style={{ 
                    color: chance > 0.3 ? '#27ae60' : chance > 0.1 ? '#f39c12' : '#e74c3c',
                    fontWeight: '600',
                    fontSize: '16px'
                  }}>
                    {(chance * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;