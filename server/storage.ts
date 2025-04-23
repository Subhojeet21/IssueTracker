import { 
  User, InsertUser, users,
  Issue, InsertIssue, issues,
  Comment, InsertComment, comments,
  Attachment, InsertAttachment, attachments,
  Notification, InsertNotification, notifications,
  STATUS_VALUES, Status,
  PRIORITY_VALUES, Priority
} from "@shared/schema";

// Storage interface
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Issue methods
  createIssue(issue: InsertIssue): Promise<Issue>;
  getIssue(id: number): Promise<Issue | undefined>;
  getAllIssues(): Promise<Issue[]>;
  updateIssue(id: number, data: Partial<InsertIssue>): Promise<Issue | undefined>;
  deleteIssue(id: number): Promise<boolean>;
  
  // Comment methods
  createComment(comment: InsertComment): Promise<Comment>;
  getCommentsByIssue(issueId: number): Promise<Comment[]>;
  
  // Attachment methods
  createAttachment(attachment: InsertAttachment): Promise<Attachment>;
  getAttachmentsByIssue(issueId: number): Promise<Attachment[]>;
  
  // Notification methods
  createNotification(notification: InsertNotification): Promise<Notification>;
  getNotificationsByUser(userId: number): Promise<Notification[]>;
  markNotificationAsRead(id: number): Promise<Notification | undefined>;
  
  // Analytics methods
  getIssuesByStatus(): Promise<Record<Status, number>>;
  getIssuesByPriority(): Promise<Record<Priority, number>>;
  getIssuesByCategory(): Promise<Record<string, number>>;
  getRecentIssues(limit: number): Promise<Issue[]>;
  getResolutionTime(): Promise<number>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private issues: Map<number, Issue>;
  private comments: Map<number, Comment>;
  private attachments: Map<number, Attachment>;
  private notifications: Map<number, Notification>;
  
  private userCurrentId: number;
  private issueCurrentId: number;
  private commentCurrentId: number;
  private attachmentCurrentId: number;
  private notificationCurrentId: number;

  constructor() {
    this.users = new Map();
    this.issues = new Map();
    this.comments = new Map();
    this.attachments = new Map();
    this.notifications = new Map();
    
    this.userCurrentId = 1;
    this.issueCurrentId = 100; // Starting from IS-100
    this.commentCurrentId = 1;
    this.attachmentCurrentId = 1;
    this.notificationCurrentId = 1;
    
    // Initialize with some demo data
    this.initDemoData();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const now = new Date();
    
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: now,
      avatarUrl: null 
    };
    
    this.users.set(id, user);
    return user;
  }

  // Issue methods
  async createIssue(insertIssue: InsertIssue): Promise<Issue> {
    const id = this.issueCurrentId++;
    const now = new Date();
    
    const issue: Issue = { 
      ...insertIssue, 
      id, 
      createdAt: now, 
      updatedAt: now 
    };
    
    this.issues.set(id, issue);
    return issue;
  }

  async getIssue(id: number): Promise<Issue | undefined> {
    return this.issues.get(id);
  }

  async getAllIssues(): Promise<Issue[]> {
    return [...this.issues.values()].sort((a, b) => 
      (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
    );
  }

  async updateIssue(id: number, data: Partial<InsertIssue>): Promise<Issue | undefined> {
    const issue = this.issues.get(id);
    
    if (!issue) {
      return undefined;
    }
    
    const updatedIssue: Issue = {
      ...issue,
      ...data,
      updatedAt: new Date()
    };
    
    this.issues.set(id, updatedIssue);
    return updatedIssue;
  }

  async deleteIssue(id: number): Promise<boolean> {
    return this.issues.delete(id);
  }

  // Comment methods
  async createComment(insertComment: InsertComment): Promise<Comment> {
    const id = this.commentCurrentId++;
    const now = new Date();
    
    const comment: Comment = {
      ...insertComment,
      id,
      createdAt: now
    };
    
    this.comments.set(id, comment);
    return comment;
  }

  async getCommentsByIssue(issueId: number): Promise<Comment[]> {
    return Array.from(this.comments.values())
      .filter(comment => comment.issueId === issueId)
      .sort((a, b) => 
        (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
      );
  }

  // Attachment methods
  async createAttachment(insertAttachment: InsertAttachment): Promise<Attachment> {
    const id = this.attachmentCurrentId++;
    const now = new Date();
    
    const attachment: Attachment = {
      ...insertAttachment,
      id,
      createdAt: now
    };
    
    this.attachments.set(id, attachment);
    return attachment;
  }

  async getAttachmentsByIssue(issueId: number): Promise<Attachment[]> {
    return Array.from(this.attachments.values())
      .filter(attachment => attachment.issueId === issueId);
  }

  // Notification methods
  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const id = this.notificationCurrentId++;
    const now = new Date();
    
    const notification: Notification = {
      ...insertNotification,
      id,
      createdAt: now
    };
    
    this.notifications.set(id, notification);
    return notification;
  }

  async getNotificationsByUser(userId: number): Promise<Notification[]> {
    return Array.from(this.notifications.values())
      .filter(notification => notification.userId === userId)
      .sort((a, b) => 
        (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
      );
  }

  async markNotificationAsRead(id: number): Promise<Notification | undefined> {
    const notification = this.notifications.get(id);
    
    if (!notification) {
      return undefined;
    }
    
    const updatedNotification: Notification = {
      ...notification,
      read: true
    };
    
    this.notifications.set(id, updatedNotification);
    return updatedNotification;
  }

  // Analytics methods
  async getIssuesByStatus(): Promise<Record<Status, number>> {
    const result: Record<Status, number> = {
      open: 0,
      in_progress: 0,
      resolved: 0,
      closed: 0
    };
    
    for (const issue of this.issues.values()) {
      result[issue.status] = (result[issue.status] || 0) + 1;
    }
    
    return result;
  }

  async getIssuesByPriority(): Promise<Record<Priority, number>> {
    const result: Record<Priority, number> = {
      high: 0,
      medium: 0,
      low: 0
    };
    
    for (const issue of this.issues.values()) {
      result[issue.priority] = (result[issue.priority] || 0) + 1;
    }
    
    return result;
  }

  async getIssuesByCategory(): Promise<Record<string, number>> {
    const result: Record<string, number> = {};
    
    for (const issue of this.issues.values()) {
      result[issue.category] = (result[issue.category] || 0) + 1;
    }
    
    return result;
  }

  async getRecentIssues(limit: number): Promise<Issue[]> {
    return [...this.issues.values()]
      .sort((a, b) => 
        (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
      )
      .slice(0, limit);
  }

  async getResolutionTime(): Promise<number> {
    // Calculate average resolution time in days
    // For resolved issues, calculate the time between creation and update
    const resolvedIssues = [...this.issues.values()].filter(
      issue => issue.status === 'resolved' || issue.status === 'closed'
    );
    
    if (resolvedIssues.length === 0) {
      return 0;
    }
    
    const totalTime = resolvedIssues.reduce((sum, issue) => {
      const createdTime = issue.createdAt?.getTime() || 0;
      const resolvedTime = issue.updatedAt?.getTime() || 0;
      return sum + (resolvedTime - createdTime);
    }, 0);
    
    // Convert to days
    return parseFloat((totalTime / (1000 * 60 * 60 * 24) / resolvedIssues.length).toFixed(1));
  }

  // Initialize with demo data
  private initDemoData() {
    // Create demo users
    const users: InsertUser[] = [
      {
        username: 'johndoe',
        password: '$2b$10$abcdefghijklmnopqrstuvwxyz123456789', // hashed 'password'
        email: 'john.doe@example.com',
        fullName: 'John Doe',
      },
      {
        username: 'alextaylor',
        password: '$2b$10$abcdefghijklmnopqrstuvwxyz123456789',
        email: 'alex.taylor@example.com',
        fullName: 'Alex Taylor',
      },
      {
        username: 'jordansmith',
        password: '$2b$10$abcdefghijklmnopqrstuvwxyz123456789',
        email: 'jordan.smith@example.com',
        fullName: 'Jordan Smith',
      },
      {
        username: 'caseyjones',
        password: '$2b$10$abcdefghijklmnopqrstuvwxyz123456789',
        email: 'casey.jones@example.com',
        fullName: 'Casey Jones',
      }
    ];

    users.forEach(user => this.createUser(user));

    // Create demo issues
    const demoIssues: InsertIssue[] = [
      {
        title: 'Unable to login on mobile devices',
        description: 'Users are reporting issues when trying to log in using mobile devices.',
        status: 'in_progress',
        priority: 'high',
        category: 'bug',
        assigneeId: 2, // Alex
        reporterId: 1, // John
      },
      {
        title: 'Dashboard performance issues',
        description: 'The dashboard page is loading slowly when there are many items.',
        status: 'open',
        priority: 'medium',
        category: 'performance',
        assigneeId: 3, // Jordan
        reporterId: 1, // John
      },
      {
        title: 'Add export to CSV feature',
        description: 'Users need to be able to export their data to CSV format.',
        status: 'resolved',
        priority: 'low',
        category: 'feature',
        assigneeId: 1, // John
        reporterId: 2, // Alex
      },
      {
        title: 'Security vulnerability in login form',
        description: 'There is a potential XSS vulnerability in the login form.',
        status: 'resolved',
        priority: 'high',
        category: 'security',
        assigneeId: 4, // Casey
        reporterId: 3, // Jordan
      },
      {
        title: 'Improve documentation for API endpoints',
        description: 'The API documentation is outdated and needs to be updated.',
        status: 'closed',
        priority: 'medium',
        category: 'documentation',
        assigneeId: 2, // Alex
        reporterId: 4, // Casey
      }
    ];

    demoIssues.forEach(issue => this.createIssue(issue));

    // Create some notifications
    const demoNotifications: InsertNotification[] = [
      {
        type: 'comment',
        message: 'Alex commented on "Login page issue"',
        read: false,
        userId: 1,
        issueId: 100,
      },
      {
        type: 'status',
        message: 'Issue "Database error" was resolved',
        read: false,
        userId: 1,
        issueId: 101,
      },
      {
        type: 'assignment',
        message: 'You were assigned to "Server outage"',
        read: false,
        userId: 1,
        issueId: 102,
      }
    ];

    demoNotifications.forEach(notification => this.createNotification(notification));
  }
}

export const storage = new MemStorage();
