import React, { useState } from 'react';
import Chatbot from './components/Chatbot';
import Roulette from './components/Roulette';
import './index.css';

function App() {
  const [rouletteItems, setRouletteItems] = useState<string[]>([]);
  const [newItem, setNewItem] = useState('');
  const [result, setResult] = useState<string | null>(null);

  const clearAll = () => {
    setRouletteItems([]);
  };

  const handleAddMenu = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItem.trim() && !rouletteItems.includes(newItem.trim())) {
      setRouletteItems([...rouletteItems, newItem.trim()]);
      setNewItem('');
    }
  };

  const removeMenu = (index: number) => {
    setRouletteItems(rouletteItems.filter((_, i) => i !== index));
  };

  const handleAIRecommend = (menuNames: string[]) => {
    setRouletteItems(prev => {
      const newItems = menuNames.filter(menu => !prev.includes(menu));
      return [...prev, ...newItems];
    });
  };

  return (
    <>
      <h1>오늘 점심 뭐 먹지? 🍱</h1>
      <div className="app-container">
        
        {/* Left Panel: AI Chatbot */}
        <Chatbot onRecommend={handleAIRecommend} />

        {/* Right Panel: Roulette */}
        <div className="glass-panel">
          <h2>🎯 점심 메뉴 룰렛</h2>
          
          <div className="menu-tags">
            {rouletteItems.length === 0 && (
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                아직 추가된 메뉴가 없습니다. AI 추천을 받거나 직접 입력해보세요!
              </span>
            )}
            {rouletteItems.map((item, index) => (
              <span key={index} className="menu-tag">
                {item}
                <button onClick={() => removeMenu(index)}>×</button>
              </span>
            ))}
            {rouletteItems.length > 0 && (
              <button 
                onClick={clearAll} 
                style={{ 
                  background: 'rgba(239, 68, 68, 0.2)', 
                  border: '1px solid #ef4444', 
                  color: '#ef4444', 
                  padding: '0.4rem 0.8rem', 
                  borderRadius: '20px', 
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  marginLeft: 'auto'
                }}
              >
                모두 삭제 🗑️
              </button>
            )}
          </div>

          <form onSubmit={handleAddMenu} style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
            <input 
              type="text" 
              value={newItem} 
              onChange={(e) => setNewItem(e.target.value)} 
              placeholder="메뉴 직접 추가..." 
              style={{ flex: 1 }}
            />
            <button type="submit" className="btn-primary" style={{ width: 'auto', padding: '0.8rem 1.5rem' }}>추가</button>
          </form>

          <Roulette items={rouletteItems} onResult={(res) => setResult(res)} />
        </div>

      </div>

      {/* Result Modal */}
      {result && (
        <div className="modal-overlay" onClick={() => setResult(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>🎉 오늘의 추천 메뉴는...</h3>
            <div className="result-text">{result}</div>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button className="btn-primary" onClick={() => setResult(null)} style={{ background: 'rgba(255,255,255,0.1)' }}>
                다시 돌리기
              </button>
              <a 
                href={`https://map.naver.com/v5/search/${result}`} 
                target="_blank" 
                rel="noreferrer"
                style={{ textDecoration: 'none', flex: 1 }}
              >
                <button className="btn-primary">
                  주변 식당 찾기 🗺️
                </button>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
