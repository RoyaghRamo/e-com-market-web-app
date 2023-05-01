export interface Pagination {
  limit?: number;
  page?: number;
  filter?: string;
  sort?: string;
}

export interface CustomResponse {
  success: boolean;
  errors: string[];
}

export interface FetchResponse<T> extends CustomResponse {
  docs: T[];
}

export interface RegisterResponse extends CustomResponse {}

export interface LoginResponse extends CustomResponse {
  token: string;
  userId: number;
}

export interface CreateResponse extends CustomResponse {
  lastInsertedId: number;
}

export interface UpdateResponse extends CustomResponse {
  affected: number;
}

export interface DeleteResponse extends CustomResponse {
  affected: number;
}
