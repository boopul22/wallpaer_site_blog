export interface Wallpaper {
  id: string;
  slug: string;
  title: string;
  category: string;
  imageUrl: string;
  resolution: string;
  size: string;
  description: string;
  colors: string[];
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  category: string;
  categoryColor: string; // Tailwind color class mostly
  date: string;
  readTime: string;
  author: string;
  imageUrl: string;
  excerpt: string;
  content: string[]; // Array of paragraphs for simplicity
}