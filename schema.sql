CREATE TABLE IF NOT EXISTS wallpapers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  resolution TEXT NOT NULL,
  size TEXT NOT NULL,
  description TEXT NOT NULL,
  colors TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS blog_posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  category_color TEXT NOT NULL,
  date TEXT NOT NULL,
  read_time TEXT NOT NULL,
  author TEXT NOT NULL,
  image_url TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);
