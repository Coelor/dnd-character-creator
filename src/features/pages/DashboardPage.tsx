import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Plus, Users, Scroll, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { fetchCharacters } from "../utils/fetchCharacters";
import type { RawCharacter } from "../../types/character";

interface DashboardCharacter {
  id: string;
  name: string;
  class: string;
  level: number;
  hp: string;
  ac: number;
  img: string;
}

const DashboardPage = () => {
  const navigate = useNavigate();
  const [characters, setCharacters] = useState<DashboardCharacter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data: RawCharacter[] = await fetchCharacters();

        const uiChars: DashboardCharacter[] = data.map((char) => ({
          id: char.id || '',
          name: char.name ?? "Unknown",
          class: char.class ?? "Unknown",
          level: char.level ?? 1,
          hp: char.hp ?? "0/0",
          ac: char.ac ?? 10,
          img: char.img ?? "/default-avatar.png",
        }));

        setCharacters(uiChars);
      } catch (e) {
        console.error("Failed to fetch characters:", e);
        setError("Could not load your characters.");
      } finally {
        setLoading(false);
      }
    };    

    load();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-(--color-surface) rounded w-48 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-(--color-surface) rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="flex items-center justify-between py-6">
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                Your Characters
              </p>
              <p className="text-3xl font-bold mt-1" style={{ color: 'var(--color-text)' }}>
                {characters.length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-(--color-accent-light)">
              <Users size={24} style={{ color: 'var(--color-accent)' }} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between py-6">
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                Active Campaigns
              </p>
              <p className="text-3xl font-bold mt-1" style={{ color: 'var(--color-text)' }}>
                0
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-50">
              <Scroll size={24} style={{ color: 'var(--color-success)' }} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between py-6">
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                Total Sessions
              </p>
              <p className="text-3xl font-bold mt-1" style={{ color: 'var(--color-text)' }}>
                0
              </p>
            </div>
            <div className="p-3 rounded-lg bg-blue-50">
              <TrendingUp size={24} style={{ color: 'var(--color-info)' }} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Characters Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-heading-2">Your Characters</h2>
          <Button onClick={() => navigate('/create')}>
            <Plus size={18} className="mr-2" />
            New Character
          </Button>
        </div>

        {characters.length === 0 ? (
          <Card>
            <CardContent>
              <EmptyState
                icon={<Users size={48} style={{ color: 'var(--color-text-muted)' }} />}
                title="No characters yet"
                description="Create your first D&D character to get started on your adventure!"
                actionLabel="Create Character"
                onAction={() => navigate('/create')}
              />
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {characters.map((char) => (
              <Card key={char.id} hover>
                <CardContent className="p-0">
                  {/* Character Image */}
                  <div className="h-32 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-t-xl"></div>

                  <div className="p-4">
                    {/* Name and Level */}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-lg" style={{ color: 'var(--color-text)' }}>
                          {char.name}
                        </h3>
                        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                          Level {char.level} {char.class}
                        </p>
                      </div>
                      <Badge variant="accent" size="sm">
                        Lvl {char.level}
                      </Badge>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="text-center p-2 rounded-lg bg-(--color-surface)">
                        <p className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                          HP
                        </p>
                        <p className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>
                          {char.hp}
                        </p>
                      </div>
                      <div className="text-center p-2 rounded-lg bg-(--color-surface)">
                        <p className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                          AC
                        </p>
                        <p className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>
                          {char.ac}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button variant="secondary" size="sm" fullWidth>
                        View Sheet
                      </Button>
                      <Button variant="ghost" size="sm" fullWidth>
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Campaigns Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-heading-2">Your Campaigns</h2>
          <Button variant="secondary">
            <Plus size={18} className="mr-2" />
            New Campaign
          </Button>
        </div>

        <Card>
          <CardContent>
            <EmptyState
              icon={<Scroll size={48} style={{ color: 'var(--color-text-muted)' }} />}
              title="No campaigns yet"
              description="Create a campaign to organize your adventures and manage your party!"
              actionLabel="Create Campaign"
              onAction={() => {}}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;