export type UserRole = 
  | 'frontOffice' 
  | 'hygienist' 
  | 'provider' 
  | 'billing' 
  | 'owner';

export type RoleConfig = {
  title: string;
  description: string;
  accentColor: string;
  icon: string;
};

export const ROLE_CONFIGS: Record<UserRole, RoleConfig> = {
  frontOffice: {
    title: 'Front Office Coordinator',
    description: 'Patient check-in, scheduling, and front desk operations',
    accentColor: 'blue',
    icon: 'UserCheck',
  },
  hygienist: {
    title: 'Hygienist',
    description: 'Cleanings, preventive care, and patient education',
    accentColor: 'teal',
    icon: 'Activity',
  },
  provider: {
    title: 'Provider / Dentist',
    description: 'Treatment delivery and clinical care',
    accentColor: 'indigo',
    icon: 'Stethoscope',
  },
  billing: {
    title: 'Billing Specialist',
    description: 'Claims processing, accounts receivable, and collections',
    accentColor: 'amber',
    icon: 'Receipt',
  },
  owner: {
    title: 'Practice Owner / Manager',
    description: 'Business performance, staff management, and strategy',
    accentColor: 'green',
    icon: 'Building',
  }
};

export interface KPI {
  label: string;
  value: string | number;
  target?: string | number;
  delta?: number;
  unit?: string;
  status?: 'success' | 'warning' | 'danger' | 'neutral';
  isPercentage?: boolean;
  trend?: 'up' | 'down' | 'neutral';
}

export interface ActionItem {
  id: string;
  priority: number;
  title: string;
  description?: string;
  type: 'call' | 'reminder' | 'form' | 'approval' | 'collection' | 'clinical' | 'document' | 'other';
  dueIn?: string;
  amount?: number;
  patientId?: number;
  patientName?: string;
  completed?: boolean;
  icon?: string;
}

export interface FlowCategory {
  id: string;
  label: string;
  count: number;
  isBottleneck?: boolean;
}

export interface WinItem {
  id: string;
  title: string;
  description?: string;
  timestamp: string;
  value?: number;
  savings?: number;
  icon?: string;
}

export interface DashboardData {
  greeting: string;
  greetingDetails: string;
  kpis: KPI[];
  actionItems: ActionItem[];
  flowCategories: FlowCategory[];
  wins: WinItem[];
}