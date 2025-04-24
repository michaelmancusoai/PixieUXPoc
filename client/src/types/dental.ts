// Enums
export enum ToothType {
  Adult = 'Adult',
  Child = 'Child',
}

export enum ToothStatus {
  Normal = 'Normal',
  Missing = 'Missing',
  PreviousExtraction = 'PreviousExtraction',
  Implant = 'Implant',
  PreviousRoot = 'PreviousRoot',
  PonticBridge = 'PonticBridge',
  Crown = 'Crown',
}

export enum Surface {
  Facial = 'Facial',
  Lingual = 'Lingual',
  Mesial = 'Mesial',
  Distal = 'Distal',
  Occlusal = 'Occlusal',
  Incisal = 'Incisal',
  Complete = 'Complete',
}

export enum SurfaceStatus {
  Normal = 'Normal',
  Caries = 'Caries',
  Filling = 'Filling',
  Sealant = 'Sealant',
  Restoration = 'Restoration',
}

export enum ProcedureCategory {
  DIAGNOSTIC = 'Diagnostic',
  PREVENTIVE = 'Preventive',
  RESTORATIVE = 'Restorative',
  ENDO = 'Endodontics',
  PERIO = 'Periodontics',
  PROS = 'Prosthodontics',
  IMPL = 'Implants',
  ORAL_SURGERY = 'Oral Surgery',
  ORTHO = 'Orthodontics',
}

export enum TreatmentPlanStatus {
  PLANNED = 'Planned',
  REFERRED = 'Referred',
  COMPLETED = 'Completed',
  ACCEPTED = 'Accepted',
  REJECTED = 'Rejected',
}

export enum TreatmentPlanPriority {
  URGENT = 'Urgent',
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low',
}

export enum BleedingIndex {
  NONE = 0,
  SLIGHT = 1,
  MODERATE = 2,
  SEVERE = 3,
}

export type SurfaceMap = {
  [key in Surface]?: SurfaceStatus;
};

// Basic Types
export interface ToothSurface {
  surface: Surface;
  status: SurfaceStatus;
}

export interface MedicalQuestion {
  id: string;
  question: string;
  answer: string;
  category: string;
  followUp?: MedicalQuestion[];
}

export interface MedicalHistory {
  patientId: number;
  date: string;
  questions: MedicalQuestion[];
  physicianName: string;
  physicianPhone: string;
  lastVisit: string;
  conditions: string[];
  medications: string[];
  allergies: string[];
}

export interface Tooth {
  number: number;
  type: ToothType;
  status: ToothStatus;
  surfaces: SurfaceMap;
  notes: string;
  mobility?: number;
  furcation?: number;
  recession?: number;
}

export interface PerioMeasurements {
  toothNumber: number;
  facial: {
    pocketDepth?: number[];
    attachment?: number[];
    bleeding?: BleedingIndex[];
    plaque?: boolean[];
    suppuration?: boolean[];
  };
  lingual: {
    pocketDepth?: number[];
    attachment?: number[];
    bleeding?: BleedingIndex[];
    plaque?: boolean[];
    suppuration?: boolean[];
  };
}

export interface Procedure {
  id: string;
  code: string;
  description: string;
  longDescription?: string;
  fee: number;
  category: ProcedureCategory;
  subcategory?: string;
  surfaces?: Surface[];
  isFavorite: boolean;
  defaultToothType?: ToothType;
  requiredToothStatus?: ToothStatus[];
  requiresPretreatment?: boolean;
  isAbutment?: boolean;
  notes?: string;
}

export interface TreatmentPlanItem {
  id: string;
  toothNumbers: number[];
  surfaces?: Surface[];
  procedure: Procedure;
  status: TreatmentPlanStatus;
  notes?: string;
  provider?: string;
  priority: TreatmentPlanPriority;
  plannedDate?: string;
  completedDate?: string;
  patientPortion?: number;
  insurancePortion?: number;
}

export interface TreatmentPlan {
  id: string;
  patientId: number;
  name: string;
  createdDate: string;
  presentedDate?: string;
  items: TreatmentPlanItem[];
  status: 'Active' | 'Completed' | 'Archived';
  notes?: string;
  totalFee: number;
  patientTotalPortion: number;
  insuranceTotalPortion: number;
}

export interface PatientImage {
  id: string;
  patientId: number;
  imageUrl: string;
  imageType: 'Xray' | 'Photo' | 'Document';
  dateTaken: string;
  description?: string;
  notes?: string;
  toothNumbers?: number[];
}

export interface Patient {
  id: number;
  name: string;
  age: number;
  dateOfBirth?: string;
  gender?: string;
  phone?: string;
  email?: string;
  address?: string;
  insuranceName: string;
  insuranceDetails: string;
  lastVisit: string;
  chartNumber?: string;
  alerts: string[];
  medicalHistory?: MedicalHistory;
  perioMeasurements?: PerioMeasurements[];
  treatmentPlans?: TreatmentPlan[];
  images?: PatientImage[];
  balance?: number;
  nextAppointment?: string;
}