import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from 'zod';
import { 
  insertPatientSchema, 
  insertProcedureSchema,
  insertToothSchema,
  insertTreatmentPlanSchema,
  insertTreatmentPlanItemSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // Patients API
  app.get('/api/patients', async (req, res) => {
    const patients = await storage.getAllPatients();
    res.json(patients);
  });

  app.get('/api/patients/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const patient = await storage.getPatient(id);
    
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    
    res.json(patient);
  });

  app.post('/api/patients', async (req, res) => {
    try {
      const patientData = insertPatientSchema.parse(req.body);
      const patient = await storage.createPatient(patientData);
      res.status(201).json(patient);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid patient data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Procedures API
  app.get('/api/procedures', async (req, res) => {
    const procedures = await storage.getAllProcedures();
    res.json(procedures);
  });

  app.post('/api/procedures', async (req, res) => {
    try {
      const procedureData = insertProcedureSchema.parse(req.body);
      const procedure = await storage.createProcedure(procedureData);
      res.status(201).json(procedure);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid procedure data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Teeth API
  app.get('/api/patients/:patientId/teeth', async (req, res) => {
    const patientId = parseInt(req.params.patientId);
    const teeth = await storage.getTeethByPatient(patientId);
    res.json(teeth);
  });

  app.post('/api/teeth', async (req, res) => {
    try {
      const toothData = insertToothSchema.parse(req.body);
      const tooth = await storage.createTooth(toothData);
      res.status(201).json(tooth);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid tooth data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch('/api/teeth/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      const toothData = insertToothSchema.partial().parse(req.body);
      const tooth = await storage.updateTooth(id, toothData);
      
      if (!tooth) {
        return res.status(404).json({ message: "Tooth not found" });
      }
      
      res.json(tooth);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid tooth data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Treatment Plans API
  app.get('/api/patients/:patientId/treatment-plans', async (req, res) => {
    const patientId = parseInt(req.params.patientId);
    const treatmentPlans = await storage.getTreatmentPlansByPatient(patientId);
    res.json(treatmentPlans);
  });

  app.post('/api/treatment-plans', async (req, res) => {
    try {
      const planData = insertTreatmentPlanSchema.parse(req.body);
      const plan = await storage.createTreatmentPlan(planData);
      res.status(201).json(plan);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid treatment plan data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Treatment Plan Items API
  app.get('/api/treatment-plans/:planId/items', async (req, res) => {
    const planId = parseInt(req.params.planId);
    const items = await storage.getTreatmentPlanItems(planId);
    res.json(items);
  });

  app.post('/api/treatment-plan-items', async (req, res) => {
    try {
      const itemData = insertTreatmentPlanItemSchema.parse(req.body);
      const item = await storage.createTreatmentPlanItem(itemData);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid treatment plan item data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch('/api/treatment-plan-items/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      const itemData = insertTreatmentPlanItemSchema.partial().parse(req.body);
      const item = await storage.updateTreatmentPlanItem(id, itemData);
      
      if (!item) {
        return res.status(404).json({ message: "Treatment plan item not found" });
      }
      
      res.json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid treatment plan item data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
