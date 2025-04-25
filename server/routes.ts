import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertIssueSchema, insertCommentSchema, insertNotificationSchema } from "@shared/schema";
import multer from "multer";
import path from "path";
import fs from "fs";
import { randomUUID } from "crypto";

// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadDir = path.join(process.cwd(), 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = `${Date.now()}-${randomUUID()}`;
      cb(null, `${uniqueSuffix}-${file.originalname}`);
    }
  }),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and PDF files are allowed.'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // Authentication routes
  app.post('/api/auth/register', async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByUsername(userData.username);
      
      if (existingUser) {
        return res.status(409).json({ message: 'Username already exists' });
      }
      
      const user = await storage.createUser(userData);
      
      // Don't send the password back
      const { password, ...userWithoutPassword } = user;
      
      return res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: 'An unknown error occurred' });
    }
  });
  
  app.post('/api/auth/login', async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
      }
      
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }
      
      // Don't send the password back
      const { password: _, ...userWithoutPassword } = user;
      
      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: 'An unknown error occurred' });
    }
  });
  
  app.get('/api/auth/user', async (req: Request, res: Response) => {
    // In a real app, we would check authentication first
    // For demo, return a mock authenticated user
    try {
      const user = await storage.getUser(-1); // John Doe for demo
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Don't send the password back
      const { password, ...userWithoutPassword } = user;
      
      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: 'An unknown error occurred' });
    }
  });
  
  // Issue routes
  app.get('/api/issues', async (req: Request, res: Response) => {
    try {
      const issues = await storage.getAllIssues();
      return res.status(200).json(issues);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: 'An unknown error occurred' });
    }
  });
  
  app.get('/api/issues/:id', async (req: Request, res: Response) => {
    try {
      const issueId = parseInt(req.params.id);
      
      if (isNaN(issueId)) {
        return res.status(400).json({ message: 'Invalid issue ID' });
      }
      
      const issue = await storage.getIssue(issueId);
      
      if (!issue) {
        return res.status(404).json({ message: 'Issue not found' });
      }
      
      return res.status(200).json(issue);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: 'An unknown error occurred' });
    }
  });
  
  app.post('/api/issues', async (req: Request, res: Response) => {
    try {
      const issueData = insertIssueSchema.parse(req.body);
      const issue = await storage.createIssue(issueData);
      
      // Create notification for assignment if there's an assignee
      if (issue.assigneeId) {
        await storage.createNotification({
          type: 'assignment',
          message: `You were assigned to "${issue.title}"`,
          read: false,
          userId: issue.assigneeId,
          issueId: issue.id
        });
      }
      
      return res.status(201).json(issue);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: 'An unknown error occurred' });
    }
  });
  
  app.patch('/api/issues/:id', async (req: Request, res: Response) => {
    try {
      const issueId = parseInt(req.params.id);
      
      if (isNaN(issueId)) {
        return res.status(400).json({ message: 'Invalid issue ID' });
      }
      
      const existingIssue = await storage.getIssue(issueId);
      
      if (!existingIssue) {
        return res.status(404).json({ message: 'Issue not found' });
      }
      
      // Validate partial update
      const updateData = req.body;
      const updatedIssue = await storage.updateIssue(issueId, updateData);
      
      // Create notification if status changed
      if (updateData.status && updateData.status !== existingIssue.status) {
        // Notify the reporter
        if (existingIssue.reporterId) {
          await storage.createNotification({
            type: 'status',
            message: `Issue "${existingIssue.title}" status changed to ${updateData.status}`,
            read: false,
            userId: existingIssue.reporterId,
            issueId: existingIssue.id
          });
        }
        
        // Also notify the assignee if different from reporter
        if (existingIssue.assigneeId && existingIssue.assigneeId !== existingIssue.reporterId) {
          await storage.createNotification({
            type: 'status',
            message: `Issue "${existingIssue.title}" status changed to ${updateData.status}`,
            read: false,
            userId: existingIssue.assigneeId,
            issueId: existingIssue.id
          });
        }
      }
      
      // Create notification if assignee changed
      if (updateData.assigneeId && updateData.assigneeId !== existingIssue.assigneeId) {
        await storage.createNotification({
          type: 'assignment',
          message: `You were assigned to "${existingIssue.title}"`,
          read: false,
          userId: updateData.assigneeId,
          issueId: existingIssue.id
        });
      }
      
      return res.status(200).json(updatedIssue);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: 'An unknown error occurred' });
    }
  });
  
  app.delete('/api/issues/:id', async (req: Request, res: Response) => {
    try {
      const issueId = parseInt(req.params.id);
      
      if (isNaN(issueId)) {
        return res.status(400).json({ message: 'Invalid issue ID' });
      }
      
      const issue = await storage.getIssue(issueId);
      
      if (!issue) {
        return res.status(404).json({ message: 'Issue not found' });
      }
      
      const deleted = await storage.deleteIssue(issueId);
      
      if (!deleted) {
        return res.status(500).json({ message: 'Failed to delete issue' });
      }
      
      return res.status(200).json({ message: 'Issue deleted successfully' });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: 'An unknown error occurred' });
    }
  });
  
  // Comments
  app.get('/api/issues/:id/comments', async (req: Request, res: Response) => {
    try {
      const issueId = parseInt(req.params.id);
      
      if (isNaN(issueId)) {
        return res.status(400).json({ message: 'Invalid issue ID' });
      }
      
      const comments = await storage.getCommentsByIssue(issueId);
      return res.status(200).json(comments);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: 'An unknown error occurred' });
    }
  });
  
  app.post('/api/issues/:id/comments', async (req: Request, res: Response) => {
    try {
      const issueId = parseInt(req.params.id);
      
      if (isNaN(issueId)) {
        return res.status(400).json({ message: 'Invalid issue ID' });
      }
      
      const issue = await storage.getIssue(issueId);
      
      if (!issue) {
        return res.status(404).json({ message: 'Issue not found' });
      }
      
      const commentData = insertCommentSchema.parse({
        ...req.body,
        issueId
      });
      
      const comment = await storage.createComment(commentData);
      
      // Create notifications for the reporter and assignee
      // Notify the reporter if they're not the commenter
      if (issue.reporterId && issue.reporterId !== commentData.userId) {
        await storage.createNotification({
          type: 'comment',
          message: `New comment on "${issue.title}"`,
          read: false,
          userId: issue.reporterId,
          issueId: issue.id
        });
      }
      
      // Notify the assignee if they're not the commenter and different from reporter
      if (issue.assigneeId && 
          issue.assigneeId !== commentData.userId && 
          issue.assigneeId !== issue.reporterId) {
        await storage.createNotification({
          type: 'comment',
          message: `New comment on "${issue.title}"`,
          read: false,
          userId: issue.assigneeId,
          issueId: issue.id
        });
      }
      
      return res.status(201).json(comment);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: 'An unknown error occurred' });
    }
  });
  
  // File uploads
  app.post('/api/issues/:id/attachments', upload.single('file'), async (req: Request, res: Response) => {
    try {
      const issueId = parseInt(req.params.id);
      
      if (isNaN(issueId)) {
        return res.status(400).json({ message: 'Invalid issue ID' });
      }
      
      const issue = await storage.getIssue(issueId);
      
      if (!issue) {
        return res.status(404).json({ message: 'Issue not found' });
      }
      
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
      
      const { uploaderId } = req.body;
      
      if (!uploaderId) {
        return res.status(400).json({ message: 'Uploader ID is required' });
      }
      
      const attachment = await storage.createAttachment({
        filename: req.file.originalname,
        filepath: req.file.path,
        issueId,
        uploaderId: parseInt(uploaderId)
      });
      
      return res.status(201).json(attachment);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: 'An unknown error occurred' });
    }
  });
  
  app.get('/api/issues/:id/attachments', async (req: Request, res: Response) => {
    try {
      const issueId = parseInt(req.params.id);
      
      if (isNaN(issueId)) {
        return res.status(400).json({ message: 'Invalid issue ID' });
      }
      
      const attachments = await storage.getAttachmentsByIssue(issueId);
      return res.status(200).json(attachments);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: 'An unknown error occurred' });
    }
  });
  
  app.get('/api/download/:fileId', async (req: Request, res: Response) => {
    try {
      const fileId = parseInt(req.params.fileId);
  
      if (isNaN(fileId)) {
        return res.status(400).json({ message: 'Invalid file ID' });
      }
  
      const attachment = await storage.getAttachment(fileId);
  
      if (!attachment) {
        return res.status(404).json({ message: 'Attachment not found' });
      }
      const filePath = attachment.filepath;
      console.log('filePath: ', filePath)
  
      res.download(filePath);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: 'An unknown error occurred' });
    }
  });

  // Notifications
  app.get('/api/notifications', async (req: Request, res: Response) => {
    try {
      // In a real app, we would get the user ID from the session
      // For demo purposes, use John Doe (ID: 1)
      const userId = 1;
      
      const notifications = await storage.getNotificationsByUser(userId);
      return res.status(200).json(notifications);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: 'An unknown error occurred' });
    }
  });
  
  app.patch('/api/notifications/:id/read', async (req: Request, res: Response) => {
    try {
      const notificationId = parseInt(req.params.id);
      
      if (isNaN(notificationId)) {
        return res.status(400).json({ message: 'Invalid notification ID' });
      }
      
      const updatedNotification = await storage.markNotificationAsRead(notificationId);
      
      if (!updatedNotification) {
        return res.status(404).json({ message: 'Notification not found' });
      }
      
      return res.status(200).json(updatedNotification);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: 'An unknown error occurred' });
    }
  });
  
  // Analytics
  app.get('/api/analytics/summary', async (req: Request, res: Response) => {
    try {
      const [
        statusCounts,
        priorityCounts,
        categoryCounts,
        recentIssues,
        avgResolutionTime
      ] = await Promise.all([
        storage.getIssuesByStatus(),
        storage.getIssuesByPriority(),
        storage.getIssuesByCategory(),
        storage.getRecentIssues(5),
        storage.getResolutionTime()
      ]);
      
      const totalIssues = Object.values(statusCounts).reduce((sum, count) => sum + count, 0);
      const openIssues = statusCounts.open + statusCounts.in_progress;
      const resolvedIssues = statusCounts.resolved + statusCounts.closed;
      
      return res.status(200).json({
        totalIssues,
        openIssues,
        resolvedIssues,
        avgResolutionTime,
        byStatus: statusCounts,
        byPriority: priorityCounts,
        byCategory: categoryCounts,
        recentIssues
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: 'An unknown error occurred' });
    }
  });

  return httpServer;
}
