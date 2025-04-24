import { createSlice, PayloadAction, configureStore } from '@reduxjs/toolkit';
import { Tooth, ToothStatus, Surface, SurfaceStatus, Procedure, TreatmentPlan, TreatmentPlanItem, Patient, TreatmentPlanStatus } from '@/types/dental';

// Mock data for patient
const patientData: Patient = {
  id: '103742',
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
    category: 'Rest / Prosth',
    isFavorite: true,
  },
  {
    id: '2',
    code: 'D2740',
    description: 'Porcelain Crown',
    longDescription: 'Porcelain/ceramic substrate',
    fee: 1250,
    category: 'Rest / Prosth',
    isFavorite: true,
  },
  {
    id: '3',
    code: 'D7140',
    description: 'Extraction, Erupted Tooth',
    longDescription: 'Simple extraction',
    fee: 185,
    category: 'Surgery',
    isFavorite: true,
  },
  {
    id: '4',
    code: 'D4341',
    description: 'Periodontal Scaling',
    longDescription: 'Per quadrant',
    fee: 240,
    category: 'Perio',
    isFavorite: true,
  },
  {
    id: '5',
    code: 'D0220',
    description: 'X-Ray',
    longDescription: 'Intraoral - periapical first radiographic image',
    fee: 30,
    category: 'Diag / Img',
    isFavorite: true,
  },
  {
    id: '6',
    code: 'D2160',
    description: 'Amalgam, 3 Surfaces',
    longDescription: 'Three surface amalgam restoration',
    fee: 240,
    category: 'Rest / Prosth',
    isFavorite: false,
  }
];

// Initialize teeth with healthy status
const initialTeeth: Tooth[] = Array.from({ length: 32 }, (_, i) => ({
  number: i + 1,
  surfaces: []
}));

// Initial treatment plan
const initialTreatmentPlan: TreatmentPlan = {
  id: '1',
  planType: 'master',
  items: [
    {
      id: '1',
      priority: 1,
      toothNumber: 3,
      surfaces: [Surface.Occlusal],
      procedure: procedures[1], // Porcelain Crown
      status: TreatmentPlanStatus.Pending,
      fee: 1250,
      insuranceAmount: 750,
      patientAmount: 500,
      provider: 'Dr. Anderson'
    },
    {
      id: '2',
      priority: 2,
      toothNumber: 20,
      surfaces: [Surface.Occlusal],
      procedure: procedures[0], // Composite
      status: TreatmentPlanStatus.Completed,
      fee: 210,
      insuranceAmount: 168,
      patientAmount: 42,
      provider: 'Dr. Anderson'
    },
    {
      id: '3',
      priority: 3,
      toothNumber: 6,
      surfaces: [Surface.Buccal],
      procedure: procedures[0], // Composite
      status: TreatmentPlanStatus.Approved,
      fee: 185,
      insuranceAmount: 132,
      patientAmount: 53,
      provider: 'Dr. Anderson'
    },
    {
      id: '4',
      priority: 4,
      toothNumber: 14,
      surfaces: [Surface.Mesial, Surface.Occlusal, Surface.Distal],
      procedure: procedures[5], // Amalgam
      status: TreatmentPlanStatus.Denied,
      fee: 240,
      insuranceAmount: 0,
      patientAmount: 240,
      provider: 'Dr. Smith'
    },
    {
      id: '5',
      priority: 5,
      toothNumber: 0, // No specific tooth (quadrant)
      surfaces: [],
      procedure: procedures[3], // Perio scaling
      status: TreatmentPlanStatus.Planned,
      fee: 240,
      insuranceAmount: 0,
      patientAmount: 240,
      provider: 'Dr. Anderson'
    }
  ]
};

