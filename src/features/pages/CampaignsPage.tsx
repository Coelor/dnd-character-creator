import { Plus, Users, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';

export default function CampaignsPage() {
  // Mock data for demonstration
  const campaigns: any[] = [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-heading-1">Campaigns</h1>
          <p className="text-body mt-1" style={{ color: 'var(--color-text-secondary)' }}>
            Manage your D&D campaigns and adventures
          </p>
        </div>
        <Button>
          <Plus size={18} className="mr-2" />
          New Campaign
        </Button>
      </div>

      {/* Campaigns List */}
      {campaigns.length === 0 ? (
        <Card>
          <CardContent>
            <EmptyState
              icon={<Calendar size={48} style={{ color: 'var(--color-text-muted)' }} />}
              title="No campaigns yet"
              description="Create your first campaign to organize your adventures and manage your party!"
              actionLabel="Create Campaign"
              onAction={() => {}}
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign: any) => (
            <Card key={campaign.id} hover>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg" style={{ color: 'var(--color-text)' }}>
                      {campaign.title}
                    </h3>
                    <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                      {campaign.system}
                    </p>
                  </div>
                  <Badge variant="accent" size="sm">
                    Active
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span style={{ color: 'var(--color-text-secondary)' }}>
                      <Users size={14} className="inline mr-1" />
                      Party
                    </span>
                    <span className="font-medium" style={{ color: 'var(--color-text)' }}>
                      {campaign.party?.length || 0} members
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span style={{ color: 'var(--color-text-secondary)' }}>
                      <Calendar size={14} className="inline mr-1" />
                      Sessions
                    </span>
                    <span className="font-medium" style={{ color: 'var(--color-text)' }}>
                      {campaign.sessions?.length || 0}
                    </span>
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