import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { format, parse, addDays } from "date-fns";
import { json } from "express";
import { AppointmentStatus, ViewMode } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes related to scheduling
  app.get("/api/providers", async (req, res) => {
    try {
      const providers = await storage.getProviders();
      res.json(providers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch providers" });
    }
  });

  app.get("/api/operatories", async (req, res) => {
    try {
      const operatories = await storage.getOperatories();
      res.json(operatories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch operatories" });
    }
  });

  app.get("/api/patients", async (req, res) => {
    try {
      const patients = await storage.getPatients();
      res.json(patients);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch patients" });
    }
  });

  app.get("/api/appointments", async (req, res) => {
    try {
      const date = req.query.date as string;
      const viewMode = req.query.viewMode as string || ViewMode.DAY;
      
      let appointments = [];
      
      if (date) {
        if (viewMode === ViewMode.WEEK) {
          // For week view, get appointments for the whole week
          const startDate = parse(date, 'yyyy-MM-dd', new Date());
          const endDate = addDays(startDate, 6);
          appointments = await storage.getAppointmentsByDateRange(
            format(startDate, 'yyyy-MM-dd'),
            format(endDate, 'yyyy-MM-dd')
          );
        } else {
          // For day view, get appointments for a single day
          appointments = await storage.getAppointmentsByDate(date);
        }
      } else {
        // If no date specified, get all appointments
        appointments = await storage.getAllAppointments();
      }
      
      // Include patient, provider, and operatory details with each appointment
      const appointmentsWithDetails = await Promise.all(
        appointments.map(async (appointment) => {
          const patient = await storage.getPatient(appointment.patientId);
          const provider = appointment.providerId ? 
            await storage.getProvider(appointment.providerId) : undefined;
          const operatory = appointment.operatoryId ? 
            await storage.getOperatory(appointment.operatoryId) : undefined;
          
          return {
            ...appointment,
            patient,
            provider,
            operatory
          };
        })
      );
      
      res.json(appointmentsWithDetails);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch appointments" });
    }
  });

  app.post("/api/appointments", async (req, res) => {
    try {
      const newAppointment = req.body;
      const createdAppointment = await storage.createAppointment(newAppointment);
      res.status(201).json(createdAppointment);
    } catch (error) {
      res.status(500).json({ message: "Failed to create appointment" });
    }
  });

  app.patch("/api/appointments/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const updates = req.body;
      
      const updatedAppointment = await storage.updateAppointment(id, updates);
      if (!updatedAppointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }
      
      res.json(updatedAppointment);
    } catch (error) {
      res.status(500).json({ message: "Failed to update appointment" });
    }
  });

  app.patch("/api/appointments/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const { status } = req.body;
      
      if (!Object.values(AppointmentStatus).includes(status)) {
        return res.status(400).json({ message: "Invalid status value" });
      }
      
      const updatedAppointment = await storage.updateAppointmentStatus(id, status);
      if (!updatedAppointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }
      
      res.json(updatedAppointment);
    } catch (error) {
      res.status(500).json({ message: "Failed to update appointment status" });
    }
  });

  app.get("/api/procedures", async (req, res) => {
    try {
      const procedures = await storage.getProcedures();
      res.json(procedures);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch procedures" });
    }
  });

  app.get("/api/scheduling/utilization", async (req, res) => {
    try {
      const date = req.query.date as string || format(new Date(), 'yyyy-MM-dd');
      const utilization = await storage.getUtilizationByDate(date);
      res.json(utilization);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch utilization data" });
    }
  });

  app.get("/api/scheduling/gaps", async (req, res) => {
    try {
      const date = req.query.date as string || format(new Date(), 'yyyy-MM-dd');
      const gaps = await storage.getGapsByDate(date);
      res.json(gaps);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch gap data" });
    }
  });

  app.get("/api/scheduling/waitlist", async (req, res) => {
    try {
      const waitlist = await storage.getWaitlist();
      res.json(waitlist);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch waitlist" });
    }
  });

  app.get("/api/scheduling/inventory-alerts", async (req, res) => {
    try {
      const inventoryAlerts = await storage.getInventoryAlerts();
      res.json(inventoryAlerts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch inventory alerts" });
    }
  });

  app.get("/api/scheduling/queue/arrived", async (req, res) => {
    try {
      const date = req.query.date as string || format(new Date(), 'yyyy-MM-dd');
      const arrivedPatients = await storage.getArrivedPatients(date);
      res.json(arrivedPatients);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch arrived patients" });
    }
  });

  app.get("/api/scheduling/queue/pending-checkout", async (req, res) => {
    try {
      const date = req.query.date as string || format(new Date(), 'yyyy-MM-dd');
      const pendingCheckout = await storage.getPendingCheckout(date);
      res.json(pendingCheckout);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch pending checkout patients" });
    }
  });

  app.get("/api/scheduling/queue/docs-needed", async (req, res) => {
    try {
      const date = req.query.date as string || format(new Date(), 'yyyy-MM-dd');
      const docsNeeded = await storage.getDocsNeeded(date);
      res.json(docsNeeded);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch documents needed" });
    }
  });

  app.get("/api/scheduling/benefits-verification", async (req, res) => {
    try {
      const benefitsVerification = await storage.getBenefitsVerification();
      res.json(benefitsVerification);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch benefits verification" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
