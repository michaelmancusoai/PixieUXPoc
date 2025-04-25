import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express, Request, Response, NextFunction } from "express";
import session from "express-session";
import { storage } from "./storage";
import { loginUserSchema, User } from "@shared/schema";
import * as crypto from "crypto";

declare global {
  namespace Express {
    interface User {
      id: number;
      username: string;
      email: string;
      firstName?: string;
      lastName?: string;
      isAdmin: boolean;
      roles: string[];
      accountStage: string;
    }
  }
}

// Helper function to verify password
async function verifyPassword(suppliedPassword: string, storedPassword: string): Promise<boolean> {
  const [hash, salt] = storedPassword.split(".");
  const suppliedHash = crypto.pbkdf2Sync(suppliedPassword, salt, 1000, 64, "sha512").toString("hex");
  return hash === suppliedHash;
}

// Helper middleware for checking if user is logged in
export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
}

// Helper middleware for checking if user is an admin
export function isAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated() && req.user.isAdmin) {
    return next();
  }
  res.status(403).json({ message: "Forbidden" });
}

// Helper middleware for checking specific roles
export function hasRole(roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
      const userRoles = req.user.roles || [];
      if (userRoles.some(role => roles.includes(role)) || req.user.isAdmin) {
        return next();
      }
    }
    res.status(403).json({ message: "Forbidden" });
  };
}

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "pixie-dental-secret-key",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
      try {
        // Normalize email to lowercase
        const normalizedEmail = email.toLowerCase();
        
        // Find the user by email
        const user = await storage.getUserByEmail(normalizedEmail);
        
        if (!user) {
          return done(null, false, { message: "Invalid email or password" });
        }
        
        // Validate password
        const verifyResult = await verifyPassword(password, user.password);
        if (!verifyResult) {
          return done(null, false, { message: "Invalid email or password" });
        }
        
        // Check if user is suspended or deactivated
        if (user.accountStage === "suspended" || user.accountStage === "deactivated") {
          return done(null, false, { message: "Account is inactive. Please contact administrator." });
        }
        
        // Update last login timestamp - don't wait for this to complete
        storage.updateUser(user.id, { 
          // TypeScript doesn't know about lastLoginAt, but our DB implementation handles it
          lastLoginAt: new Date() as any
        }).catch(err => console.error("Failed to update last login time:", err));
        
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      if (!user) {
        return done(null, false);
      }
      
      if (user.accountStage === "suspended" || user.accountStage === "deactivated") {
        return done(null, false);
      }
      
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Register auth routes
  app.post("/api/login", (req, res, next) => {
    const validation = loginUserSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ 
        message: "Validation failed", 
        errors: validation.error.errors 
      });
    }
    
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({ message: info?.message || "Authentication failed" });
      }
      req.login(user, (loginErr) => {
        if (loginErr) {
          return next(loginErr);
        }
        return res.status(200).json({
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isAdmin: user.isAdmin,
          roles: user.roles,
          accountStage: user.accountStage,
        });
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.status(200).json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/me", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    res.status(200).json({
      id: req.user.id,
      username: req.user.username,
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      isAdmin: req.user.isAdmin,
      roles: req.user.roles,
      accountStage: req.user.accountStage,
    });
  });

  app.post("/api/register", async (req, res, next) => {
    try {
      const validation = loginUserSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          message: "Validation failed", 
          errors: validation.error.errors 
        });
      }
      
      // Check if email already exists
      const existingUser = await storage.getUserByEmail(req.body.email.toLowerCase());
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
      }
      
      // Check if username already exists
      const existingUsername = await storage.getUserByUsername(req.body.username);
      if (existingUsername) {
        return res.status(400).json({ message: "Username already in use" });
      }
      
      // Create the user
      const user = await storage.createUser({
        ...req.body,
        email: req.body.email.toLowerCase(),
        confirmPassword: req.body.password, // Required by our schema validation
        accountStage: "active" as any, // TypeScript doesn't recognize the string literal
      });
      
      // Auto-login the user
      req.login(user, (err) => {
        if (err) {
          return next(err);
        }
        return res.status(201).json({
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isAdmin: user.isAdmin,
          roles: user.roles,
          accountStage: user.accountStage,
        });
      });
    } catch (error: any) {
      return res.status(500).json({ message: error.message || "Registration failed" });
    }
  });
}