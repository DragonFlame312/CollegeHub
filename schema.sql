-- CollegeHub Database Schema
-- PostgreSQL version

-- Drop tables if they exist to ensure a clean setup
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS post_likes;
DROP TABLE IF EXISTS resource_bookmarks;
DROP TABLE IF EXISTS meme_likes;
DROP TABLE IF EXISTS playlist_likes;
DROP TABLE IF EXISTS post_tags;
DROP TABLE IF EXISTS resource_tags;
DROP TABLE IF EXISTS meme_tags;
DROP TABLE IF EXISTS playlist_tags;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS forums;
DROP TABLE IF EXISTS resources;
DROP TABLE IF EXISTS memes;
DROP TABLE IF EXISTS relaxation_techniques;
DROP TABLE IF EXISTS music_playlists;
DROP TABLE IF EXISTS video_resources;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS exams;
DROP TABLE IF EXISTS classes;
DROP TABLE IF EXISTS subjects;
DROP TABLE IF EXISTS users;

-- Create tables for CollegeHub application

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    college_id VARCHAR(50) UNIQUE,
    pin_hash VARCHAR(255),
    avatar_url VARCHAR(255),
    role VARCHAR(20) NOT NULL DEFAULT 'user', -- 'user', 'moderator', 'admin', 'owner'
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Sessions table for authentication
CREATE TABLE sessions (
    token VARCHAR(255) PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Subjects table
CREATE TABLE subjects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50),
    department VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tags table
CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    resource_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Forums table
CREATE TABLE forums (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    creator_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category VARCHAR(100) NOT NULL,
    is_public BOOLEAN NOT NULL DEFAULT TRUE,
    member_count INT NOT NULL DEFAULT 0,
    post_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Posts table
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    forum_id INT NOT NULL REFERENCES forums(id) ON DELETE CASCADE,
    is_anonymous BOOLEAN NOT NULL DEFAULT FALSE,
    likes INT NOT NULL DEFAULT 0,
    replies INT NOT NULL DEFAULT 0,
    views INT NOT NULL DEFAULT 0,
    is_hot BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Comments table
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    author_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id INT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    is_anonymous BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Post likes table
CREATE TABLE post_likes (
    id SERIAL PRIMARY KEY,
    post_id INT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(post_id, user_id)
);

-- Post tags table
CREATE TABLE post_tags (
    post_id INT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    tag_id INT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, tag_id)
);

