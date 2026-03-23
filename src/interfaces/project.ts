export interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  deadline: string | null;
  client_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateProjectDTO {
  name: string;
  description: string;
  deadline: string;
  client_id: string;
  status?: string;
}

export interface UpdateProjectDTO {
  name?: string;
  description?: string;
  deadline?: string;
  client_id?: string;
  status?: string;
}
export interface DeleteProjectDTO {
  id: string;
  name: string;
  description: string;
  status: string;
  deadline: string | null;
  client_id: string;
  created_at: string;
  updated_at: string;
}
