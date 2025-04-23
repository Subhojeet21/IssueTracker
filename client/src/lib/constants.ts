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
  { 
    path: '/teams', 
    label: 'Teams', 
    icon: 'users' 
  },
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
