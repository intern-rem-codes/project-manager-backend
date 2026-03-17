export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: Date;
  street?: string;
  city?: string;
  postalCode?: string;
  country?: string;
}

export interface CreateClientDTO {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: Date;
  street?: string;
  city?: string;
  postalCode?: string;
  country?: string;
}

export interface UpdateClientDTO {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: Date;
  street?: string;
  city?: string;
  postalCode?: string;
  country?: string;
}

export interface DeleteClientDTO {
  id: string;
}
