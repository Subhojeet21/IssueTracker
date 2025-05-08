export const STATUS_LABELS = {
  open: 'Open',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  closed: 'Closed',
};

export const PRIORITY_LABELS = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

export const CATEGORY_LABELS = {
  bug: 'Bug',
  feature: 'Feature',
  documentation: 'Documentation',
  security: 'Security',
  performance: 'Performance',
  environmentError: 'Environment Error',
  missingAccess: 'Missing Access',
  invalidTestData: 'Invalid Test Data',
  notADefect: 'Not a Defect',
  observation: 'Observation',
  duplicate: 'Duplicate',
  outOfTeamScope: 'Out of Team Scope',
};

export const CATEGORY_COLORS = {
  bug: 'bg-red-100 text-red-800',
  feature: 'bg-blue-100 text-blue-800',
  security: 'bg-green-100 text-green-800',
  performance: 'bg-yellow-100 text-yellow-800',
  documentation: 'bg-purple-100 text-purple-800',
  environmentError: 'bg-pink-100 text-pink-800',
  duplicate: 'bg-gray-100 text-gray-800',
  missingAccess: 'bg-orange-100 text-orange-800',
  notADefect: 'bg-cyan-100 text-cyan-800',
  invalidTestData: 'bg-indigo-100 text-indigo-800',
  observation: 'bg-teal-100 text-teal-800',
  outOfTeamScope: 'bg-red-100 text-red-800',
};



export const TEAM_LABELS = {
  compass: 'Compass',
  meta: 'Meta',
  everest: 'Everest'
};

export const ENVIRONMENT_LABELS = {
  dev: 'DEV',
  int: 'INT',
  stg: 'STG',
  prod: 'PROD'
};

export const NAV_ITEMS = [
  { 
    path: '/', 
    label: 'Dashboard', 
    icon: 'tachometer-alt' 
  },
  { 
    path: '/issues', 
    label: 'Issues', 
    icon: 'list-ul' 
  },
  { 
    path: '/analytics', 
    label: 'Analytics', 
    icon: 'chart-bar' 
  },
  /*{ 
    path: '/teams', 
    label: 'Teams', 
    icon: 'users' 
  },*/
  { 
    path: '/settings', 
    label: 'Settings', 
    icon: 'cog' 
  },
];

export const FILTER_TYPES = {
  STATUS: 'status',
  PRIORITY: 'priority',
  CATEGORY: 'category',
  ASSIGNEE: 'assignee',
  DATE_RANGE: 'dateRange',
};
