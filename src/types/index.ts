export interface ProjectPhase {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  order: number;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  category: string;
  year: string;
  description: string;
  coverImage: string;
  phases: ProjectPhase[];
  tags: string[];
  featured: boolean;
  createdAt: number;
}

export interface AdminUser {
  authenticated: boolean;
}