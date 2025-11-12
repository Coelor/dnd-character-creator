import { useEffect, useRef } from 'react';
import { X, Search, Users, Scroll, Calendar } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store';
import { setSearchOpen, setSearchQuery } from '../../store/slices/uiSlice';

export function GlobalSearch() {
  const dispatch = useAppDispatch();
  const { searchOpen, searchQuery } = useAppSelector((state) => state.ui);
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (searchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchOpen]);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !searchOpen) {
        e.preventDefault();
        dispatch(setSearchOpen(true));
      }
      if (e.key === 'Escape' && searchOpen) {
        dispatch(setSearchOpen(false));
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen, dispatch]);
  
  if (!searchOpen) return null;
  
  // Mock results for demonstration
  const results = {
    characters: searchQuery ? [
      { id: '1', name: 'Thorin Ironforge', class: 'Fighter', level: 5 },
      { id: '2', name: 'Elara Moonwhisper', class: 'Wizard', level: 3 },
    ] : [],
    campaigns: searchQuery ? [
      { id: '1', title: 'Lost Mines of Phandelver', sessions: 12 },
    ] : [],
    sessions: searchQuery ? [
      { id: '1', title: 'The Goblin Ambush', date: '2024-01-15' },
    ] : [],
  };
  
  const hasResults = results.characters.length > 0 || results.campaigns.length > 0 || results.sessions.length > 0;
  
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20"
      onClick={() => dispatch(setSearchOpen(false))}
    >
      <div
        className="bg-(--color-bg) rounded-xl shadow-xl w-full max-w-2xl mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="p-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex items-center gap-3">
            <Search size={20} style={{ color: 'var(--color-text-secondary)' }} />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search characters, campaigns, sessions..."
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              className="flex-1 bg-transparent outline-none text-base"
              style={{ color: 'var(--color-text)' }}
            />
            <button
              onClick={() => dispatch(setSearchOpen(false))}
              className="p-1 rounded hover:bg-(--color-surface)"
            >
              <X size={20} style={{ color: 'var(--color-text-secondary)' }} />
            </button>
          </div>
        </div>
        
        {/* Results */}
        <div className="max-h-96 overflow-y-auto p-2">
          {!searchQuery && (
            <div className="p-8 text-center" style={{ color: 'var(--color-text-secondary)' }}>
              <p className="text-sm">Start typing to search...</p>
            </div>
          )}
          
          {searchQuery && !hasResults && (
            <div className="p-8 text-center" style={{ color: 'var(--color-text-secondary)' }}>
              <p className="text-sm">No results found for "{searchQuery}"</p>
            </div>
          )}
          
          {hasResults && (
            <div className="space-y-4">
              {results.characters.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold" style={{ color: 'var(--color-text-secondary)' }}>
                    <Users size={14} />
                    CHARACTERS
                  </div>
                  {results.characters.map((char) => (
                    <button
                      key={char.id}
                      className="w-full px-3 py-2 rounded-lg hover:bg-(--color-surface) text-left transition-all"
                    >
                      <div className="font-medium" style={{ color: 'var(--color-text)' }}>
                        {char.name}
                      </div>
                      <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                        Level {char.level} {char.class}
                      </div>
                    </button>
                  ))}
                </div>
              )}
              
              {results.campaigns.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold" style={{ color: 'var(--color-text-secondary)' }}>
                    <Scroll size={14} />
                    CAMPAIGNS
                  </div>
                  {results.campaigns.map((campaign) => (
                    <button
                      key={campaign.id}
                      className="w-full px-3 py-2 rounded-lg hover:bg-(--color-surface) text-left transition-all"
                    >
                      <div className="font-medium" style={{ color: 'var(--color-text)' }}>
                        {campaign.title}
                      </div>
                      <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                        {campaign.sessions} sessions
                      </div>
                    </button>
                  ))}
                </div>
              )}
              
              {results.sessions.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold" style={{ color: 'var(--color-text-secondary)' }}>
                    <Calendar size={14} />
                    SESSIONS
                  </div>
                  {results.sessions.map((session) => (
                    <button
                      key={session.id}
                      className="w-full px-3 py-2 rounded-lg hover:bg-(--color-surface) text-left transition-all"
                    >
                      <div className="font-medium" style={{ color: 'var(--color-text)' }}>
                        {session.title}
                      </div>
                      <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                        {new Date(session.date).toLocaleDateString()}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}