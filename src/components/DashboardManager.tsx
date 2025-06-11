
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Save, FolderOpen, Trash2, Edit, Clock, Star } from 'lucide-react';
import { useVisualization } from '@/contexts/VisualizationContext';
import { toast } from 'sonner';

interface SavedDashboard {
  id: string;
  name: string;
  description: string;
  timestamp: string;
  config: {
    selectedChart: string;
    filters: any;
    customConfig: any;
  };
  isFavorite: boolean;
}

const DashboardManager = () => {
  const { selectedChart, customChartConfig } = useVisualization();
  const [savedDashboards, setSavedDashboards] = useState<SavedDashboard[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [saveDescription, setSaveDescription] = useState('');

  // Load saved dashboards from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('sphereai_saved_dashboards');
    if (saved) {
      try {
        setSavedDashboards(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading saved dashboards:', error);
      }
    }
  }, []);

  // Save dashboards to localStorage whenever the list changes
  useEffect(() => {
    localStorage.setItem('sphereai_saved_dashboards', JSON.stringify(savedDashboards));
  }, [savedDashboards]);

  const saveDashboard = () => {
    if (!saveName.trim()) {
      toast.error('Please enter a dashboard name');
      return;
    }

    const newDashboard: SavedDashboard = {
      id: `dashboard_${Date.now()}`,
      name: saveName.trim(),
      description: saveDescription.trim(),
      timestamp: new Date().toISOString(),
      config: {
        selectedChart,
        filters: {}, // Would include current filter state
        customConfig: customChartConfig
      },
      isFavorite: false
    };

    setSavedDashboards(prev => [newDashboard, ...prev]);
    setSaveName('');
    setSaveDescription('');
    setShowSaveDialog(false);
    
    toast.success(`Dashboard "${newDashboard.name}" saved successfully`);
  };

  const loadDashboard = (dashboard: SavedDashboard) => {
    // This would restore the dashboard state
    // For now, we'll just show a success message
    toast.success(`Loading dashboard "${dashboard.name}"`);
    console.log('Loading dashboard config:', dashboard.config);
  };

  const deleteDashboard = (id: string) => {
    const dashboard = savedDashboards.find(d => d.id === id);
    setSavedDashboards(prev => prev.filter(d => d.id !== id));
    toast.success(`Dashboard "${dashboard?.name}" deleted`);
  };

  const toggleFavorite = (id: string) => {
    setSavedDashboards(prev => 
      prev.map(dashboard => 
        dashboard.id === id 
          ? { ...dashboard, isFavorite: !dashboard.isFavorite }
          : dashboard
      )
    );
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="bg-slate-800/50 border-purple-500/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-purple-400">
            <FolderOpen className="h-5 w-5" />
            Dashboard Manager
          </CardTitle>
          <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-500 to-cyan-500">
                <Save className="h-4 w-4 mr-2" />
                Save Current
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-purple-500/20">
              <DialogHeader>
                <DialogTitle>Save Dashboard</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Dashboard Name</label>
                  <Input
                    value={saveName}
                    onChange={(e) => setSaveName(e.target.value)}
                    placeholder="Enter dashboard name..."
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Description (Optional)</label>
                  <Input
                    value={saveDescription}
                    onChange={(e) => setSaveDescription(e.target.value)}
                    placeholder="Enter description..."
                    className="mt-1"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={saveDashboard}>
                    Save Dashboard
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {savedDashboards.length === 0 ? (
          <div className="text-center py-8">
            <FolderOpen className="h-12 w-12 mx-auto mb-4 text-slate-400" />
            <p className="text-slate-400 mb-2">No saved dashboards yet</p>
            <p className="text-sm text-slate-500">Save your current configuration to access it later</p>
          </div>
        ) : (
          <div className="space-y-3">
            {savedDashboards
              .sort((a, b) => {
                // Favorites first, then by timestamp
                if (a.isFavorite && !b.isFavorite) return -1;
                if (!a.isFavorite && b.isFavorite) return 1;
                return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
              })
              .map(dashboard => (
                <Card key={dashboard.id} className="bg-slate-700/30 border-slate-600/30">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{dashboard.name}</h4>
                          {dashboard.isFavorite && (
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          )}
                          <Badge variant="outline" className="text-xs">
                            {dashboard.config.selectedChart}
                          </Badge>
                        </div>
                        {dashboard.description && (
                          <p className="text-sm text-slate-400 mb-2">{dashboard.description}</p>
                        )}
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <Clock className="h-3 w-3" />
                          {formatDate(dashboard.timestamp)}
                        </div>
                      </div>
                      <div className="flex gap-1 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleFavorite(dashboard.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Star className={`h-4 w-4 ${dashboard.isFavorite ? 'text-yellow-500 fill-current' : 'text-slate-400'}`} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => loadDashboard(dashboard)}
                          className="h-8 w-8 p-0"
                        >
                          <FolderOpen className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteDashboard(dashboard.id)}
                          className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardManager;
