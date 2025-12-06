import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { KnowledgeBase, ProfessionAptitude, EvidenceItem, ProbabilitiedEvidence } from '../types';

const EditPage: React.FC = () => {
  const navigate = useNavigate();
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeBase | null>(null);
  const [selectedAptitude, setSelectedAptitude] = useState<ProfessionAptitude | null>(null);
  const [newEvidenceDescription, setNewEvidenceDescription] = useState('');
  const [showAddEvidenceModal, setShowAddEvidenceModal] = useState(false);
  const [newAptitudeName, setNewAptitudeName] = useState(''); 
  const [showAddAptitudeModal, setShowAddAptitudeModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [newDatabaseName, setNewDatabaseName] = useState('');
  const [evidenceToDelete, setEvidenceToDelete] = useState<number | null>(null); // Новое состояние для удаления вопроса
  const [aptitudeToDelete, setAptitudeToDelete] = useState<string | null>(null); // Новое состояние для удаления варианта
  const [showDeleteEvidenceModal, setShowDeleteEvidenceModal] = useState(false); // Новое состояние модалки
  const [showDeleteAptitudeModal, setShowDeleteAptitudeModal] = useState(false); // Новое состояние модалки

  useEffect(() => {
    const savedData = localStorage.getItem('knowledgeBase');
    const savedName = localStorage.getItem('knowledgeBaseName');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setKnowledgeBase(parsedData);
      setNewDatabaseName(savedName || parsedData.name || 'Новая база знаний');
    }
  }, []);

  // Стили
    const deleteButtonStyle = {
    position: 'absolute' as const,
    top: '8px',
    right: '8px',
    background: 'none',
    border: 'none',
    color: '#e74c3c',
    fontSize: '18px',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '4px',
    transition: 'all 0.2s ease',    
  };

  const pageStyle = {
    minHeight: '100vh',
    padding: '20px',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  };

  const buttonStyle = {
    padding: '12px 24px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600' as const,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
  };

  const backButtonStyle = {
    ...buttonStyle,
    background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
    marginBottom: '20px'
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  };

  const dangerButtonStyle = {
    ...buttonStyle,
    background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
    padding: '8px 16px',
    fontSize: '12px'
  };

  const inputStyle = {
    padding: '10px 12px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
    transition: 'all 0.3s ease',
    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)'
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse' as const,
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    marginBottom: '30px'
  };

  const thStyle = {
    backgroundColor: '#4facfe',
    color: 'white',
    padding: '15px',
    textAlign: 'left' as const,
    fontWeight: '600',
    border: 'none'
  };

  const tdStyle = {
    padding: '12px 15px',
    borderBottom: '1px solid #f0f0f0',
    backgroundColor: 'white'
  };

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    marginBottom: '20px'
  };

  const modalOverlayStyle = {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  };

  const modalContentStyle = {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '15px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
    minWidth: '400px',
    maxWidth: '500px',
    width: '90%'
  };

  const listItemStyle = {
    padding: '15px',
    marginBottom: '10px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  };

  const handleBack = () => {
    navigate(-1);
  };

    // Новая функция для удаления вопроса
  const handleDeleteEvidence = () => {
    if (!knowledgeBase || evidenceToDelete === null) return;
    
    // Удаляем вопрос из базы
    const updatedEvidenceList = knowledgeBase.evidenceList.filter(e => e.id !== evidenceToDelete);
    
    // Удаляем ссылки на этот вопрос из всех вариантов
    const updatedAptitudes = knowledgeBase.professionAptitudes.map(aptitude => ({
      ...aptitude,
      probabilitiedEvidences: aptitude.probabilitiedEvidences.filter(
        evidence => evidence.evidenceId !== evidenceToDelete
      )
    }));
    
    setKnowledgeBase({
      ...knowledgeBase,
      evidenceList: updatedEvidenceList,
      professionAptitudes: updatedAptitudes
    });
    
    setShowDeleteEvidenceModal(false);
    setEvidenceToDelete(null);
  };

  // Новая функция для удаления варианта
  const handleDeleteAptitude = () => {
    if (!knowledgeBase || !aptitudeToDelete) return;
    
    const updatedAptitudes = knowledgeBase.professionAptitudes.filter(
      aptitude => aptitude.name !== aptitudeToDelete
    );
    
    setKnowledgeBase({
      ...knowledgeBase,
      professionAptitudes: updatedAptitudes
    });
    
    setShowDeleteAptitudeModal(false);
    setAptitudeToDelete(null);
  };

  const handleSaveToLocalStorage = () => {
    if (knowledgeBase) {
      const updatedBase = {
        ...knowledgeBase,
        name: newDatabaseName
      };
      
      localStorage.setItem('knowledgeBase', JSON.stringify(updatedBase));
      localStorage.setItem('knowledgeBaseName', newDatabaseName);
      setKnowledgeBase(updatedBase);
      alert('Изменения сохранены в браузере');
    }
  };

  const handleSaveToFile = () => {
    if (!knowledgeBase) return;

    const updatedBase = {
      ...knowledgeBase,
      name: newDatabaseName
    };

    const jsonString = JSON.stringify(updatedBase, null, 2);
    
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = `${newDatabaseName}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    localStorage.setItem('knowledgeBase', JSON.stringify(updatedBase));
    localStorage.setItem('knowledgeBaseName', newDatabaseName);
    setKnowledgeBase(updatedBase);
    
    setShowSaveModal(false);
    alert(`База знаний "${newDatabaseName}" успешно скачана!`);
  };

  const handleAddEvidence = () => {
    if (!knowledgeBase || !newEvidenceDescription.trim()) return;

    const newId = Math.max(...knowledgeBase.evidenceList.map(e => e.id), 0) + 1;
    
    const newEvidence: EvidenceItem = {
      id: newId,
      description: newEvidenceDescription.trim()
    };

    const updatedKnowledgeBase = {
      ...knowledgeBase,
      evidence_list: [...knowledgeBase.evidenceList, newEvidence]
    };

    setKnowledgeBase(updatedKnowledgeBase);
    setNewEvidenceDescription('');
    setShowAddEvidenceModal(false);
  };

  // Новая функция для добавления варианта
  const handleAddAptitude = () => {
    if (!knowledgeBase || !newAptitudeName.trim()) return;
    
    // Проверка на уникальность названия
    const exists = knowledgeBase.professionAptitudes.some(
      apt => apt.name.toLowerCase() === newAptitudeName.trim().toLowerCase()
    );
    
    if (exists) {
      alert('Вариант с таким названием уже существует!');
      return;
    }
    
    const newAptitude: ProfessionAptitude = {
      name: newAptitudeName.trim(),
      priorProbability: 0.1, // Значение по умолчанию
      probabilitiedEvidences: [] // Пустой массив свидетельств
    };

    const updatedKnowledgeBase = {
      ...knowledgeBase,
      professionAptitudes: [...knowledgeBase.professionAptitudes, newAptitude]
    };

    setKnowledgeBase(updatedKnowledgeBase);
    setNewAptitudeName('');
    setShowAddAptitudeModal(false);
  };


  const handlePriorProbabilityChange = (value: number) => {
    if (!knowledgeBase || !selectedAptitude) return;

    const updatedAptitudes = knowledgeBase.professionAptitudes.map(aptitude =>
      aptitude.name === selectedAptitude.name
        ? { ...aptitude, priorProbability: value }
        : aptitude
    );

    setKnowledgeBase({
      ...knowledgeBase,
      professionAptitudes: updatedAptitudes
    });

    setSelectedAptitude({
      ...selectedAptitude,
      priorProbability: value
    });
  };

  const handleEvidenceProbabilityChange = (evidenceId: number, field: keyof ProbabilitiedEvidence, value: number) => {
    if (!knowledgeBase || !selectedAptitude) return;

    const updatedEvidence = selectedAptitude.probabilitiedEvidences.map(evidence =>
      evidence.evidenceId === evidenceId
        ? { ...evidence, [field]: value }
        : evidence
    );

    const updatedAptitudes = knowledgeBase.professionAptitudes.map(aptitude =>
      aptitude.name === selectedAptitude.name
        ? { ...aptitude, probabilitiedEvidences: updatedEvidence }
        : aptitude
    );

    setKnowledgeBase({
      ...knowledgeBase,
      professionAptitudes: updatedAptitudes
    });

    setSelectedAptitude({
      ...selectedAptitude,
      probabilitiedEvidences: updatedEvidence
    });
  };

  const handleAddEvidenceToAptitude = (evidenceId: number) => {
    if (!knowledgeBase || !selectedAptitude) return;

    if (selectedAptitude.probabilitiedEvidences.some(e => e.evidenceId === evidenceId)) {
      alert('Это свидетельство уже добавлено');
      return;
    }

    const newEvidence: ProbabilitiedEvidence = {
      evidenceId: evidenceId,
      probabilityOfTrue: 0.9,
      probabilityOfFalse: 0.1
    };

    const updatedEvidence = [...selectedAptitude.probabilitiedEvidences, newEvidence];

    const updatedAptitudes = knowledgeBase.professionAptitudes.map(aptitude =>
      aptitude.name === selectedAptitude.name
        ? { ...aptitude, probabilitiedEvidences: updatedEvidence }
        : aptitude
    );

    setKnowledgeBase({
      ...knowledgeBase,
      professionAptitudes: updatedAptitudes
    });

    setSelectedAptitude({
      ...selectedAptitude,
      probabilitiedEvidences: updatedEvidence
    });
  };

  const handleRemoveEvidenceFromAptitude = (evidenceId: number) => {
    if (!knowledgeBase || !selectedAptitude) return;

    const updatedEvidence = selectedAptitude.probabilitiedEvidences.filter(e => e.evidenceId !== evidenceId);

    const updatedAptitudes = knowledgeBase.professionAptitudes.map(aptitude =>
      aptitude.name === selectedAptitude.name
        ? { ...aptitude, probabilitiedEvidences: updatedEvidence }
        : aptitude
    );

    setKnowledgeBase({
      ...knowledgeBase,
      professionAptitudes: updatedAptitudes
    });

    setSelectedAptitude({
      ...selectedAptitude,
      probabilitiedEvidences: updatedEvidence
    });
  };

  // Если выбран конкретный aptitude, показываем его детали
  if (selectedAptitude) {
    return (
      <div style={pageStyle}>
        <button 
          onClick={() => setSelectedAptitude(null)} 
          style={backButtonStyle}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          ← Назад к списку
        </button>
        
        <div style={cardStyle}>
          <h1 style={{ color: '#2c3e50', marginBottom: '10px' }}>Редактирование: {selectedAptitude.name}</h1>
          
          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', color: '#34495e' }}>
              Prior Probability:
            </label>
            <input
              type="number"
              step="0.001"
              min="0"
              max="1"
              value={selectedAptitude.priorProbability}
              onChange={(e) => handlePriorProbabilityChange(parseFloat(e.target.value))}
              style={inputStyle}
            />
          </div>

          <h2 style={{ color: '#2c3e50', borderBottom: '2px solid #4facfe', paddingBottom: '10px' }}>
            Свидетельства в этом варианте
          </h2>
          
          {selectedAptitude.probabilitiedEvidences.length === 0 ? (
            <p style={{ color: '#7f8c8d', fontStyle: 'italic' }}>Нет добавленных свидетельств</p>
          ) : (
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>ID</th>
                  <th style={thStyle}>Описание</th>
                  <th style={thStyle}>P(evidence|aptitude=true)</th>
                  <th style={thStyle}>P(evidence|aptitude=false)</th>
                  <th style={thStyle}>Действия</th>
                </tr>
              </thead>
              <tbody>
                {selectedAptitude.probabilitiedEvidences.map(evidence => {
                  const evidenceInfo = knowledgeBase?.evidenceList.find(e => e.id === evidence.evidenceId);
                  return (
                    <tr key={evidence.evidenceId}>
                      <td style={tdStyle}>{evidence.evidenceId}</td>
                      <td style={tdStyle}>{evidenceInfo?.description || 'Не найдено'}</td>
                      <td style={tdStyle}>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          max="1"
                          value={evidence.probabilityOfTrue}
                          onChange={(e) => handleEvidenceProbabilityChange(evidence.evidenceId, 'probabilityOfTrue', parseFloat(e.target.value))}
                          style={{ ...inputStyle, width: '100%' }}
                        />
                      </td>
                      <td style={tdStyle}>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          max="1"
                          value={evidence.probabilityOfFalse}
                          onChange={(e) => handleEvidenceProbabilityChange(evidence.evidenceId, 'probabilityOfFalse', parseFloat(e.target.value))}
                          style={{ ...inputStyle, width: '100%' }}
                        />
                      </td>
                      <td style={tdStyle}>
                        <button 
                          onClick={() => handleRemoveEvidenceFromAptitude(evidence.evidenceId)}
                          style={dangerButtonStyle}
                          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                          Удалить
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          <h3 style={{ color: '#2c3e50' }}>Добавить свидетельство</h3>
          <select 
            onChange={(e) => handleAddEvidenceToAptitude(parseInt(e.target.value))}
            style={{ ...inputStyle, marginRight: '10px', minWidth: '200px' }}
          >
            <option value="">Выберите свидетельство</option>
            {knowledgeBase?.evidenceList
              .filter(evidence => !selectedAptitude.probabilitiedEvidences.some(e => e.evidenceId === evidence.id))
              .map(evidence => (
                <option key={evidence.id} value={evidence.id}>
                  {evidence.id}: {evidence.description}
                </option>
              ))}
          </select>

          <div style={{ marginTop: '20px' }}>
            <button 
              onClick={handleSaveToLocalStorage}
              style={secondaryButtonStyle}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Сохранить в браузере
            </button>
            <button 
              onClick={() => setShowSaveModal(true)} 
              style={{ ...secondaryButtonStyle, marginLeft: '10px' }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Скачать базу знаний
            </button>
          </div>
        </div>

        {/* Модальное окно сохранения */}
        {showSaveModal && (
          <div style={modalOverlayStyle}>
            <div style={modalContentStyle}>
              <h3 style={{ color: '#2c3e50', marginBottom: '20px' }}>Скачать базу знаний</h3>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#34495e' }}>
                  Название базы знаний:
                </label>
                <input
                  type="text"
                  value={newDatabaseName}
                  onChange={(e) => setNewDatabaseName(e.target.value)}
                  style={{ ...inputStyle, width: '100%' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={handleSaveToFile}
                  style={buttonStyle}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  Скачать
                </button>
                <button 
                  onClick={() => setShowSaveModal(false)}
                  style={{ ...buttonStyle, background: 'linear-gradient(135deg, #cccccc 0%, #999999 100%)' }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  Отмена
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Основной вид - список aptitudes
  return (
    <div style={pageStyle}>
      <button 
        onClick={handleBack} 
        style={backButtonStyle}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
      >
        ← Назад
      </button>
      
      <div style={cardStyle}>
        <h1 style={{ color: '#2c3e50', marginBottom: '20px' }}>Редактирование базы знаний</h1>
        
        {knowledgeBase ? (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <button 
                onClick={handleSaveToLocalStorage}
                style={secondaryButtonStyle}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                Сохранить в браузере
              </button>
              <button 
                onClick={() => setShowSaveModal(true)} 
                style={{ ...secondaryButtonStyle, marginLeft: '10px' }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                Скачать базу знаний
              </button>
            </div>
            
            <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' as const }}>
              {/* Список свидетельств */}
              <div style={{ flex: '1', minWidth: '300px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <h2 style={{ color: '#2c3e50', margin: 0 }}>Список вопросов ({knowledgeBase.evidenceList.length})</h2>
                  <button 
                    onClick={() => setShowAddEvidenceModal(true)}
                    style={secondaryButtonStyle}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    Добавить вопрос
                  </button>
                </div>
                <div style={{ maxHeight: '400px', overflowY: 'auto', padding: '10px', position: 'relative' }}>
                  {knowledgeBase.evidenceList.map(evidence => (
                    <div key={evidence.id} style={{ ...listItemStyle, position: 'relative' }}>
                      <strong style={{ color: '#2c3e50' }}>ID {evidence.id}:</strong> {evidence.description}
                      <button
                        onClick={() => {
                          setEvidenceToDelete(evidence.id);
                          setShowDeleteEvidenceModal(true);
                        }}
                        style={deleteButtonStyle}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>


              {/* Список aptitudes */}
              <div style={{ flex: '1', minWidth: '300px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <h2 style={{ color: '#2c3e50', margin: 0 }}>
                    Список вариантов ({knowledgeBase.professionAptitudes.length})
                  </h2>
                  <button 
                    onClick={() => setShowAddAptitudeModal(true)}
                    style={secondaryButtonStyle}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    Добавить вариант
                  </button>
                </div>
                <div>
                  {knowledgeBase.professionAptitudes.map(aptitude => (
                    <div 
                      key={aptitude.name} 
                      style={{ ...listItemStyle, cursor: 'pointer', position: 'relative' }}
                      onClick={() => setSelectedAptitude(aptitude)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
                      }}
                    >
                      <strong style={{ color: '#2c3e50', display: 'block', marginBottom: '5px' }}>{aptitude.name}</strong>
                      <small style={{ color: '#7f8c8d' }}>
                        Prior: {aptitude.priorProbability} | Evidence: {aptitude.probabilitiedEvidences.length} items
                      </small>
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Предотвращаем переход к редактированию
                          setAptitudeToDelete(aptitude.name);
                          setShowDeleteAptitudeModal(true);
                        }}
                        style={deleteButtonStyle}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Модальное окно добавления свидетельства */}
            {showAddEvidenceModal && (
              <div style={modalOverlayStyle}>
                <div style={modalContentStyle}>
                  <h3 style={{ color: '#2c3e50', marginBottom: '20px' }}>Добавить новый вопрос</h3>
                  <input
                    type="text"
                    value={newEvidenceDescription}
                    onChange={(e) => setNewEvidenceDescription(e.target.value)}
                    placeholder="Введите описание вопроса"
                    style={{ ...inputStyle, width: '100%', marginBottom: '20px' }}
                  />
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      onClick={handleAddEvidence}
                      style={buttonStyle}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      Добавить
                    </button>
                    <button 
                      onClick={() => setShowAddEvidenceModal(false)}
                      style={{ ...buttonStyle, background: 'linear-gradient(135deg, #cccccc 0%, #999999 100%)' }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      Отмена
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Модальное окно удаления вопроса */}
            {showDeleteEvidenceModal && (
              <div style={modalOverlayStyle}>
                <div style={modalContentStyle}>
                  <h3 style={{ color: '#2c3e50', marginBottom: '20px' }}>Подтверждение удаления</h3>
                  <p style={{ marginBottom: '25px' }}>
                    Вы уверены, что хотите удалить вопрос ID {evidenceToDelete}?<br />
                    Это действие удалит вопрос из всех вариантов.
                  </p>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      onClick={handleDeleteEvidence}
                      style={{ ...buttonStyle, background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)' }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      Удалить
                    </button>
                    <button 
                      onClick={() => setShowDeleteEvidenceModal(false)}
                      style={{ ...buttonStyle, background: 'linear-gradient(135deg, #cccccc 0%, #999999 100%)' }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      Отмена
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Модальное окно удаления варианта */}
            {showDeleteAptitudeModal && (
              <div style={modalOverlayStyle}>
                <div style={modalContentStyle}>
                  <h3 style={{ color: '#2c3e50', marginBottom: '20px' }}>Подтверждение удаления</h3>
                  <p style={{ marginBottom: '25px' }}>
                    Вы уверены, что хотите удалить вариант "{aptitudeToDelete}"?<br />
                  </p>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      onClick={handleDeleteAptitude}
                      style={{ ...buttonStyle, background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)' }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      Удалить
                    </button>
                    <button 
                      onClick={() => setShowDeleteAptitudeModal(false)}
                      style={{ ...buttonStyle, background: 'linear-gradient(135deg, #cccccc 0%, #999999 100%)' }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      Отмена
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Новое модальное окно добавления варианта */}
            {showAddAptitudeModal && (
              <div style={modalOverlayStyle}>
                <div style={modalContentStyle}>
                  <h3 style={{ color: '#2c3e50', marginBottom: '20px' }}>Добавить новый вариант</h3>
                  <input
                    type="text"
                    value={newAptitudeName}
                    onChange={(e) => setNewAptitudeName(e.target.value)}
                    placeholder="Введите название варианта"
                    style={{ ...inputStyle, width: '100%', marginBottom: '20px' }}
                  />
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      onClick={handleAddAptitude}
                      style={buttonStyle}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      Добавить
                    </button>
                    <button 
                      onClick={() => setShowAddAptitudeModal(false)}
                      style={{ ...buttonStyle, background: 'linear-gradient(135deg, #cccccc 0%, #999999 100%)' }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      Отмена
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Модальное окно сохранения */}
            {showSaveModal && (
              <div style={modalOverlayStyle}>
                <div style={modalContentStyle}>
                  <h3 style={{ color: '#2c3e50', marginBottom: '20px' }}>Скачать базу знаний</h3>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#34495e' }}>
                      Название базы знаний:
                    </label>
                    <input
                      type="text"
                      value={newDatabaseName}
                      onChange={(e) => setNewDatabaseName(e.target.value)}
                      style={{ ...inputStyle, width: '100%' }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      onClick={handleSaveToFile}
                      style={buttonStyle}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      Скачать
                    </button>
                    <button 
                      onClick={() => setShowSaveModal(false)}
                      style={{ ...buttonStyle, background: 'linear-gradient(135deg, #cccccc 0%, #999999 100%)' }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      Отмена
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <p style={{ color: '#7f8c8d', fontStyle: 'italic' }}>База знаний не загружена</p>
        )}
      </div>
    </div>
  );
};

export default EditPage;