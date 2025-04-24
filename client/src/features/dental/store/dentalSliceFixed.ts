import { createSlice, PayloadAction, configureStore } from '@reduxjs/toolkit';
import { 
  Tooth, 
  ToothType, 
  ToothStatus, 
  Surface, 
  SurfaceStatus, 
  SurfaceMap,
  Procedure, 
  ProcedureCategory,
  TreatmentPlan, 
  TreatmentPlanItem, 
  TreatmentPlanStatus,
  TreatmentPlanPriority,
  Patient 
} from '@/types/dental';

// Mock data for patient
const patientData: Patient = {
  id: 103742,
  name: 'Sarah Johnson',
  age: 42,
  lastVisit: '03/15/2023',
  insuranceName: 'Delta Dental Premier',
  insuranceDetails: 'Annual Max: $1,500 • Used: $350',
  alerts: ['Penicillin Allergy'],
};

// Sample procedures
const procedures: Procedure[] = [
  {
    id: '1',
    code: 'D2391',
    description: 'Composite, 1 Surface',
    longDescription: 'Posterior composite',
    fee: 210,
    category: ProcedureCategory.RESTORATIVE,
    isFavorite: true,
  },
  {
    id: '2',
    code: 'D2740',
    description: 'Porcelain Crown',
    longDescription: 'Porcelain/ceramic substrate',
    fee: 1250,
    category: ProcedureCategory.RESTORATIVE,
    isFavorite: true,
  },
  {
    id: '3',
    code: 'D7140',
    description: 'Extraction, Erupted Tooth',
    longDescription: 'Simple extraction',
    fee: 185,
    category: ProcedureCategory.ORAL_SURGERY,
    isFavorite: true,
  },
  {
    id: '4',
    code: 'D4341',
    description: 'Periodontal Scaling',
    longDescription: 'Per quadrant',
    fee: 240,
    category: ProcedureCategory.PERIO,
    isFavorite: true,
  },
  {
    id: '5',
    code: 'D0220',
    description: 'X-Ray',
    longDescription: 'Intraoral - periapical first radiographic image',
    fee: 30,
    category: ProcedureCategory.DIAGNOSTIC,
    isFavorite: true,
  },
  {
    id: '6',
    code: 'D2160',
    description: 'Amalgam, 3 Surfaces',
    longDescription: 'Three surface amalgam restoration',
    fee: 240,
    category: ProcedureCategory.RESTORATIVE,
    isFavorite: false,
  }
];

// Initialize teeth with healthy status
const initialTeeth: Tooth[] = Array.from({ length: 32 }, (_, i) => ({
  number: i + 1,
  type: ToothType.Adult,
  status: ToothStatus.Normal,
  surfaces: {},
  notes: ''
}));

// Initial treatment plan
const initialTreatmentPlan: TreatmentPlan = {
  id: '1',
  patientId: patientData.id,
  name: 'Master Plan',
  createdDate: '2024-03-15',
  status: 'Active',
  totalFee: 2125,
  patientTotalPortion: 1075,
  insuranceTotalPortion: 1050,
  items: [
    {
      id: '1',
      priority: TreatmentPlanPriority.HIGH,
      toothNumbers: [3],
      surfaces: [Surface.Occlusal],
      procedure: procedures[1], // Porcelain Crown
      status: TreatmentPlanStatus.PLANNED,
      provider: 'Dr. Anderson'
    },
    {
      id: '2',
      priority: TreatmentPlanPriority.MEDIUM,
      toothNumbers: [20],
      surfaces: [Surface.Occlusal],
      procedure: procedures[0], // Composite
      status: TreatmentPlanStatus.COMPLETED,
      provider: 'Dr. Anderson'
    },
    {
      id: '3',
      priority: TreatmentPlanPriority.MEDIUM,
      toothNumbers: [6],
      surfaces: [Surface.Facial],
      procedure: procedures[0], // Composite
      status: TreatmentPlanStatus.ACCEPTED,
      provider: 'Dr. Anderson'
    },
    {
      id: '4',
      priority: TreatmentPlanPriority.LOW,
      toothNumbers: [14],
      surfaces: [Surface.Mesial, Surface.Occlusal, Surface.Distal],
      procedure: procedures[5], // Amalgam
      status: TreatmentPlanStatus.REJECTED,
      provider: 'Dr. Smith'
    },
    {
      id: '5',
      priority: TreatmentPlanPriority.LOW,
      toothNumbers: [],
      procedure: procedures[3], // Perio scaling
      status: TreatmentPlanStatus.PLANNED,
      provider: 'Dr. Anderson'
    }
  ]
};

// Set some initial teeth with conditions
const teethWithConditions = [...initialTeeth];

// Tooth 1 - Existing restoration
const tooth1 = {...teethWithConditions[0]};
tooth1.surfaces = {
  [Surface.Occlusal]: SurfaceStatus.Restoration
};
teethWithConditions[0] = tooth1;

// Tooth 3 - Caries
const tooth3 = {...teethWithConditions[2]};
tooth3.surfaces = {
  [Surface.Occlusal]: SurfaceStatus.Caries
};
teethWithConditions[2] = tooth3;

// Tooth 6 - Filling
const tooth6 = {...teethWithConditions[5]};
tooth6.surfaces = {
  [Surface.Occlusal]: SurfaceStatus.Filling
};
teethWithConditions[5] = tooth6;

// Tooth 20 - Sealant
const tooth20 = {...teethWithConditions[19]};
tooth20.surfaces = {
  [Surface.Occlusal]: SurfaceStatus.Sealant
};
teethWithConditions[19] = tooth20;

