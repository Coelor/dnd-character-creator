import { Plus, Calendar, FileText } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';

export default function SessionsPage() {
  const sessions: any[] = [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-heading-1">Sessions</h1>
          <p className="text-body mt-1" style={{ color: 'var(--color-text-secondary)' }}>
            Track your campaign sessions and notes
          </p>
        </div>
        <Button>
          <Plus size={18} className="mr-2" />
          New Session
        </Button>
      </div>

      {/* Sessions List */}
      {sessions.length === 0 ? (
        <Card>
          <CardContent>
            <EmptyState
              icon={<FileText size={48} style={{ color: 'var(--color-text-muted)' }} />}
              title="No sessions yet"
              description="Start tracking your campaign sessions and keep detailed notes of your adventures!"
              actionLabel="Create Session"
              onAction={() => {}}
            />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {sessions.map((session: any) => (
            <Card key={session.id} hover>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-(--color-accent-light) flex items-center justify-center">
                      <Calendar size={20} style={{ color: 'var(--color-accent)' }} />
                    </div>
                    <div>
                      <h3 className="font-semibold" style={{ color: 'var(--color-text)' }}>
                        {session.title}
                      </h3>
                      <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                        {new Date(session.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button variant="secondary" size="sm">
                    View Notes
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}