import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Download, Copy, Edit, Trash2, Filter } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { fetchCharacters } from '../utils/fetchCharacters';
import type { RawCharacter } from '../../types/character';

interface CharacterListItem {
  id: string;
  name: string;
  class: string;
  level: number;
  race: string;
  hp: string;
  ac: number;
  isDraft?: boolean;
  isHomebrew?: boolean;
}

export default function CharactersListPage() {
  const navigate = useNavigate();
  const [characters, setCharacters] = useState<CharacterListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data: RawCharacter[] = await fetchCharacters();
        const mapped: CharacterListItem[] = data.map((char) => ({
          id: char.id || '',
          name: char.name ?? 'Unknown',
          class: char.class ?? 'Unknown',
          level: char.level ?? 1,
          race: char.race ?? 'Unknown',
          hp: char.hp ?? '0/0',
          ac: char.ac ?? 10,
          isDraft: false,
          isHomebrew: false,
        }));
        setCharacters(mapped);
      } catch (e) {
        console.error('Failed to fetch characters:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filteredCharacters = characters.filter((char) => {
    if (filter === 'draft') return char.isDraft;
    if (filter === 'published') return !char.isDraft;
    return true;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-(--color-surface) rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-heading-1">Characters</h1>
          <p className="text-body mt-1" style={{ color: 'var(--color-text-secondary)' }}>
            Manage your D&D characters
          </p>
        </div>
        <Button onClick={() => navigate('/create')}>
          <Plus size={18} className="mr-2" />
          New Character
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        <Filter size={18} style={{ color: 'var(--color-text-secondary)' }} />
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
            filter === 'all' ? 'bg-(--color-accent) text-white' : 'hover:bg-(--color-surface)'
          }`}
          style={filter !== 'all' ? { color: 'var(--color-text)' } : undefined}
        >
          All ({characters.length})
        </button>
        <button
          onClick={() => setFilter('published')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
            filter === 'published' ? 'bg-(--color-accent) text-white' : 'hover:bg-(--color-surface)'
          }`}
          style={filter !== 'published' ? { color: 'var(--color-text)' } : undefined}
        >
          Published ({characters.filter((c) => !c.isDraft).length})
        </button>
        <button
          onClick={() => setFilter('draft')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
            filter === 'draft' ? 'bg-(--color-accent) text-white' : 'hover:bg-(--color-surface)'
          }`}
          style={filter !== 'draft' ? { color: 'var(--color-text)' } : undefined}
        >
          Drafts ({characters.filter((c) => c.isDraft).length})
        </button>
      </div>

      {/* Characters List */}
      {filteredCharacters.length === 0 ? (
        <Card>
          <CardContent>
            <EmptyState
              title="No characters found"
              description={
                filter === 'all'
                  ? 'Create your first character to get started!'
                  : `No ${filter} characters found.`
              }
              actionLabel={filter === 'all' ? 'Create Character' : undefined}
              onAction={filter === 'all' ? () => navigate('/create') : undefined}
            />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredCharacters.map((char) => (
            <Card key={char.id} hover>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    {/* Avatar */}
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                      <span className="text-white font-bold text-xl">
                        {char.name[0]}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg" style={{ color: 'var(--color-text)' }}>
                          {char.name}
                        </h3>
                        {char.isDraft && <Badge variant="warning" size="sm">Draft</Badge>}
                        {char.isHomebrew && <Badge variant="homebrew" size="sm">HB</Badge>}
                      </div>
                      <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                        Level {char.level} {char.race} {char.class}
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="hidden md:flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                          HP
                        </p>
                        <p className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>
                          {char.hp}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                          AC
                        </p>
                        <p className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>
                          {char.ac}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="ghost" size="sm" title="Edit">
                      <Edit size={16} />
                    </Button>
                    <Button variant="ghost" size="sm" title="Duplicate">
                      <Copy size={16} />
                    </Button>
                    <Button variant="ghost" size="sm" title="Export JSON">
                      <Download size={16} />
                    </Button>
                    <Button variant="ghost" size="sm" title="Delete">
                      <Trash2 size={16} style={{ color: 'var(--color-error)' }} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}