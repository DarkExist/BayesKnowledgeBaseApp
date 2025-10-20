import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { KnowledgeBase } from '../types';
import Questionnaire from './Questionnaire';

const HomePage: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [databaseName, setDatabaseName] = useState<string | null>(null);
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeBase | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Функция парсинга базы знаний
  const parseKnowledgeBase = async (file: File): Promise<KnowledgeBase> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const parsedData = JSON.parse(content);
          
          // Валидация структуры данных
          if (!parsedData.professionAptitudes || !parsedData.evidenceList) {
            throw new Error('Неверный формат базы знаний');
          }
          
          // Сохраняем в localStorage
          localStorage.setItem('knowledgeBase', JSON.stringify(parsedData));
          localStorage.setItem('knowledgeBaseName', file.name.replace(/\.[^/.]+$/, ""));
          
          resolve({
            name: file.name.replace(/\.[^/.]+$/, ""),
            professionAptitudes: parsedData.professionAptitudes,
            evidenceList: parsedData.evidenceList
          });
        } catch (error) {
          reject(new Error('Ошибка парсинга файла: ' + (error as Error).message));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Ошибка чтения файла'));
      };
      
      reader.readAsText(file);
    });
  };

  const handleLoadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const parsedData = await parseKnowledgeBase(file);
      setDatabaseName(parsedData.name);
      setKnowledgeBase(parsedData);
      setIsLoaded(true);
    } catch (error) {
      console.error('Ошибка загрузки базы:', error);
      alert('Ошибка при загрузке базы знаний: ' + (error as Error).message);
    }
  };

  const handleStart = () => {
    if (isLoaded && knowledgeBase) {
      setShowQuestionnaire(true);
    }
  };

  const handleEdit = () => {
    if (isLoaded) {
      navigate('/edit', { state: { databaseName } });
    }
  };

  const handleQuestionnaireComplete = (finalChances: Record<string, number>) => {
    // Сохраняем финальные шансы в localStorage
    localStorage.setItem('finalChances', JSON.stringify(finalChances));
    
    // Возвращаемся на главный экран
    setShowQuestionnaire(false);
  };

  // Проверяем, есть ли сохраненная база при загрузке компонента
  React.useEffect(() => {
    const savedName = localStorage.getItem('knowledgeBaseName');
    const savedData = localStorage.getItem('knowledgeBase');
    
    if (savedName && savedData) {
      const parsedData = JSON.parse(savedData);
      setDatabaseName(savedName);
      setKnowledgeBase(parsedData);
      setIsLoaded(true);
    }
  }, []);

  // Стили для кнопок
  const buttonStyle = {
    padding: '12px 24px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600' as const,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  };

  const topButtonStyle = {
    ...buttonStyle,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    minWidth: '200px',
  };

  const topButtonDisabledStyle = {
    ...topButtonStyle,
    background: 'linear-gradient(135deg, #cccccc 0%, #999999 100%)',
    cursor: 'not-allowed',
    opacity: 0.6,
  };

  const startButtonStyle = {
    ...buttonStyle,
    padding: '20px 40px',
    fontSize: '1.2em',
    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    color: 'white',
    boxShadow: '0 4px 15px rgba(79, 172, 254, 0.3)',
    minWidth: '220px',
  };

  const startButtonDisabledStyle = {
    ...startButtonStyle,
    background: 'linear-gradient(135deg, #cccccc 0%, #999999 100%)',
    cursor: 'not-allowed',
    opacity: 0.6,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  };

  const buttonHoverStyle = {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
  };

  // Состояния для hover эффектов
  const [isLoadHovered, setIsLoadHovered] = useState(false);
  const [isEditHovered, setIsEditHovered] = useState(false);
  const [isStartHovered, setIsStartHovered] = useState(false);

  // Если показываем опросник, не отображаем основной интерфейс
  if (showQuestionnaire && knowledgeBase) {
    return (
      <Questionnaire 
        knowledgeBase={knowledgeBase} 
        onComplete={handleQuestionnaireComplete} 
      />
    );
  }

  return (
    <div style={{ minHeight: '100vh', position: 'relative', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      {/* Панель управления сверху слева */}
      <div style={{ position: 'absolute', top: 20, left: 20 }}>
        <button 
          onClick={handleLoadClick}
          style={{
            ...topButtonStyle,
            ...(isLoadHovered && !isLoaded ? buttonHoverStyle : {})
          }}
          onMouseEnter={() => setIsLoadHovered(true)}
          onMouseLeave={() => setIsLoadHovered(false)}
        >
          Загрузить базу знаний
        </button>
        <button 
          onClick={handleEdit}
          disabled={!isLoaded}
          style={{ 
            ...(isLoaded ? topButtonStyle : topButtonDisabledStyle),
            marginLeft: '10px',
            ...(isEditHovered && isLoaded ? buttonHoverStyle : {})
          }}
          onMouseEnter={() => setIsEditHovered(true)}
          onMouseLeave={() => setIsEditHovered(false)}
        >
          Редактировать базу знаний
        </button>
      </div>

      {/* Основной контент */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh' 
      }}>
        <button 
          onClick={handleStart}
          disabled={!isLoaded}
          style={{ 
            ...(isLoaded ? startButtonStyle : startButtonDisabledStyle),
            ...(isStartHovered && isLoaded ? buttonHoverStyle : {})
          }}
          onMouseEnter={() => setIsStartHovered(true)}
          onMouseLeave={() => setIsStartHovered(false)}
        >
          Начать
        </button>
        
        {isLoaded && databaseName && (
          <p style={{ 
            marginTop: '20px', 
            fontSize: '16px', 
            color: '#555',
            background: 'rgba(255,255,255,0.7)',
            padding: '10px 20px',
            borderRadius: '20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            Загружена база: <strong>{databaseName}</strong>
          </p>
        )}
      </div>

      {/* Скрытый input для выбора файла */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept=".json"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default HomePage;