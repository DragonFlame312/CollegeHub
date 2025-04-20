import { User, Post, Forum } from "@/app/forum/page";
import { Resource, Subject, Tag } from "@/app/resources/page";
import { Meme, RelaxationTechnique, MusicPlaylist, VideoResource } from "@/app/memes/page";
import { Class, Exam, Event } from "@/app/schedule/page";
import { nanoid } from 'nanoid';
import bcrypt from 'bcryptjs';

// We'll dynamically import PostgreSQL adapter only on the server side
// This avoids the 'dns' module error in browser environments

/**
 * Database interface that defines all operations available in the application.
 * This will be implemented by specific database providers (PostgreSQL, MySQL, Firebase, etc.)
 */
export interface DatabaseInterface {
  // Authentication
  getCurrentUser(sessionToken?: string): Promise<User | null>;
  login(email: string, password: string): Promise<User>;
  loginWithCollegeId(collegeId: string, pin: string): Promise<User>;
  register(name: string, email: string, password: string): Promise<User>;
  logout(sessionToken: string): Promise<void>;
  resetPassword(email: string): Promise<void>;

  // User Management
  getUserById(userId: string): Promise<User | null>;
  updateUserProfile(userId: string, data: Partial<User>): Promise<User>;
  setUserRole(userId: string, role: 'user' | 'moderator' | 'admin' | 'owner'): Promise<User>;

  // Forum
  getForums(filters?: ForumFilters): Promise<Forum[]>;
  getForumById(forumId: string): Promise<Forum | null>;
  createForum(data: Omit<Forum, 'id' | 'createdAt' | 'updatedAt' | 'memberCount' | 'postCount'>): Promise<Forum>;
  updateForum(forumId: string, data: Partial<Forum>): Promise<Forum>;
  deleteForum(forumId: string): Promise<void>;

  // Posts
  getPosts(filters?: PostFilters): Promise<Post[]>;
  getPostById(postId: string): Promise<Post | null>;
  createPost(data: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'likes' | 'replies' | 'views'>): Promise<Post>;
  updatePost(postId: string, data: Partial<Post>): Promise<Post>;
  deletePost(postId: string): Promise<void>;
  likePost(postId: string, userId: string): Promise<void>;

  // Resources
  getResources(filters?: ResourceFilters): Promise<Resource[]>;
  getResourceById(resourceId: string): Promise<Resource | null>;
  createResource(data: Omit<Resource, 'id' | 'createdAt' | 'updatedAt' | 'downloads' | 'views'>): Promise<Resource>;
  updateResource(resourceId: string, data: Partial<Resource>): Promise<Resource>;
  deleteResource(resourceId: string): Promise<void>;
  incrementResourceDownloads(resourceId: string): Promise<void>;
  bookmarkResource(resourceId: string, userId: string): Promise<void>;
  getBookmarkedResources(userId: string): Promise<Resource[]>;

  // Subjects
  getSubjects(): Promise<Subject[]>;
  createSubject(data: Omit<Subject, 'id'>): Promise<Subject>;

  // Tags
  getPopularTags(limit?: number): Promise<Tag[]>;
  createTag(name: string): Promise<Tag>;

  // Memes & Entertainment
  getMemes(filters?: MemeFilters): Promise<Meme[]>;
  createMeme(data: Omit<Meme, 'id' | 'createdAt' | 'likes' | 'comments' | 'views'>): Promise<Meme>;
  deleteMeme(memeId: string): Promise<void>;

  getRelaxationTechniques(): Promise<RelaxationTechnique[]>;
  createRelaxationTechnique(data: Omit<RelaxationTechnique, 'id' | 'createdAt'>): Promise<RelaxationTechnique>;

  getMusicPlaylists(filters?: PlaylistFilters): Promise<MusicPlaylist[]>;
  createMusicPlaylist(data: Omit<MusicPlaylist, 'id' | 'createdAt' | 'likes'>): Promise<MusicPlaylist>;

  getVideoResources(filters?: VideoFilters): Promise<VideoResource[]>;
  createVideoResource(data: Omit<VideoResource, 'id' | 'createdAt' | 'likes' | 'views'>): Promise<VideoResource>;

  // Schedule
  getClasses(userId: string): Promise<Class[]>;
  getClassById(classId: string): Promise<Class | null>;
  createClass(data: Omit<Class, 'id'>): Promise<Class>;
  updateClass(classId: string, data: Partial<Class>): Promise<Class>;
  deleteClass(classId: string): Promise<void>;

  getExams(userId: string): Promise<Exam[]>;
  createExam(data: Omit<Exam, 'id'>): Promise<Exam>;
  updateExam(examId: string, data: Partial<Exam>): Promise<Exam>;
  deleteExam(examId: string): Promise<void>;

  getEvents(filters?: EventFilters): Promise<Event[]>;
  getEventById(eventId: string): Promise<Event | null>;
  createEvent(data: Omit<Event, 'id' | 'createdAt'>): Promise<Event>;
  updateEvent(eventId: string, data: Partial<Event>): Promise<Event>;
  deleteEvent(eventId: string): Promise<void>;
}

