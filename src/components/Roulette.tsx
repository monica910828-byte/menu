import React, { useState } from 'react';

interface RouletteProps {
  items: string[];
  onResult: (result: string) => void;
}

const Roulette: React.FC<RouletteProps> = ({ items, onResult }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);

  const spin = () => {
    if (isSpinning || items.length === 0) return;
    setIsSpinning(true);
    
    const extraSpins = 5 * 360;
    const randomAngle = Math.floor(Math.random() * 360);
    const totalRotation = rotation + extraSpins + randomAngle;
    
    setRotation(totalRotation);

    setTimeout(() => {
      setIsSpinning(false);
      const currentRotation = totalRotation % 360;
      const sliceAngle = 360 / items.length;
      
      const adjustedRotation = (360 - currentRotation) % 360;
      const winningIndex = Math.floor(adjustedRotation / sliceAngle);
      
      onResult(items[winningIndex]);
    }, 4000);
  };

  const colors = [
    '#EF476F', '#FFD166', '#06D6A0', '#118AB2', '#073B4C', 
    '#9D4EDD', '#FF9F1C', '#2EC4B6'
  ];

  const renderSlices = () => {
    if (items.length === 0) return 'conic-gradient(rgba(255,255,255,0.1) 0 100%)';
    const sliceAngle = 360 / items.length;
    let gradient = 'conic-gradient(';
    items.forEach((_, i) => {
      const color = colors[i % colors.length];
      gradient += `${color} ${i * sliceAngle}deg ${(i + 1) * sliceAngle}deg,`;
    });
    return gradient.slice(0, -1) + ')';
  };

  return (
    <div className="roulette-wrapper">
      <div className="pointer"></div>
      <div className="roulette-container">
        <div 
          className="wheel"
          style={{ 
            background: renderSlices(),
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning ? 'transform 4s cubic-bezier(0.2, 0.8, 0.2, 1)' : 'none'
          }}
        >
          <div className="wheel-text-container">
            {items.map((item, i) => {
              const sliceAngle = 360 / items.length;
              const angle = (i * sliceAngle) + (sliceAngle / 2) - 90; 
              return (
                <div 
                  key={i} 
                  className="wheel-text"
                  style={{ transform: `rotate(${angle}deg)` }}
                >
                  <span style={{ 
                    display: 'inline-block', 
                    maxWidth: '120px', 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis', 
                    whiteSpace: 'nowrap' 
                  }}>
                    {item}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <button 
        className="btn-primary" 
        onClick={spin} 
        disabled={isSpinning || items.length === 0}
        style={{ maxWidth: '200px', marginTop: '1rem' }}
      >
        {isSpinning ? '돌아가는 중...' : '룰렛 돌리기!'}
      </button>
    </div>
  );
};

export default Roulette;
