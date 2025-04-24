export enum ToothStatus {
  Healthy = 'healthy',
  Caries = 'caries',
  ExistingRestoration = 'existing',
  Planned = 'planned',
  Completed = 'completed',
}

export enum Surface {
  Occlusal = 'O',
  Mesial = 'M',
  Distal = 'D',
  Buccal = 'B',
  Lingual = 'L',
}

export interface SurfaceStatus {
  surface: Surface;
  status: ToothStatus;
}

export interface Tooth {
  number: number;
  surfaces: SurfaceStatus[];
}

export interface Procedure {
  id: string;
  code: string;
  description: string;
  longDescription?: string;
  fee: number;
  category: string;
  isFavorite?: boolean;
}

export enum ProcedureCategory {
  DiagImg = 'Diag / Img',
  Prev = 'Prev',
  RestProsth = 'Rest / Prosth',
  Endo = 'Endo',
  Perio = 'Perio',
  Implants = 'Implants',
  Surgery = 'Surgery',
  Ortho = 'Ortho',
  Adjunct = 'Adjunct',
  Sleep = 'Sleep',
}

export enum TreatmentPlanStatus {
  Planned = 'planned',
  Approved = 'approved',
  Pending = 'pending',
  Denied = 'denied',
  Completed = 'completed',
}

export interface TreatmentPlan {
  id: string;
  planType: 'master' | 'alternate' | 'archived';
  items: TreatmentPlanItem[];
}

export interface TreatmentPlanItem {
  id: string;
  priority: number;
  toothNumber: number;
  surfaces: Surface[];
  procedure: Procedure;
  status: TreatmentPlanStatus;
  fee: number;
  insuranceAmount: number;
  patientAmount: number;
  provider: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  lastVisit: string;
  insuranceName: string;
  insuranceDetails: string;
  alerts: string[];
}
