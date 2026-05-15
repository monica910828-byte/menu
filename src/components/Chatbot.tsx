import React, { useState } from 'react';
import { fetchChatResponse } from '../api/chat';
import { LUNCH_RECOMMENDATION_SYSTEM_PROMPT } from '../constants/prompts';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatbotProps {
  onRecommend: (menuNames: string[]) => void;
}

const Chatbot: React.FC<ChatbotProps> = ({ onRecommend }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'system', content: LUNCH_RECOMMENDATION_SYSTEM_PROMPT }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const [location, setLocation] = useState('');
  const [weather, setWeather] = useState('');
  const [people, setPeople] = useState('');
  const [budget, setBudget] = useState('');
  const [solo, setSolo] = useState(false);
  const [spicy, setSpicy] = useState(false);
  const [preference, setPreference] = useState('');

  const handleRecommend = async () => {
    const userContext = `상황:
지역: ${location || '상관없음'}
날씨: ${weather || '상관없음'}
인원수: ${people || '상관없음'}
예산: ${budget || '상관없음'}
혼밥 여부: ${solo ? '예' : '아니오'}
매운 음식 선호: ${spicy ? '예' : '아니오'}
선호 종류: ${preference || '상관없음'}

이 상황에 맞는 점심 메뉴를 5개 추천해줘.`;

    const newUserMessage: Message = { role: 'user', content: userContext };
    const newMessages = [...messages, newUserMessage];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const data = await fetchChatResponse(newMessages);
      const assistantMessage: Message = data.choices[0].message;
      setMessages((prev) => [...prev, assistantMessage]);
      
      // Match all bracketed items globally
      const matches = [...assistantMessage.content.matchAll(/\[(.*?)\]/g)];
      if (matches.length > 0) {
        const menuNames = matches.map(m => m[1].trim());
        onRecommend(menuNames);
      }
    } catch (error: any) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `죄송합니다. 오류가 발생하여 추천을 가져오지 못했습니다. (${error.message || '알 수 없는 오류'})` },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-panel">
      <h2>🤖 AI 상황별 추천</h2>
      <div className="input-group">
        <label>지역</label>
        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="예: 강남역, 홍대, 우리 회사 근처" />
      </div>
      <div className="input-group">
        <label>날씨</label>
        <input type="text" value={weather} onChange={(e) => setWeather(e.target.value)} placeholder="예: 비, 맑음, 흐림" />
      </div>
      <div className="input-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label>인원수</label>
          <input type="text" value={people} onChange={(e) => setPeople(e.target.value)} placeholder="예: 2명" />
        </div>
        <div>
          <label>예산</label>
          <input type="text" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="예: 만원 이하" />
        </div>
      </div>
      <div className="input-group">
        <label>선호 종류 (한/중/일 등)</label>
        <input type="text" value={preference} onChange={(e) => setPreference(e.target.value)} placeholder="예: 한식, 국물요리" />
      </div>
      <div className="input-group" style={{ display: 'flex', gap: '1.5rem' }}>
        <label className="checkbox-group">
          <input type="checkbox" checked={solo} onChange={(e) => setSolo(e.target.checked)} />
          혼밥 여부
        </label>
        <label className="checkbox-group">
          <input type="checkbox" checked={spicy} onChange={(e) => setSpicy(e.target.checked)} />
          매운 음식 선호
        </label>
      </div>
      
      <button className="btn-primary" onClick={handleRecommend} disabled={isLoading}>
        {isLoading ? 'AI가 고민 중...' : '✨ AI 메뉴 추천받기'}
      </button>

      <div className="chat-box">
        {messages.filter(m => m.role !== 'system').map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            <strong>{msg.role === 'user' ? '나' : 'AI'}:</strong> {msg.content}
            {msg.role === 'assistant' && msg.content.includes('[') && (
              <div style={{ marginTop: '0.5rem' }}>
                <small style={{ color: 'var(--accent-secondary)' }}>* 추천 메뉴가 자동으로 룰렛에 추가되었습니다!</small>
              </div>
            )}
          </div>
        ))}
        {messages.filter(m => m.role !== 'system').length === 0 && !isLoading && (
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', margin: '1rem 0' }}>
            상황을 입력하고 추천을 받아보세요!
          </p>
        )}
      </div>
    </div>
  );
};

export default Chatbot;
