import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { STATUS_VALUES, PRIORITY_VALUES, CATEGORY_VALUES, TEAM_VALUES, ENVIRONMENT_VALUES } from "@shared/schema";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return '';
  
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export function formatDateTime(date: Date | string | null | undefined): string {
  if (!date) return '';
  
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'open':
      return 'bg-red-100 text-red-800';
    case 'in_progress':
      return 'bg-yellow-100 text-yellow-800';
    case 'resolved':
      return 'bg-green-100 text-green-800';
    case 'closed':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-800';
    case 'medium':
      return 'bg-orange-100 text-orange-800';
    case 'low':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function getCategoryIcon(category: string): string {
  switch (category) {
    case 'bug':
      return 'bug';
    case 'feature':
      return 'star';
    case 'documentation':
      return 'file-text';
    case 'security':
      return 'shield';
    case 'performance':
      return 'activity';
    default:
      return 'tag';
  }
}

export function getInitials(name: string): string {
  if (!name) return '';
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

export function getStatusOptions() {
  return STATUS_VALUES.map(status => ({
    label: status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' '),
    value: status
  }));
}

export function getPriorityOptions() {
  return PRIORITY_VALUES.map(priority => ({
    label: priority.charAt(0).toUpperCase() + priority.slice(1),
    value: priority
  }));
}

export function getCategoryOptions() {
  return CATEGORY_VALUES.map(category => ({
    label: category.charAt(0).toUpperCase() + category.slice(1),
    value: category
  }));
}

export function getTeamOptions() {
  return TEAM_VALUES.map(team => ({
    label: team.charAt(0).toUpperCase() + team.slice(1),
    value: team
  }));
}

export function getEnvironmentOptions() {
  return ENVIRONMENT_VALUES.map(environment => ({
    label: environment.toUpperCase() + environment.slice(1),
    value: environment
  }));
}

export function generateIssueId(id: number): string {
  return `IS-${id}`;
}