// Set some initial teeth with conditions
const teethWithConditions = [...initialTeeth];
// Tooth 1 - Existing restoration
teethWithConditions[0] = {
  ...teethWithConditions[0],
  surfaces: [{
    surface: Surface.Occlusal,
    status: ToothStatus.ExistingRestoration
  }]
};
// Tooth 3 - Caries
teethWithConditions[2] = {
  ...teethWithConditions[2],
  surfaces: [{
    surface: Surface.Occlusal,
    status: ToothStatus.Caries
  }]
};
// Tooth 6 - Planned
teethWithConditions[5] = {
  ...teethWithConditions[5],
  surfaces: [{
    surface: Surface.Occlusal,
    status: ToothStatus.Planned
  }]
};
// Tooth 20 - Completed
teethWithConditions[19] = {
  ...teethWithConditions[19],
  surfaces: [{
    surface: Surface.Occlusal,
    status: ToothStatus.Completed
  }]
};

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
  activeProcedureCategory: 'Rest / Prosth',
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
      
      // Check if the surface already exists for this tooth
      const surfaceIndex = state.teeth[toothIndex].surfaces.findIndex(
        s => s.surface === surface
      );
      
      if (surfaceIndex >= 0) {
        // Update existing surface
        state.teeth[toothIndex].surfaces[surfaceIndex].status = status;
      } else {
        // Add new surface status
        state.teeth[toothIndex].surfaces.push({
          surface,
          status
        });
      }
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
      surfaces: Surface[];
      procedure: Procedure;
      provider: string;
    }>) => {
      const { toothNumbers, surfaces, procedure, provider } = action.payload;
      
      // Calculate the insurance coverage (example logic)
      const insuranceCoverage = 0.8; // 80% coverage
      const insuranceAmount = procedure.fee * insuranceCoverage;
      const patientAmount = procedure.fee - insuranceAmount;
      
      // For each selected tooth, add a treatment plan item
      toothNumbers.forEach(toothNumber => {
        const newItem: TreatmentPlanItem = {
          id: `${Date.now()}-${toothNumber}`,
          priority: state.treatmentPlan.items.length + 1,
          toothNumber,
          surfaces,
          procedure,
          status: TreatmentPlanStatus.Planned,
          fee: procedure.fee,
          insuranceAmount,
          patientAmount,
          provider
        };
        
        state.treatmentPlan.items.push(newItem);
        
        // Also update the tooth status to planned
        surfaces.forEach(surface => {
          const toothIndex = toothNumber - 1;
          if (state.teeth[toothIndex]) {
            const surfaceIndex = state.teeth[toothIndex].surfaces.findIndex(
              s => s.surface === surface
            );
            
            if (surfaceIndex >= 0) {
              state.teeth[toothIndex].surfaces[surfaceIndex].status = ToothStatus.Planned;
            } else {
              state.teeth[toothIndex].surfaces.push({
                surface,
                status: ToothStatus.Planned
              });
            }
          }
        });
      });
      
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
        if (newStatus === TreatmentPlanStatus.Completed) {
          const toothIndex = item.toothNumber - 1;
          
          if (state.teeth[toothIndex]) {
            item.surfaces.forEach(surface => {
              const surfaceIndex = state.teeth[toothIndex].surfaces.findIndex(
                s => s.surface === surface
              );
              
              if (surfaceIndex >= 0) {
                state.teeth[toothIndex].surfaces[surfaceIndex].status = ToothStatus.Completed;
              } else {
                state.teeth[toothIndex].surfaces.push({
                  surface,
                  status: ToothStatus.Completed
                });
              }
            });
          }
        }
      }
    },
    
    reorderTreatmentPlanItems: (state, action: PayloadAction<{itemId: string, newPriority: number}>) => {
      const { itemId, newPriority } = action.payload;
      const items = state.treatmentPlan.items;
      const itemIndex = items.findIndex(item => item.id === itemId);
      
      if (itemIndex === -1 || newPriority < 1 || newPriority > items.length) {
        return;
      }
      
      const item = items[itemIndex];
      const oldPriority = item.priority;
      
      // Update priorities for all affected items
      if (newPriority < oldPriority) {
        // Moving up in priority
        for (let i = 0; i < items.length; i++) {
          if (items[i].priority >= newPriority && items[i].priority < oldPriority) {
            items[i].priority++;
          }
        }
      } else if (newPriority > oldPriority) {
        // Moving down in priority
        for (let i = 0; i < items.length; i++) {
          if (items[i].priority <= newPriority && items[i].priority > oldPriority) {
            items[i].priority--;
          }
        }
      }
      
      // Set the new priority for the moved item
      item.priority = newPriority;
      
      // Sort items by priority
      state.treatmentPlan.items.sort((a, b) => a.priority - b.priority);
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
  selectProcedure,
  setActiveProcedureCategory,
  toggleProcedureFavorite,
  addTreatmentPlanItem,
  updateTreatmentPlanItemStatus,
  reorderTreatmentPlanItems,
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