-- Resources table
CREATE TABLE resources (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(20) NOT NULL, -- 'note', 'cheatsheet', 'link'
    subject_id INT REFERENCES subjects(id) ON DELETE SET NULL,
    file_url VARCHAR(255),
    external_url VARCHAR(255),
    author_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    is_public BOOLEAN NOT NULL DEFAULT TRUE,
    downloads INT NOT NULL DEFAULT 0,
    views INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Resource bookmarks table
CREATE TABLE resource_bookmarks (
    id SERIAL PRIMARY KEY,
    resource_id INT NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(resource_id, user_id)
);

-- Resource tags table
CREATE TABLE resource_tags (
    resource_id INT NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
    tag_id INT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (resource_id, tag_id)
);

-- Memes table
CREATE TABLE memes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    author_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    is_anonymous BOOLEAN NOT NULL DEFAULT FALSE,
    likes INT NOT NULL DEFAULT 0,
    comments INT NOT NULL DEFAULT 0,
    views INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Meme likes table
CREATE TABLE meme_likes (
    id SERIAL PRIMARY KEY,
    meme_id INT NOT NULL REFERENCES memes(id) ON DELETE CASCADE,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(meme_id, user_id)
);

-- Meme tags table
CREATE TABLE meme_tags (
    meme_id INT NOT NULL REFERENCES memes(id) ON DELETE CASCADE,
    tag_id INT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (meme_id, tag_id)
);

-- Relaxation techniques table
CREATE TABLE relaxation_techniques (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content TEXT NOT NULL,
    author_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    difficulty VARCHAR(20) NOT NULL, -- 'easy', 'medium', 'hard'
    duration INT NOT NULL, -- in minutes
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Music playlists table
CREATE TABLE music_playlists (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    external_url VARCHAR(255) NOT NULL,
    platform VARCHAR(20) NOT NULL, -- 'spotify', 'youtube', 'apple_music', 'other'
    author_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    likes INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Playlist likes table
CREATE TABLE playlist_likes (
    id SERIAL PRIMARY KEY,
    playlist_id INT NOT NULL REFERENCES music_playlists(id) ON DELETE CASCADE,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(playlist_id, user_id)
);

-- Playlist tags table
CREATE TABLE playlist_tags (
    playlist_id INT NOT NULL REFERENCES music_playlists(id) ON DELETE CASCADE,
    tag_id INT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (playlist_id, tag_id)
);

-- Video resources table
CREATE TABLE video_resources (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    thumbnail_url VARCHAR(255),
    external_url VARCHAR(255) NOT NULL,
    platform VARCHAR(20) NOT NULL, -- 'youtube', 'tiktok', 'vimeo', 'other'
    author_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    duration INT, -- in seconds
    likes INT NOT NULL DEFAULT 0,
    views INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Classes table
CREATE TABLE classes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    course_code VARCHAR(50) NOT NULL,
    instructor VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    days_of_week VARCHAR(255) NOT NULL, -- Stored as comma-separated values, e.g., 'Monday,Wednesday'
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    color VARCHAR(20),
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Exams table
CREATE TABLE exams (
    id SERIAL PRIMARY KEY,
    course_id INT REFERENCES classes(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    location VARCHAR(255) NOT NULL,
    format VARCHAR(100) NOT NULL,
    notes TEXT,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Events table
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    organizer VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255),
    is_public BOOLEAN NOT NULL DEFAULT TRUE,
    category VARCHAR(100) NOT NULL,
    created_by INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_posts_forum_id ON posts(forum_id);
CREATE INDEX idx_posts_author_id ON posts(author_id);
CREATE INDEX idx_resources_author_id ON resources(author_id);
CREATE INDEX idx_resources_subject_id ON resources(subject_id);
CREATE INDEX idx_resources_type ON resources(type);
CREATE INDEX idx_memes_author_id ON memes(author_id);
CREATE INDEX idx_classes_user_id ON classes(user_id);
CREATE INDEX idx_exams_user_id ON exams(user_id);
CREATE INDEX idx_events_start_date ON events(start_date);
CREATE INDEX idx_events_category ON events(category);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables with updated_at column
CREATE TRIGGER update_user_modtime BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_forum_modtime BEFORE UPDATE ON forums FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_post_modtime BEFORE UPDATE ON posts FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_comment_modtime BEFORE UPDATE ON comments FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_resource_modtime BEFORE UPDATE ON resources FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_class_modtime BEFORE UPDATE ON classes FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_exam_modtime BEFORE UPDATE ON exams FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_event_modtime BEFORE UPDATE ON events FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

-- Insert some default data
INSERT INTO subjects (name, code, department) VALUES
('Mathematics', 'MATH', 'Department of Mathematics'),
('Computer Science', 'CS', 'Department of Computer Science'),
('Physics', 'PHYS', 'Department of Physics'),
('English', 'ENGL', 'Department of English'),
('Psychology', 'PSYC', 'Department of Psychology'),
('Chemistry', 'CHEM', 'Department of Chemistry'),
('Biology', 'BIO', 'Department of Biology'),
('History', 'HIST', 'Department of History'),
('Economics', 'ECON', 'Department of Economics'),
('Engineering', 'ENG', 'School of Engineering');

INSERT INTO tags (name) VALUES
('math'),
('programming'),
('physics'),
('writing'),
('psychology'),
('chemistry'),
('biology'),
('history'),
('economics'),
('engineering'),
('exams'),
('tutorials'),
('homework'),
('projects'),
('study'),
('resources'),
('notes'),
('cheatsheets'),
('memes'),
('events');

-- Add sample data as needed for testing
-- Add an admin user with password 'admin123'
INSERT INTO users (name, email, password_hash, role) VALUES
('Admin', 'admin@collegehub.com', '$2a$10$dSCFRyhCzn52jMlXoOrC1eGVekimcxU8nhyYiQHJf9O9cQgwV8Vtu', 'owner');
