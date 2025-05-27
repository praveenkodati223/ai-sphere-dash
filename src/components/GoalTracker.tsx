
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Target, Plus, Trash2, AlertTriangle, CheckCircle, Bell } from 'lucide-react';
import { useVisualization } from '@/contexts/VisualizationContext';

interface Goal {
  id: string;
  name: string;
  column: string;
  operator: 'greater_than' | 'less_than' | 'equals';
  value: number;
  type: 'warning' | 'success';
  triggered: boolean;
  lastChecked?: Date;
}

interface GoalAlert {
  goalId: string;
  goalName: string;
  message: string;
  type: 'warning' | 'success';
  timestamp: Date;
}

const GoalTracker = () => {
  const { activeDataset } = useVisualization();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [alerts, setAlerts] = useState<GoalAlert[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: '',
    column: '',
    operator: 'less_than' as const,
    value: 0,
    type: 'warning' as const
  });
  
  // Get available numeric columns
  const numericColumns = React.useMemo(() => {
    if (!activeDataset?.data?.length) return [];
    
    const firstRow = activeDataset.data[0];
    return Object.keys(firstRow).filter(key => 
      typeof firstRow[key] === 'number' ||
      activeDataset.data.some(row => typeof row[key] === 'number')
    );
  }, [activeDataset]);
  
  // Check goals against current data
  useEffect(() => {
    if (!activeDataset?.data?.length || goals.length === 0) return;
    
    const newAlerts: GoalAlert[] = [];
    const updatedGoals = goals.map(goal => {
      const columnData = activeDataset.data
        .map(row => Number(row[goal.column]))
        .filter(val => !isNaN(val));
      
      if (columnData.length === 0) return goal;
      
      const latestValue = columnData[columnData.length - 1]; // Assuming last value is most recent
      const average = columnData.reduce((a, b) => a + b, 0) / columnData.length;
      const checkValue = goal.operator === 'equals' ? latestValue : average;
      
      let triggered = false;
      switch (goal.operator) {
        case 'greater_than':
          triggered = checkValue > goal.value;
          break;
        case 'less_than':
          triggered = checkValue < goal.value;
          break;
        case 'equals':
          triggered = Math.abs(checkValue - goal.value) < 0.01; // Allow small floating point differences
          break;
      }
      
      // Generate alert if goal status changed
      if (triggered !== goal.triggered) {
        const operatorText = {
          greater_than: 'exceeded',
          less_than: 'dropped below',
          equals: 'reached'
        };
        
        newAlerts.push({
          goalId: goal.id,
          goalName: goal.name,
          message: `${goal.column} ${operatorText[goal.operator]} ${goal.value} (current: ${checkValue.toFixed(2)})`,
          type: goal.type,
          timestamp: new Date()
        });
      }
      
      return {
        ...goal,
        triggered,
        lastChecked: new Date()
      };
    });
    
    setGoals(updatedGoals);
    if (newAlerts.length > 0) {
      setAlerts(prev => [...newAlerts, ...prev].slice(0, 10)); // Keep last 10 alerts
    }
  }, [activeDataset, goals]);
  
  const addGoal = () => {
    if (!newGoal.name || !newGoal.column) return;
    
    const goal: Goal = {
      id: Date.now().toString(),
      ...newGoal,
      triggered: false
    };
    
    setGoals(prev => [...prev, goal]);
    setNewGoal({
      name: '',
      column: '',
      operator: 'less_than',
      value: 0,
      type: 'warning'
    });
    setShowAddForm(false);
  };
  
  const removeGoal = (goalId: string) => {
    setGoals(prev => prev.filter(goal => goal.id !== goalId));
    setAlerts(prev => prev.filter(alert => alert.goalId !== goalId));
  };
  
  const clearAlerts = () => {
    setAlerts([]);
  };
  
  if (!activeDataset) {
    return (
      <Card className="bg-slate-800/50 border-orange-500/20">
        <CardContent className="p-6 text-center">
          <Target className="h-12 w-12 mx-auto mb-4 text-slate-400" />
          <p className="text-slate-400">Import a dataset to set up goal tracking</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-4">
      {/* Alerts */}
      {alerts.length > 0 && (
        <Card className="bg-red-500/10 border-red-500/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-red-400">
                <Bell className="h-5 w-5" />
                Goal Alerts ({alerts.length})
              </CardTitle>
              <Button variant="outline" size="sm" onClick={clearAlerts}>
                Clear All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 max-h-32 overflow-y-auto">
            {alerts.map((alert, index) => (
              <Alert key={index} className="border-l-4 border-l-red-500">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <span className="font-medium">{alert.goalName}:</span> {alert.message}
                  <span className="text-xs text-slate-400 ml-2">
                    {alert.timestamp.toLocaleTimeString()}
                  </span>
                </AlertDescription>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}
      
      {/* Goals Management */}
      <Card className="bg-slate-800/50 border-orange-500/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-orange-400">
              <Target className="h-5 w-5" />
              Goal Tracker ({goals.length})
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddForm(!showAddForm)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Goal
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add Goal Form */}
          {showAddForm && (
            <Card className="bg-slate-700/30 border-slate-600">
              <CardContent className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="Goal name"
                    value={newGoal.name}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, name: e.target.value }))}
                  />
                  <Select
                    value={newGoal.column}
                    onValueChange={(value) => setNewGoal(prev => ({ ...prev, column: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select column" />
                    </SelectTrigger>
                    <SelectContent>
                      {numericColumns.map(column => (
                        <SelectItem key={column} value={column}>{column}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <Select
                    value={newGoal.operator}
                    onValueChange={(value: any) => setNewGoal(prev => ({ ...prev, operator: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="greater_than">Greater than</SelectItem>
                      <SelectItem value="less_than">Less than</SelectItem>
                      <SelectItem value="equals">Equals</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    placeholder="Value"
                    value={newGoal.value}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, value: Number(e.target.value) }))}
                  />
                  <Select
                    value={newGoal.type}
                    onValueChange={(value: any) => setNewGoal(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="success">Success</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button onClick={addGoal} disabled={!newGoal.name || !newGoal.column}>
                    Add Goal
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Goals List */}
          <div className="space-y-2">
            {goals.map(goal => (
              <div key={goal.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                <div className="flex items-center gap-3">
                  {goal.triggered ? (
                    goal.type === 'warning' ? 
                      <AlertTriangle className="h-5 w-5 text-red-400" /> :
                      <CheckCircle className="h-5 w-5 text-green-400" />
                  ) : (
                    <Target className="h-5 w-5 text-slate-400" />
                  )}
                  <div>
                    <h4 className="font-medium">{goal.name}</h4>
                    <p className="text-sm text-slate-400">
                      {goal.column} {goal.operator.replace('_', ' ')} {goal.value}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={goal.triggered ? (goal.type === 'warning' ? 'destructive' : 'default') : 'secondary'}
                  >
                    {goal.triggered ? 'Triggered' : 'Monitoring'}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeGoal(goal.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            
            {goals.length === 0 && !showAddForm && (
              <div className="text-center py-8">
                <Target className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                <p className="text-slate-400">No goals set up yet</p>
                <p className="text-xs text-slate-500 mt-2">Click "Add Goal" to start tracking your data metrics</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoalTracker;
