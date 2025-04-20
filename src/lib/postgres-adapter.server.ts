'use server';

import { Pool, PoolClient } from 'pg';
import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';
import { DatabaseInterface } from './database-interface';
import { User, Post, Forum } from "@/app/forum/page";
import { Resource, Subject, Tag } from "@/app/resources/page";
import { Meme, RelaxationTechnique, MusicPlaylist, VideoResource } from "@/app/memes/page";
import { Class, Exam, Event } from "@/app/schedule/page";

export class PostgresDatabase implements DatabaseInterface {
  private pool: Pool;
  private static instance: PostgresDatabase;

  private constructor() {
    this.pool = new Pool({
      host: process.env.POSTGRES_HOST || 'localhost',
      port: parseInt(process.env.POSTGRES_PORT || '5432'),
      database: process.env.POSTGRES_DB || 'collegehub',
      user: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'postgres',
    });

    console.log('PostgreSQL database service initialized');
  }

  public static getInstance(): PostgresDatabase {
    if (!PostgresDatabase.instance) {
      PostgresDatabase.instance = new PostgresDatabase();
    }
    return PostgresDatabase.instance;
  }

  // Helper methods for database operations
  private async executeQuery(query: string, params: any[] = []): Promise<any> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(query, params);
      return result.rows;
    } catch (error) {
      console.error('Error executing query:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  private async executeTransaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Transaction error:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  // Authentication methods
  async getCurrentUser(sessionToken?: string): Promise<User | null> {
    if (!sessionToken) return null;

    try {
      const rows = await this.executeQuery(
        'SELECT * FROM users WHERE id = (SELECT user_id FROM sessions WHERE token = $1 AND expires_at > NOW())',
        [sessionToken]
      );

      if (rows.length === 0) return null;

      const user = rows[0];
      return {
        id: user.id.toString(),
        name: user.name,
        email: user.email,
        avatar: user.avatar_url || null,
        role: user.role,
      };
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  async login(email: string, password: string): Promise<User> {
    try {
      const rows = await this.executeQuery(
        'SELECT * FROM users WHERE email = $1',
        [email.toLowerCase()]
      );

      if (rows.length === 0) {
        throw new Error('Invalid email or password');
      }

      const user = rows[0];
      const passwordValid = await bcrypt.compare(password, user.password_hash);

      if (!passwordValid) {
        throw new Error('Invalid email or password');
      }

      // Create session token
      const token = nanoid(32);
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30); // 30 days expiration

      await this.executeQuery(
        'INSERT INTO sessions (token, user_id, expires_at) VALUES ($1, $2, $3)',
        [token, user.id, expiresAt]
      );

      return {
        id: user.id.toString(),
        name: user.name,
        email: user.email,
        avatar: user.avatar_url || null,
        role: user.role,
        sessionToken: token,
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async loginWithCollegeId(collegeId: string, pin: string): Promise<User> {
    try {
      const rows = await this.executeQuery(
        'SELECT * FROM users WHERE college_id = $1',
        [collegeId]
      );

      if (rows.length === 0) {
        throw new Error('Invalid college ID or PIN');
      }

      const user = rows[0];
      const pinValid = await bcrypt.compare(pin, user.pin_hash);

      if (!pinValid) {
        throw new Error('Invalid college ID or PIN');
      }

      // Create session token
      const token = nanoid(32);
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30); // 30 days expiration

      await this.executeQuery(
        'INSERT INTO sessions (token, user_id, expires_at) VALUES ($1, $2, $3)',
        [token, user.id, expiresAt]
      );

      return {
        id: user.id.toString(),
        name: user.name,
        email: user.email,
        avatar: user.avatar_url || null,
        role: user.role,
        sessionToken: token,
      };
    } catch (error) {
      console.error('Login with college ID error:', error);
      throw error;
    }
  }

  async register(name: string, email: string, password: string): Promise<User> {
    try {
      // Check if email already exists
      const existingUsers = await this.executeQuery(
        'SELECT * FROM users WHERE email = $1',
        [email.toLowerCase()]
      );

      if (existingUsers.length > 0) {
        throw new Error('Email already in use');
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);

      // Create user
      const result = await this.executeQuery(
        'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING *',
        [name, email.toLowerCase(), passwordHash, 'user']
      );

      const user = result[0];

      // Create session token
      const token = nanoid(32);
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30); // 30 days expiration

      await this.executeQuery(
        'INSERT INTO sessions (token, user_id, expires_at) VALUES ($1, $2, $3)',
        [token, user.id, expiresAt]
      );

      return {
        id: user.id.toString(),
        name: user.name,
        email: user.email,
        avatar: user.avatar_url || null,
        role: user.role,
        sessionToken: token,
      };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async logout(sessionToken: string): Promise<void> {
    try {
      await this.executeQuery(
        'DELETE FROM sessions WHERE token = $1',
        [sessionToken]
      );
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  async resetPassword(email: string): Promise<void> {
    // In a real implementation, this would send a reset email
    throw new Error('Method not implemented');
  }

  // User management methods
  async getUserById(userId: string): Promise<User | null> {
    try {
      const rows = await this.executeQuery(
        'SELECT * FROM users WHERE id = $1',
        [userId]
      );

      if (rows.length === 0) return null;

      const user = rows[0];
      return {
        id: user.id.toString(),
        name: user.name,
        email: user.email,
        avatar: user.avatar_url || null,
        role: user.role,
      };
    } catch (error) {
      console.error('Error getting user by ID:', error);
      return null;
    }
  }

  async updateUserProfile(userId: string, data: Partial<User>): Promise<User> {
    try {
      let query = 'UPDATE users SET ';
      const params: any[] = [];
      const updates: string[] = [];

      if (data.name) {
        updates.push(`name = $${params.length + 1}`);
        params.push(data.name);
      }

      if (data.email) {
        updates.push(`email = $${params.length + 1}`);
        params.push(data.email.toLowerCase());
      }

      if (data.avatar) {
        updates.push(`avatar_url = $${params.length + 1}`);
        params.push(data.avatar);
      }

      if (updates.length === 0) {
        throw new Error('No fields to update');
      }

      query += updates.join(', ') + ` WHERE id = $${params.length + 1} RETURNING *`;
      params.push(userId);

      const rows = await this.executeQuery(query, params);

      if (rows.length === 0) {
        throw new Error('User not found');
      }

      const user = rows[0];
      return {
        id: user.id.toString(),
        name: user.name,
        email: user.email,
        avatar: user.avatar_url || null,
        role: user.role,
      };
    } catch (error) {
      console.error('Update user profile error:', error);
      throw error;
    }
  }

  async setUserRole(userId: string, role: 'user' | 'moderator' | 'admin' | 'owner'): Promise<User> {
    try {
      const rows = await this.executeQuery(
        'UPDATE users SET role = $1 WHERE id = $2 RETURNING *',
        [role, userId]
      );

      if (rows.length === 0) {
        throw new Error('User not found');
      }

      const user = rows[0];
      return {
        id: user.id.toString(),
        name: user.name,
        email: user.email,
        avatar: user.avatar_url || null,
        role: user.role,
      };
    } catch (error) {
      console.error('Set user role error:', error);
      throw error;
    }
  }

  // Forum methods - basic implementation
  async getForums(filters?: any): Promise<Forum[]> {
    // Basic implementation
    let query = 'SELECT * FROM forums';
    const params: any[] = [];

    // Add filtering logic here if needed

    const rows = await this.executeQuery(query, params);
    return rows.map((row: any) => ({
      id: row.id.toString(),
      name: row.name,
      description: row.description,
      category: row.category,
      creatorId: row.creator_id.toString(),
      isPublic: row.is_public,
      memberCount: row.member_count,
      postCount: row.post_count,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));
  }

  // Implement other methods from the interface with minimal functionality
  // for this guide we're focusing on authentication and user management

  // Placeholder implementations for required methods
  async getForumById(forumId: string): Promise<Forum | null> { return null; }
  async createForum(data: any): Promise<Forum> { throw new Error('Not implemented'); }
  async updateForum(forumId: string, data: any): Promise<Forum> { throw new Error('Not implemented'); }
  async deleteForum(forumId: string): Promise<void> {}
  async getPosts(filters?: any): Promise<Post[]> { return []; }
  async getPostById(postId: string): Promise<Post | null> { return null; }
  async createPost(data: any): Promise<Post> { throw new Error('Not implemented'); }
  async updatePost(postId: string, data: any): Promise<Post> { throw new Error('Not implemented'); }
  async deletePost(postId: string): Promise<void> {}
  async likePost(postId: string, userId: string): Promise<void> {}
  async getResources(filters?: any): Promise<Resource[]> { return []; }
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
  async getMemes(filters?: any): Promise<Meme[]> { return []; }
  async createMeme(data: any): Promise<Meme> { throw new Error('Not implemented'); }
  async deleteMeme(memeId: string): Promise<void> {}
  async getRelaxationTechniques(): Promise<RelaxationTechnique[]> { return []; }
  async createRelaxationTechnique(data: any): Promise<RelaxationTechnique> { throw new Error('Not implemented'); }
  async getMusicPlaylists(filters?: any): Promise<MusicPlaylist[]> { return []; }
  async createMusicPlaylist(data: any): Promise<MusicPlaylist> { throw new Error('Not implemented'); }
  async getVideoResources(filters?: any): Promise<VideoResource[]> { return []; }
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
  async getEvents(filters?: any): Promise<Event[]> { return []; }
  async getEventById(eventId: string): Promise<Event | null> { return null; }
  async createEvent(data: any): Promise<Event> { throw new Error('Not implemented'); }
  async updateEvent(eventId: string, data: any): Promise<Event> { throw new Error('Not implemented'); }
  async deleteEvent(eventId: string): Promise<void> {}
}

// Function to get the database instance
export function getPostgresDatabase(): DatabaseInterface {
  return PostgresDatabase.getInstance();
}
