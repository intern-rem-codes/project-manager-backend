export interface FileMetadata {
  id: string;
  project_id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  uploaded_by: string;
  uploaded_at: string;
  data_url?: string; // Base64 encoded file data
}