// Filter types for search and queries
export type ForumFilters = {
  category?: string;
  isPublic?: boolean;
  creatorId?: string;
  search?: string;
};

export type PostFilters = {
  forumId?: string;
  authorId?: string;
  category?: string;
  isHot?: boolean;
  tags?: string[];
  search?: string;
};

export type ResourceFilters = {
  type?: 'note' | 'cheatsheet' | 'link';
  subject?: string;
  authorId?: string;
  isPublic?: boolean;
  tags?: string[];
  search?: string;
};

export type MemeFilters = {
  authorId?: string;
  tags?: string[];
  search?: string;
};

export type PlaylistFilters = {
  platform?: 'spotify' | 'youtube' | 'apple_music' | 'other';
  tags?: string[];
  search?: string;
};

export type VideoFilters = {
  platform?: 'youtube' | 'tiktok' | 'vimeo' | 'other';
  search?: string;
};

export type EventFilters = {
  startDate?: string;
  endDate?: string;
  category?: string;
  isPublic?: boolean;
  search?: string;
};

// Mock database service with functional authentication for testing
export class DatabaseService implements DatabaseInterface {
  private static instance: DatabaseService;

  // Mock storage
  private users: Record<string, any> = {};
  private sessions: Record<string, any> = {};

  private constructor() {
    // Initialize with test users
    this.initializeTestUsers();
    console.log('Mock database service initialized');
  }

  private async initializeTestUsers() {
    // Add admin user
    const adminId = '1';
    const adminPasswordHash = await bcrypt.hash('admin123', 10);
    this.users[adminId] = {
      id: adminId,
      name: 'Admin',
      email: 'admin@collegehub.com',
      password_hash: adminPasswordHash,
      role: 'owner',
      avatar_url: null
    };

    // Add student user
    const studentId = '2';
    const studentPasswordHash = await bcrypt.hash('password123', 10);
    const pinHash = await bcrypt.hash('1234', 10);
    this.users[studentId] = {
      id: studentId,
      name: 'Test Student',
      email: 'student@example.com',
      password_hash: studentPasswordHash,
      college_id: 'STU123',
      pin_hash: pinHash,
      role: 'user',
      avatar_url: null
    };
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  async getCurrentUser(sessionToken?: string): Promise<User | null> {
    if (!sessionToken || !this.sessions[sessionToken]) {
      return null;
    }

    const session = this.sessions[sessionToken];

    // Check if session has expired
    if (new Date() > new Date(session.expires_at)) {
      delete this.sessions[sessionToken];
      return null;
    }

    const userId = session.user_id;
    const user = this.users[userId];

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar_url,
      role: user.role,
    };
  }

  async login(email: string, password: string): Promise<User> {
    // Find user by email
    const userEntry = Object.values(this.users).find(
      (u: any) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (!userEntry) {
      throw new Error('Invalid email or password');
    }

    // Check password
    const passwordValid = await bcrypt.compare(password, userEntry.password_hash);
    if (!passwordValid) {
      throw new Error('Invalid email or password');
    }

    // Create session
    const token = nanoid(32);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 days expiration

    this.sessions[token] = {
      token,
      user_id: userEntry.id,
      expires_at: expiresAt.toISOString(),
      created_at: new Date().toISOString()
    };

    return {
      id: userEntry.id,
      name: userEntry.name,
      email: userEntry.email,
      avatar: userEntry.avatar_url,
      role: userEntry.role,
      sessionToken: token,
    };
  }

  async loginWithCollegeId(collegeId: string, pin: string): Promise<User> {
    // Find user by college ID
    const userEntry = Object.values(this.users).find(
      (u: any) => u.college_id === collegeId
    );

    if (!userEntry) {
      throw new Error('Invalid college ID or PIN');
    }

    // Check PIN
    const pinValid = await bcrypt.compare(pin, userEntry.pin_hash);
    if (!pinValid) {
      throw new Error('Invalid college ID or PIN');
    }

    // Create session
    const token = nanoid(32);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    this.sessions[token] = {
      token,
      user_id: userEntry.id,
      expires_at: expiresAt.toISOString(),
      created_at: new Date().toISOString()
    };

    return {
      id: userEntry.id,
      name: userEntry.name,
      email: userEntry.email,
      avatar: userEntry.avatar_url,
      role: userEntry.role,
      sessionToken: token,
    };
  }

  async register(name: string, email: string, password: string): Promise<User> {
    // Check if email already exists
    const existingUser = Object.values(this.users).find(
      (u: any) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (existingUser) {
      throw new Error('Email already in use');
    }

    // Generate ID and hash password
    const id = (Object.keys(this.users).length + 1).toString();
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    this.users[id] = {
      id,
      name,
      email: email.toLowerCase(),
      password_hash: passwordHash,
      role: 'user',
      avatar_url: null
    };

    // Create session
    const token = nanoid(32);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    this.sessions[token] = {
      token,
      user_id: id,
      expires_at: expiresAt.toISOString(),
      created_at: new Date().toISOString()
    };

    return {
      id,
      name,
      email,
      avatar: null,
      role: 'user',
      sessionToken: token,
    };
  }

  async logout(sessionToken: string): Promise<void> {
    delete this.sessions[sessionToken];
  }

  async resetPassword(email: string): Promise<void> {
    throw new Error('Method not implemented in mock service');
  }

  async getUserById(userId: string): Promise<User | null> {
    const user = this.users[userId];
    if (!user) return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar_url,
      role: user.role,
    };
  }

  async updateUserProfile(userId: string, data: Partial<User>): Promise<User> {
    const user = this.users[userId];
    if (!user) {
      throw new Error('User not found');
    }

    if (data.name) user.name = data.name;
    if (data.email) user.email = data.email.toLowerCase();
    if (data.avatar) user.avatar_url = data.avatar;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar_url,
      role: user.role,
    };
  }

