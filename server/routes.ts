import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertPatientSchema,
  insertAppointmentSchema,
  insertMedicalAlertSchema,
  insertDocumentSchema,
  insertNoteSchema,
  insertPaymentSchema,
  insertMessageSchema,
  insertRecallSchema,
  insertTreatmentSchema,
  insertClaimSchema,
  insertProviderSchema,
  insertOperatorySchema,
  insertWaitlistSchema,
  AppointmentStatus
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API prefix
  const apiPrefix = "/api";

  // Patients API
  app.get(`${apiPrefix}/patients`, async (req: Request, res: Response) => {
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

  app.get(`${apiPrefix}/patients/search`, async (req: Request, res: Response) => {
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

  app.get(`${apiPrefix}/patients/:id`, async (req: Request, res: Response) => {
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

  app.post(`${apiPrefix}/patients`, async (req: Request, res: Response) => {
    try {
      const patientData = insertPatientSchema.parse(req.body);
      const newPatient = await storage.createPatient(patientData);
      
      // Log activity
      await storage.logActivity(
        newPatient.id,
        req.body.createdBy || null,
        "patient_created",
        `Patient ${newPatient.firstName} ${newPatient.lastName} created`
      );
      
      res.status(201).json(newPatient);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating patient:", error);
      res.status(500).json({ error: "Failed to create patient" });
    }
  });

  app.patch(`${apiPrefix}/patients/:id`, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const patientData = insertPatientSchema.partial().parse(req.body);
      
      const updatedPatient = await storage.updatePatient(id, patientData);
      
      if (!updatedPatient) {
        return res.status(404).json({ error: "Patient not found" });
      }
      
      // Log activity
      await storage.logActivity(
        id,
        req.body.userId || null,
        "patient_updated",
        `Patient ${updatedPatient.firstName} ${updatedPatient.lastName} updated`
      );
      
      res.json(updatedPatient);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error(`Error updating patient ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to update patient" });
    }
  });

  // Appointments API
  app.get(`${apiPrefix}/patients/:id/appointments`, async (req: Request, res: Response) => {
    try {
      const patientId = parseInt(req.params.id);
      const appointments = await storage.getPatientAppointments(patientId);
      res.json(appointments);
    } catch (error) {
      console.error(`Error fetching appointments for patient ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to fetch appointments" });
    }
  });

  app.post(`${apiPrefix}/appointments`, async (req: Request, res: Response) => {
    try {
      const appointmentData = insertAppointmentSchema.parse(req.body);
      const newAppointment = await storage.createAppointment(appointmentData);
      
      // Log activity
      await storage.logActivity(
        appointmentData.patientId,
        req.body.userId || null,
        "appointment_created",
        `Appointment scheduled for ${new Date(appointmentData.startTime).toLocaleString()}`
      );
      
      res.status(201).json(newAppointment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating appointment:", error);
      res.status(500).json({ error: "Failed to create appointment" });
    }
  });

  // Medical Alerts API
  app.get(`${apiPrefix}/patients/:id/medical-alerts`, async (req: Request, res: Response) => {
    try {
      const patientId = parseInt(req.params.id);
      const alerts = await storage.listPatientMedicalAlerts(patientId);
      res.json(alerts);
    } catch (error) {
      console.error(`Error fetching medical alerts for patient ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to fetch medical alerts" });
    }
  });

  app.post(`${apiPrefix}/medical-alerts`, async (req: Request, res: Response) => {
    try {
      const alertData = insertMedicalAlertSchema.parse(req.body);
      const newAlert = await storage.createMedicalAlert(alertData);
      
      // Log activity
      await storage.logActivity(
        alertData.patientId,
        req.body.userId || null,
        "medical_alert_created",
        `Medical alert created: ${alertData.type} - ${alertData.description}`
      );
      
      res.status(201).json(newAlert);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating medical alert:", error);
      res.status(500).json({ error: "Failed to create medical alert" });
    }
  });

  // Documents API
  app.get(`${apiPrefix}/patients/:id/documents`, async (req: Request, res: Response) => {
    try {
      const patientId = parseInt(req.params.id);
      const documents = await storage.getPatientDocuments(patientId);
      res.json(documents);
    } catch (error) {
      console.error(`Error fetching documents for patient ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to fetch documents" });
    }
  });

  app.post(`${apiPrefix}/documents`, async (req: Request, res: Response) => {
    try {
      const documentData = insertDocumentSchema.parse(req.body);
      const newDocument = await storage.createDocument(documentData);
      
      // Log activity
      await storage.logActivity(
        documentData.patientId,
        documentData.uploadedBy || null,
        "document_uploaded",
        `Document uploaded: ${documentData.title}`
      );
      
      res.status(201).json(newDocument);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating document:", error);
      res.status(500).json({ error: "Failed to create document" });
    }
  });

  // Notes API
  app.get(`${apiPrefix}/patients/:id/notes`, async (req: Request, res: Response) => {
    try {
      const patientId = parseInt(req.params.id);
      const notes = await storage.getPatientNotes(patientId);
      res.json(notes);
    } catch (error) {
      console.error(`Error fetching notes for patient ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to fetch notes" });
    }
  });

  app.post(`${apiPrefix}/notes`, async (req: Request, res: Response) => {
    try {
      const noteData = insertNoteSchema.parse(req.body);
      const newNote = await storage.createNote(noteData);
      
      // Log activity
      await storage.logActivity(
        noteData.patientId,
        noteData.authorId || null,
        "note_created",
        `Clinical note created: ${noteData.noteType}`
      );
      
      res.status(201).json(newNote);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating note:", error);
      res.status(500).json({ error: "Failed to create note" });
    }
  });

  // Payments API
  app.get(`${apiPrefix}/patients/:id/payments`, async (req: Request, res: Response) => {
    try {
      const patientId = parseInt(req.params.id);
      const payments = await storage.getPatientPayments(patientId);
      res.json(payments);
    } catch (error) {
      console.error(`Error fetching payments for patient ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to fetch payments" });
    }
  });

  app.post(`${apiPrefix}/payments`, async (req: Request, res: Response) => {
    try {
      const paymentData = insertPaymentSchema.parse(req.body);
      const newPayment = await storage.createPayment(paymentData);
      
      // Log activity
      await storage.logActivity(
        paymentData.patientId,
        paymentData.createdBy || null,
        "payment_processed",
        `Payment processed: $${paymentData.amount} via ${paymentData.paymentMethod}`
      );
      
      res.status(201).json(newPayment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating payment:", error);
      res.status(500).json({ error: "Failed to create payment" });
    }
  });

  // Messages API
  app.get(`${apiPrefix}/patients/:id/messages`, async (req: Request, res: Response) => {
    try {
      const patientId = parseInt(req.params.id);
      const messages = await storage.getPatientMessages(patientId);
      res.json(messages);
    } catch (error) {
      console.error(`Error fetching messages for patient ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  app.post(`${apiPrefix}/messages`, async (req: Request, res: Response) => {
    try {
      const messageData = insertMessageSchema.parse(req.body);
      const newMessage = await storage.createMessage(messageData);
      
      // Log activity
      await storage.logActivity(
        messageData.patientId,
        messageData.senderId || null,
        "message_sent",
        `Message sent via ${messageData.messageType}`
      );
      
      res.status(201).json(newMessage);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating message:", error);
      res.status(500).json({ error: "Failed to create message" });
    }
  });

  // Recalls API
  app.get(`${apiPrefix}/patients/:id/recalls`, async (req: Request, res: Response) => {
    try {
      const patientId = parseInt(req.params.id);
      const recalls = await storage.getPatientRecalls(patientId);
      res.json(recalls);
    } catch (error) {
      console.error(`Error fetching recalls for patient ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to fetch recalls" });
    }
  });

  app.post(`${apiPrefix}/recalls`, async (req: Request, res: Response) => {
    try {
      const recallData = insertRecallSchema.parse(req.body);
      const newRecall = await storage.createRecall(recallData);
      
      // Log activity
      await storage.logActivity(
        recallData.patientId,
        req.body.userId || null,
        "recall_created",
        `Recall created: ${recallData.type} due on ${recallData.dueDate.toISOString().split('T')[0]}`
      );
      
      res.status(201).json(newRecall);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating recall:", error);
      res.status(500).json({ error: "Failed to create recall" });
    }
  });

  // Treatments API
  app.get(`${apiPrefix}/patients/:id/treatments`, async (req: Request, res: Response) => {
    try {
      const patientId = parseInt(req.params.id);
      const treatments = await storage.getPatientTreatments(patientId);
      res.json(treatments);
    } catch (error) {
      console.error(`Error fetching treatments for patient ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to fetch treatments" });
    }
  });

  app.post(`${apiPrefix}/treatments`, async (req: Request, res: Response) => {
    try {
      const treatmentData = insertTreatmentSchema.parse(req.body);
      const newTreatment = await storage.createTreatment(treatmentData);
      
      // Log activity
      await storage.logActivity(
        treatmentData.patientId,
        treatmentData.providerId || null,
        "treatment_created",
        `Treatment created: ${treatmentData.procedure}`
      );
      
      res.status(201).json(newTreatment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating treatment:", error);
      res.status(500).json({ error: "Failed to create treatment" });
    }
  });

  // Insurance Claims API
  app.get(`${apiPrefix}/patients/:id/claims`, async (req: Request, res: Response) => {
    try {
      const patientId = parseInt(req.params.id);
      const claims = await storage.getPatientClaims(patientId);
      res.json(claims);
    } catch (error) {
      console.error(`Error fetching claims for patient ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to fetch claims" });
    }
  });

  app.post(`${apiPrefix}/claims`, async (req: Request, res: Response) => {
    try {
      const claimData = insertClaimSchema.parse(req.body);
      const newClaim = await storage.createClaim(claimData);
      
      // Log activity
      await storage.logActivity(
        claimData.patientId,
        req.body.userId || null,
        "claim_submitted",
        `Insurance claim submitted: ${claimData.claimNumber}`
      );
      
      res.status(201).json(newClaim);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating claim:", error);
      res.status(500).json({ error: "Failed to create claim" });
    }
  });

  // Activity Log API
  app.get(`${apiPrefix}/patients/:id/activity`, async (req: Request, res: Response) => {
    try {
      const patientId = parseInt(req.params.id);
      const activities = await storage.getPatientActivityLog(patientId);
      res.json(activities);
    } catch (error) {
      console.error(`Error fetching activity log for patient ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to fetch activity log" });
    }
  });

  // Scheduling API - Providers
  app.get(`${apiPrefix}/providers`, async (_req: Request, res: Response) => {
    try {
      const providers = await storage.getProviders();
      res.json(providers);
    } catch (error) {
      console.error("Error fetching providers:", error);
      res.status(500).json({ error: "Failed to fetch providers" });
    }
  });

  app.get(`${apiPrefix}/providers/:id`, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const provider = await storage.getProvider(id);
      
      if (!provider) {
        return res.status(404).json({ error: "Provider not found" });
      }
      
      res.json(provider);
    } catch (error) {
      console.error(`Error fetching provider ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to fetch provider" });
    }
  });

  app.post(`${apiPrefix}/providers`, async (req: Request, res: Response) => {
    try {
      const providerData = insertProviderSchema.parse(req.body);
      const newProvider = await storage.createProvider(providerData);
      res.status(201).json(newProvider);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating provider:", error);
      res.status(500).json({ error: "Failed to create provider" });
    }
  });

  app.patch(`${apiPrefix}/providers/:id`, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const providerData = insertProviderSchema.partial().parse(req.body);
      
      const updatedProvider = await storage.updateProvider(id, providerData);
      
      if (!updatedProvider) {
        return res.status(404).json({ error: "Provider not found" });
      }
      
      res.json(updatedProvider);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error(`Error updating provider ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to update provider" });
    }
  });

  // Scheduling API - Operatories
  app.get(`${apiPrefix}/operatories`, async (_req: Request, res: Response) => {
    try {
      const operatories = await storage.getOperatories();
      res.json(operatories);
    } catch (error) {
      console.error("Error fetching operatories:", error);
      res.status(500).json({ error: "Failed to fetch operatories" });
    }
  });

  app.get(`${apiPrefix}/operatories/:id`, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const operatory = await storage.getOperatory(id);
      
      if (!operatory) {
        return res.status(404).json({ error: "Operatory not found" });
      }
      
      res.json(operatory);
    } catch (error) {
      console.error(`Error fetching operatory ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to fetch operatory" });
    }
  });

  app.post(`${apiPrefix}/operatories`, async (req: Request, res: Response) => {
    try {
      const operatoryData = insertOperatorySchema.parse(req.body);
      const newOperatory = await storage.createOperatory(operatoryData);
      res.status(201).json(newOperatory);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating operatory:", error);
      res.status(500).json({ error: "Failed to create operatory" });
    }
  });

  app.patch(`${apiPrefix}/operatories/:id`, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const operatoryData = insertOperatorySchema.partial().parse(req.body);
      
      const updatedOperatory = await storage.updateOperatory(id, operatoryData);
      
      if (!updatedOperatory) {
        return res.status(404).json({ error: "Operatory not found" });
      }
      
      res.json(updatedOperatory);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error(`Error updating operatory ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to update operatory" });
    }
  });

  // Scheduling API - Appointments
  app.get(`${apiPrefix}/schedule/appointments`, async (req: Request, res: Response) => {
    try {
      const date = req.query.date as string;
      
      if (date) {
        const appointments = await storage.getAppointmentsByDate(date);
        return res.json(appointments);
      }
      
      const startDate = req.query.startDate as string;
      const endDate = req.query.endDate as string;
      
      if (startDate && endDate) {
        const appointments = await storage.getAppointmentsByDateRange(startDate, endDate);
        return res.json(appointments);
      }
      
      // If no date params, return all appointments
      const appointments = await storage.getAllAppointments();
      res.json(appointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      res.status(500).json({ error: "Failed to fetch appointments" });
    }
  });

  app.patch(`${apiPrefix}/appointments/:id`, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const appointmentData = insertAppointmentSchema.partial().parse(req.body);
      
      const updatedAppointment = await storage.updateAppointment(id, appointmentData);
      
      if (!updatedAppointment) {
        return res.status(404).json({ error: "Appointment not found" });
      }
      
      // Log activity if patient is affected
      if (updatedAppointment.patientId) {
        await storage.logActivity(
          updatedAppointment.patientId,
          req.body.userId || null,
          "appointment_updated",
          `Appointment updated for ${new Date(updatedAppointment.startTime).toLocaleString()}`
        );
      }
      
      res.json(updatedAppointment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error(`Error updating appointment ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to update appointment" });
    }
  });
  
  app.patch(`${apiPrefix}/appointments/:id/status`, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const statusSchema = z.object({
        status: z.string().refine(val => Object.keys(AppointmentStatus).includes(val), {
          message: `Status must be one of: ${Object.keys(AppointmentStatus).join(', ')}`
        })
      });
      
      const { status } = statusSchema.parse(req.body);
      
      const updatedAppointment = await storage.updateAppointmentStatus(id, status);
      
      if (!updatedAppointment) {
        return res.status(404).json({ error: "Appointment not found" });
      }
      
      // Log activity if patient is affected
      if (updatedAppointment.patientId) {
        await storage.logActivity(
          updatedAppointment.patientId,
          req.body.userId || null,
          "appointment_status_updated",
          `Appointment status updated to ${status}`
        );
      }
      
      res.json(updatedAppointment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error(`Error updating appointment status ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to update appointment status" });
    }
  });

  // Scheduling API - Waitlist
  app.get(`${apiPrefix}/waitlist`, async (_req: Request, res: Response) => {
    try {
      const waitlist = await storage.getWaitlist();
      res.json(waitlist);
    } catch (error) {
      console.error("Error fetching waitlist:", error);
      res.status(500).json({ error: "Failed to fetch waitlist" });
    }
  });

  app.post(`${apiPrefix}/waitlist`, async (req: Request, res: Response) => {
    try {
      const waitlistData = insertWaitlistSchema.parse(req.body);
      const newWaitlistItem = await storage.addToWaitlist(waitlistData);
      
      // Log activity
      await storage.logActivity(
        waitlistData.patientId,
        req.body.userId || null,
        "added_to_waitlist",
        `Patient added to waitlist for ${waitlistData.requestedProcedure || 'unspecified procedure'}`
      );
      
      res.status(201).json(newWaitlistItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error adding to waitlist:", error);
      res.status(500).json({ error: "Failed to add to waitlist" });
    }
  });

  app.delete(`${apiPrefix}/waitlist/:id`, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.removeFromWaitlist(id);
      
      if (!success) {
        return res.status(404).json({ error: "Waitlist item not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      console.error(`Error removing from waitlist ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to remove from waitlist" });
    }
  });

  // Scheduling utilities
  app.get(`${apiPrefix}/schedule/utilization`, async (req: Request, res: Response) => {
    try {
      const date = req.query.date as string;
      if (!date) {
        return res.status(400).json({ error: "Date parameter is required" });
      }
      
      const utilization = await storage.getUtilizationByDate(date);
      res.json(utilization);
    } catch (error) {
      console.error(`Error fetching utilization for date ${req.query.date}:`, error);
      res.status(500).json({ error: "Failed to fetch utilization" });
    }
  });

  app.get(`${apiPrefix}/schedule/gaps`, async (req: Request, res: Response) => {
    try {
      const date = req.query.date as string;
      if (!date) {
        return res.status(400).json({ error: "Date parameter is required" });
      }
      
      const gaps = await storage.getGapsByDate(date);
      res.json(gaps);
    } catch (error) {
      console.error(`Error fetching schedule gaps for date ${req.query.date}:`, error);
      res.status(500).json({ error: "Failed to fetch schedule gaps" });
    }
  });

  app.get(`${apiPrefix}/schedule/arrived-patients`, async (req: Request, res: Response) => {
    try {
      const date = req.query.date as string;
      if (!date) {
        return res.status(400).json({ error: "Date parameter is required" });
      }
      
      const patients = await storage.getArrivedPatients(date);
      res.json(patients);
    } catch (error) {
      console.error(`Error fetching arrived patients for date ${req.query.date}:`, error);
      res.status(500).json({ error: "Failed to fetch arrived patients" });
    }
  });

  app.get(`${apiPrefix}/schedule/pending-checkout`, async (req: Request, res: Response) => {
    try {
      const date = req.query.date as string;
      if (!date) {
        return res.status(400).json({ error: "Date parameter is required" });
      }
      
      const patients = await storage.getPendingCheckout(date);
      res.json(patients);
    } catch (error) {
      console.error(`Error fetching pending checkout patients for date ${req.query.date}:`, error);
      res.status(500).json({ error: "Failed to fetch pending checkout patients" });
    }
  });

  app.get(`${apiPrefix}/insurance/benefits-verification`, async (_req: Request, res: Response) => {
    try {
      const verifications = await storage.getBenefitsVerification();
      res.json(verifications);
    } catch (error) {
      console.error("Error fetching benefits verification:", error);
      res.status(500).json({ error: "Failed to fetch benefits verification" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
