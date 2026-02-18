export type ClientType = "FISICA" | "MORAL";

export interface Client {
  id: number;
  type: string;
  name: string;
  lastName: string;
  phone: string;
  email: string;
  rfc: string;
  password?: string;
  confirmPassword?: string;
  address: {
    state: string;
    city: string;
    colony: string;
    postalCode: string;
    street: string;
    extNumber: string;
    intNumber: string;
  };
}