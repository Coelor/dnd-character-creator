import { useState } from 'react';
import { Heart, Plus, Minus } from 'lucide-react';
import { Button } from '../ui/Button';

interface HPTrackerProps {
  current: number;
  max: number;
  temp?: number;
  onChange?: (current: number, temp: number) => void;
  editable?: boolean;
}

export function HPTracker({ current, max, temp = 0, onChange, editable = true }: HPTrackerProps) {
  const [showControls, setShowControls] = useState(false);
  const [adjustValue, setAdjustValue] = useState(1);
  
  const percentage = Math.max(0, Math.min(100, (current / max) * 100));
  const totalHP = current + temp;
  
  const handleAdjust = (amount: number) => {
    const newCurrent = Math.max(0, Math.min(max, current + amount));
    onChange?.(newCurrent, temp);
  };
  
  const handleTempChange = (amount: number) => {
    const newTemp = Math.max(0, temp + amount);
    onChange?.(current, newTemp);
  };
  
  const getHPColor = () => {
    if (percentage > 50) return 'var(--color-success)';
    if (percentage > 25) return 'var(--color-warning)';
    return 'var(--color-error)';
  };
  
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Heart size={20} style={{ color: getHPColor() }} fill={getHPColor()} />
          <span className="text-sm font-semibold" style={{ color: 'var(--color-text-secondary)' }}>
            Hit Points
          </span>
        </div>
        {editable && (
          <button
            onClick={() => setShowControls(!showControls)}
            className="text-xs px-2 py-1 rounded hover:bg-(--color-surface)"
            style={{ color: 'var(--color-accent)' }}
          >
            {showControls ? 'Hide' : 'Adjust'}
          </button>
        )}
      </div>
      
      <div className="text-center mb-3">
        <div className="text-4xl font-bold" style={{ color: getHPColor() }}>
          {totalHP}
        </div>
        <div className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          / {max} HP
        </div>
        {temp > 0 && (
          <div className="text-xs mt-1" style={{ color: 'var(--color-info)' }}>
            +{temp} temp
          </div>
        )}
      </div>
      
      <div className="w-full bg-(--color-surface) rounded-full h-2 mb-3">
        <div
          className="h-2 rounded-full transition-all"
          style={{ width: `${percentage}%`, backgroundColor: getHPColor() }}
        />
      </div>
      
      {showControls && editable && (
        <div className="space-y-3 pt-3 border-t border-(--color-border)">
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={adjustValue}
              onChange={(e) => setAdjustValue(Number(e.target.value))}
              className="input-field w-20 text-center"
              min="1"
            />
            <Button
              size="sm"
              variant="secondary"
              onClick={() => handleAdjust(-adjustValue)}
              className="flex-1"
            >
              <Minus size={14} className="mr-1" />
              Damage
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => handleAdjust(adjustValue)}
              className="flex-1"
            >
              <Plus size={14} className="mr-1" />
              Heal
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-xs flex-1" style={{ color: 'var(--color-text-secondary)' }}>
              Temp HP:
            </span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleTempChange(-1)}
            >
              <Minus size={14} />
            </Button>
            <span className="text-sm font-medium w-8 text-center">{temp}</span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleTempChange(1)}
            >
              <Plus size={14} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}