interface DentalState {
  teeth: Tooth[];
  selectedTeeth: number[];
  selectedSurface: Surface | null;
  procedures: Procedure[];
  selectedProcedure: Procedure | null;
  activeProcedureCategory: string;
  treatmentPlan: TreatmentPlan;
  activeTreatmentPlanTab: string;
  patient: Patient;
  patientViewMode: boolean;
}

const initialState: DentalState = {
  teeth: teethWithConditions,
  selectedTeeth: [],
  selectedSurface: null,
  procedures: procedures,
  selectedProcedure: null,
  activeProcedureCategory: 'Restorative',
  treatmentPlan: initialTreatmentPlan,
  activeTreatmentPlanTab: 'master',
  patient: patientData,
  patientViewMode: false,
};

const dentalSlice = createSlice({
  name: 'dental',
  initialState,
  reducers: {
    selectTooth: (state, action: PayloadAction<number>) => {
      const toothNumber = action.payload;
      
      // Always select just this tooth - simple, predictable behavior
      state.selectedTeeth = [toothNumber];
    },
    
    clearSelectedTeeth: (state) => {
      state.selectedTeeth = [];
    },
    
    selectSurface: (state, action: PayloadAction<Surface | null>) => {
      state.selectedSurface = action.payload;
    },
    
    setToothStatus: (state, action: PayloadAction<{toothNumber: number, surface: Surface, status: ToothStatus}>) => {
      const { toothNumber, surface, status } = action.payload;
      const toothIndex = toothNumber - 1;
      
      if (!state.teeth[toothIndex]) return;
      
      state.teeth[toothIndex].status = status;
    },
    
    setSurfaceStatus: (state, action: PayloadAction<{toothNumber: number, surface: Surface, status: SurfaceStatus}>) => {
      const { toothNumber, surface, status } = action.payload;
      const toothIndex = toothNumber - 1;
      
      if (!state.teeth[toothIndex]) return;
      
      state.teeth[toothIndex].surfaces = {
        ...state.teeth[toothIndex].surfaces,
        [surface]: status
      };
    },
    
    selectProcedure: (state, action: PayloadAction<Procedure | null>) => {
      state.selectedProcedure = action.payload;
    },
    
    setActiveProcedureCategory: (state, action: PayloadAction<string>) => {
      state.activeProcedureCategory = action.payload;
    },
    
    toggleProcedureFavorite: (state, action: PayloadAction<string>) => {
      const procedureId = action.payload;
      const procedure = state.procedures.find(p => p.id === procedureId);
      
      if (procedure) {
        procedure.isFavorite = !procedure.isFavorite;
      }
    },
    
    addTreatmentPlanItem: (state, action: PayloadAction<{
      toothNumbers: number[];
      surfaces?: Surface[];
      procedure: Procedure;
      provider: string;
    }>) => {
      const { toothNumbers, surfaces, procedure, provider } = action.payload;
      
      // Calculate the insurance coverage (example logic)
      const insuranceCoverage = 0.8; // 80% coverage
      const insuranceAmount = procedure.fee * insuranceCoverage;
      const patientAmount = procedure.fee - insuranceAmount;
      
      const newItem: TreatmentPlanItem = {
        id: `${Date.now()}-${toothNumbers.join('-')}`,
        priority: TreatmentPlanPriority.MEDIUM,
        toothNumbers,
        surfaces,
        procedure,
        status: TreatmentPlanStatus.PLANNED,
        provider,
        patientPortion: patientAmount,
        insurancePortion: insuranceAmount
      };
      
      state.treatmentPlan.items.push(newItem);
      
      // Update surfaces for each tooth
      if (surfaces) {
        toothNumbers.forEach(toothNumber => {
          const toothIndex = toothNumber - 1;
          if (state.teeth[toothIndex]) {
            surfaces.forEach(surface => {
              state.teeth[toothIndex].surfaces = {
                ...state.teeth[toothIndex].surfaces,
                [surface]: SurfaceStatus.Restoration
              };
            });
          }
        });
      }
      
      // Clear selected teeth after adding to treatment plan
      state.selectedTeeth = [];
      state.selectedSurface = null;
    },
    
    updateTreatmentPlanItemStatus: (state, action: PayloadAction<{itemId: string, newStatus: TreatmentPlanStatus}>) => {
      const { itemId, newStatus } = action.payload;
      const item = state.treatmentPlan.items.find(item => item.id === itemId);
      
      if (item) {
        item.status = newStatus;
        
        // If marked as completed, update the tooth status as well
        if (newStatus === TreatmentPlanStatus.COMPLETED && item.surfaces) {
          item.toothNumbers.forEach(toothNumber => {
            const toothIndex = toothNumber - 1;
            
            if (state.teeth[toothIndex] && item.surfaces) {
              item.surfaces.forEach(surface => {
                if (surface && state.teeth[toothIndex]) {
                  // Set surface status to restoration when completed
                  state.teeth[toothIndex].surfaces = {
                    ...state.teeth[toothIndex].surfaces,
                    [surface]: SurfaceStatus.Restoration
                  };
                }
              });
            }
          });
        }
      }
    },
    
    setActiveTreatmentPlanTab: (state, action: PayloadAction<string>) => {
      state.activeTreatmentPlanTab = action.payload;
    },
    
    togglePatientViewMode: (state) => {
      state.patientViewMode = !state.patientViewMode;
    }
  }
});

export const {
  selectTooth,
  clearSelectedTeeth,
  selectSurface,
  setToothStatus,
  setSurfaceStatus,
  selectProcedure,
  setActiveProcedureCategory,
  toggleProcedureFavorite,
  addTreatmentPlanItem,
  updateTreatmentPlanItemStatus,
  setActiveTreatmentPlanTab,
  togglePatientViewMode
} = dentalSlice.actions;

export const store = configureStore({
  reducer: {
    dental: dentalSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;