  async setUserRole(userId: string, role: 'user' | 'moderator' | 'admin' | 'owner'): Promise<User> {
    const user = this.users[userId];
    if (!user) {
      throw new Error('User not found');
    }

    user.role = role;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar_url,
      role: user.role,
    };
  }

  // Placeholder implementations for required methods
  async getForums(filters?: ForumFilters): Promise<Forum[]> { return []; }
  async getForumById(forumId: string): Promise<Forum | null> { return null; }
  async createForum(data: any): Promise<Forum> { throw new Error('Not implemented'); }
  async updateForum(forumId: string, data: any): Promise<Forum> { throw new Error('Not implemented'); }
  async deleteForum(forumId: string): Promise<void> {}
  async getPosts(filters?: PostFilters): Promise<Post[]> { return []; }
  async getPostById(postId: string): Promise<Post | null> { return null; }
  async createPost(data: any): Promise<Post> { throw new Error('Not implemented'); }
  async updatePost(postId: string, data: any): Promise<Post> { throw new Error('Not implemented'); }
  async deletePost(postId: string): Promise<void> {}
  async likePost(postId: string, userId: string): Promise<void> {}
  async getResources(filters?: ResourceFilters): Promise<Resource[]> { return []; }
  async getResourceById(resourceId: string): Promise<Resource | null> { return null; }
  async createResource(data: any): Promise<Resource> { throw new Error('Not implemented'); }
  async updateResource(resourceId: string, data: any): Promise<Resource> { throw new Error('Not implemented'); }
  async deleteResource(resourceId: string): Promise<void> {}
  async incrementResourceDownloads(resourceId: string): Promise<void> {}
  async bookmarkResource(resourceId: string, userId: string): Promise<void> {}
  async getBookmarkedResources(userId: string): Promise<Resource[]> { return []; }
  async getSubjects(): Promise<Subject[]> { return []; }
  async createSubject(data: any): Promise<Subject> { throw new Error('Not implemented'); }
  async getPopularTags(limit?: number): Promise<Tag[]> { return []; }
  async createTag(name: string): Promise<Tag> { throw new Error('Not implemented'); }
  async getMemes(filters?: MemeFilters): Promise<Meme[]> { return []; }
  async createMeme(data: any): Promise<Meme> { throw new Error('Not implemented'); }
  async deleteMeme(memeId: string): Promise<void> {}
  async getRelaxationTechniques(): Promise<RelaxationTechnique[]> { return []; }
  async createRelaxationTechnique(data: any): Promise<RelaxationTechnique> { throw new Error('Not implemented'); }
  async getMusicPlaylists(filters?: PlaylistFilters): Promise<MusicPlaylist[]> { return []; }
  async createMusicPlaylist(data: any): Promise<MusicPlaylist> { throw new Error('Not implemented'); }
  async getVideoResources(filters?: VideoFilters): Promise<VideoResource[]> { return []; }
  async createVideoResource(data: any): Promise<VideoResource> { throw new Error('Not implemented'); }
  async getClasses(userId: string): Promise<Class[]> { return []; }
  async getClassById(classId: string): Promise<Class | null> { return null; }
  async createClass(data: any): Promise<Class> { throw new Error('Not implemented'); }
  async updateClass(classId: string, data: any): Promise<Class> { throw new Error('Not implemented'); }
  async deleteClass(classId: string): Promise<void> {}
  async getExams(userId: string): Promise<Exam[]> { return []; }
  async createExam(data: any): Promise<Exam> { throw new Error('Not implemented'); }
  async updateExam(examId: string, data: any): Promise<Exam> { throw new Error('Not implemented'); }
  async deleteExam(examId: string): Promise<void> {}
  async getEvents(filters?: EventFilters): Promise<Event[]> { return []; }
  async getEventById(eventId: string): Promise<Event | null> { return null; }
  async createEvent(data: any): Promise<Event> { throw new Error('Not implemented'); }
  async updateEvent(eventId: string, data: any): Promise<Event> { throw new Error('Not implemented'); }
  async deleteEvent(eventId: string): Promise<void> {}
}

// Get the database service singleton - always use the mock version for now
// to avoid server-side PostgreSQL issues
export const getDatabase = (): DatabaseInterface => {
  return DatabaseService.getInstance();
};
