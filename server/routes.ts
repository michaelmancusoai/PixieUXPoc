import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPatientSchema, insertLocationSchema, insertUserSchema } from "@shared/schema";
import { z } from "zod";
import { setupAuth, isAuthenticated, isAdmin, hasRole } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes and middleware
  setupAuth(app);
  
  // API prefix
  const apiPrefix = "/api";

  // User management API
  app.get(`${apiPrefix}/users`, isAdmin, async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      const users = await storage.listUsers(limit, offset);
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.get(`${apiPrefix}/users/search`, isAdmin, async (req: Request, res: Response) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ error: "Search query is required" });
      }
      const users = await storage.searchUsers(query);
      res.json(users);
    } catch (error) {
      console.error("Error searching users:", error);
      res.status(500).json({ error: "Failed to search users" });
    }
  });

  app.get(`${apiPrefix}/users/:id`, isAdmin, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      console.error(`Error fetching user ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  app.post(`${apiPrefix}/users`, isAdmin, async (req: Request, res: Response) => {
    try {
      // Add admin user or team member
      const userData = insertUserSchema.parse(req.body);
      
      // Check if email already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ error: "Email already in use" });
      }
      
      // Check if username already exists
      const existingUsername = await storage.getUserByUsername(userData.username);
      if (existingUsername) {
        return res.status(400).json({ error: "Username already in use" });
      }
      
      const newUser = await storage.createUser(userData);
      res.status(201).json(newUser);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating user:", error);
      res.status(500).json({ error: "Failed to create user" });
    }
  });

  app.patch(`${apiPrefix}/users/:id`, isAdmin, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const userData = insertUserSchema.partial().parse(req.body);
      
      const updatedUser = await storage.updateUser(id, userData);
      
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
      
      res.json(updatedUser);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error(`Error updating user ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to update user" });
    }
  });

  app.patch(`${apiPrefix}/users/:id/account-stage`, isAdmin, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { stage } = req.body;
      
      if (!stage) {
        return res.status(400).json({ error: "Account stage is required" });
      }
      
      const updatedUser = await storage.changeUserAccountStage(id, stage);
      
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
      
      res.json(updatedUser);
    } catch (error) {
      console.error(`Error updating user account stage ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to update user account stage" });
    }
  });

  // Location management API
  app.get(`${apiPrefix}/locations`, isAuthenticated, async (req: Request, res: Response) => {
    try {
      const locations = await storage.listLocations();
      res.json(locations);
    } catch (error) {
      console.error("Error fetching locations:", error);
      res.status(500).json({ error: "Failed to fetch locations" });
    }
  });

  app.post(`${apiPrefix}/locations`, isAdmin, async (req: Request, res: Response) => {
    try {
      const locationData = insertLocationSchema.parse(req.body);
      const newLocation = await storage.createLocation(locationData);
      res.status(201).json(newLocation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating location:", error);
      res.status(500).json({ error: "Failed to create location" });
    }
  });

  app.patch(`${apiPrefix}/locations/:id`, isAdmin, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const locationData = insertLocationSchema.partial().parse(req.body);
      
      const updatedLocation = await storage.updateLocation(id, locationData);
      
      if (!updatedLocation) {
        return res.status(404).json({ error: "Location not found" });
      }
      
      res.json(updatedLocation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error(`Error updating location ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to update location" });
    }
  });

  app.post(`${apiPrefix}/users/:userId/locations/:locationId`, isAdmin, async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const locationId = parseInt(req.params.locationId);
      const { isPrimary } = req.body;
      
      const result = await storage.assignUserToLocation(userId, locationId, isPrimary);
      
      if (!result) {
        return res.status(400).json({ error: "Failed to assign user to location" });
      }
      
      res.status(200).json({ success: true });
    } catch (error) {
      console.error(`Error assigning user ${req.params.userId} to location ${req.params.locationId}:`, error);
      res.status(500).json({ error: "Failed to assign user to location" });
    }
  });

  app.delete(`${apiPrefix}/users/:userId/locations/:locationId`, isAdmin, async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const locationId = parseInt(req.params.locationId);
      
      const result = await storage.removeUserFromLocation(userId, locationId);
      
      if (!result) {
        return res.status(404).json({ error: "User-location relationship not found" });
      }
      
      res.status(200).json({ success: true });
    } catch (error) {
      console.error(`Error removing user ${req.params.userId} from location ${req.params.locationId}:`, error);
      res.status(500).json({ error: "Failed to remove user from location" });
    }
  });

  // Patients API
  app.get(`${apiPrefix}/patients`, isAuthenticated, async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      const patients = await storage.listPatients(limit, offset);
      res.json(patients);
    } catch (error) {
      console.error("Error fetching patients:", error);
      res.status(500).json({ error: "Failed to fetch patients" });
    }
  });

  app.get(`${apiPrefix}/patients/search`, isAuthenticated, async (req: Request, res: Response) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ error: "Search query is required" });
      }
      const patients = await storage.searchPatients(query);
      res.json(patients);
    } catch (error) {
      console.error("Error searching patients:", error);
      res.status(500).json({ error: "Failed to search patients" });
    }
  });

  app.get(`${apiPrefix}/patients/:id`, isAuthenticated, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const patient = await storage.getPatient(id);
      
      if (!patient) {
        return res.status(404).json({ error: "Patient not found" });
      }
      
      res.json(patient);
    } catch (error) {
      console.error(`Error fetching patient ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to fetch patient" });
    }
  });

  app.post(`${apiPrefix}/patients`, isAuthenticated, async (req: Request, res: Response) => {
    try {
      const patientData = insertPatientSchema.parse(req.body);
      const newPatient = await storage.createPatient(patientData);
      res.status(201).json(newPatient);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating patient:", error);
      res.status(500).json({ error: "Failed to create patient" });
    }
  });

  app.patch(`${apiPrefix}/patients/:id`, isAuthenticated, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const patientData = insertPatientSchema.partial().parse(req.body);
      
      const updatedPatient = await storage.updatePatient(id, patientData);
      
      if (!updatedPatient) {
        return res.status(404).json({ error: "Patient not found" });
      }
      
      res.json(updatedPatient);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error(`Error updating patient ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to update patient" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}