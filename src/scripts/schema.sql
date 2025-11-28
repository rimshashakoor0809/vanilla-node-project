

-- extensions

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- users table
CREATE TABLE IF NOT EXISTS users(
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name VARCHAR(60) NOT NULL,
  last_name VARCHAR(60) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255),
  google_id VARCHAR(255) UNIQUE, 
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- notes table
CREATE TABLE IF NOT EXISTS notes(
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content TEXT,
  user_id UUID NOT NULL, 
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT fk_note_users
  FOREIGN KEY (user_id)
  REFERENCES users(id)
  ON DELETE CASCADE
);

-- attachments table
CREATE TABLE IF NOT EXISTS attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  note_id UUID NOT NULL,
  user_id UUID NOT NULL,

  file_name VARCHAR(255) NOT NULL, 
  file_key VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_size BIGINT,
  mime_type VARCHAR(255),
  uploaded_at  TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT fk_attachment_note 
  FOREIGN KEY (note_id)
  REFERENCES notes(id)
  ON DELETE CASCADE,

  CONSTRAINT fk_attachment_user
  FOREIGN KEY (user_id)
  REFERENCES users(id)
  ON DELETE CASCADE

);