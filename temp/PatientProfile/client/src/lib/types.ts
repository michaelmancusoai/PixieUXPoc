// Patient related types

export interface Patient {
  id: string;
  name: string;
  dob: string;
  age: number;
  gender: string;
  chartNumber: string;
  photo?: string;
  alerts: Alert[];
}

export interface Alert {
  id: number;
  type: "error" | "warning" | "info" | "success";
  icon: string;
  label: string;
}

export interface NextVisit {
  date: string;
  type: string;
  duration: string;
  provider: string;
  operatory: string;
}

export interface Balance {
  total: number;
  current: number;
  days30: number;
  days60: number;
  days90Plus: number;
}

export interface InsuranceCoverage {
  planName: string;
  policyNumber: string;
  groupNumber: string;
  used: number;
  maximum: number;
  expiryDate: string;
  deductibleMet: number;
  deductible: number;
}

export interface RecallStatus {
  hygieneStatus: "current" | "due" | "overdue";
  hygieneOverdueMonths?: number;
  radiographStatus: "current" | "due" | "overdue";
  reminderStatus: "sent" | "pending" | "none";
}

export interface MedicalAlert {
  type: "allergy" | "medication" | "condition" | "vitals";
  label: string;
  value: string;
  date?: string;
}

export type ActivityType = 
  | "appointment" 
  | "message" 
  | "clinical" 
  | "claim" 
  | "payment" 
  | "voicemail" 
  | "admin";

export interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  date: string;
  user: string;
  description?: string;
  icon: string;
  color: string;
}

export interface Claim {
  id: string;
  number: string;
  procedure: string;
  amount: number;
  status: "submitted" | "pending" | "paid" | "denied";
  date: string;
}

export interface Statement {
  id: string;
  number: string;
  date: string;
  amount: number;
  status: "paid" | "unpaid" | "partial";
}

export interface Visit {
  id: string;
  date: string;
  type: string;
  provider: string;
}

export interface Procedure {
  id: string;
  code: string;
  description: string;
  tooth?: number;
  date: string;
  provider: string;
  amount: number;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  date: string;
  thumbnailUrl?: string;
}

export interface RelatedContact {
  id: string;
  name: string;
  relationship: string;
  role: "guarantor" | "emergency" | "referral" | "other";
  phone: string;
}
