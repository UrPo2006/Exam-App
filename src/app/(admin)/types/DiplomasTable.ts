
export interface IDiplomaApiResponse {
  status: boolean;
  code: number;
  payload: IDiplomaPayload;
}
export interface IDiplomaPayload {
  data: IDiplomaItem[];
  metadata: IDiplomaMetadata;
}
export interface IDiplomaMetadata {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
export interface IDiplomaItem {
  id: string;
  title: string;
  description: string;
  image: string;
  immutable: boolean;
  createdAt: string;
  updatedAt: string;
}
 