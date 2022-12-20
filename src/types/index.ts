export interface IUser {
  id?: number;
  name?: string;
  email: string;
  password: string;
  role?: string;
}

export interface IAllergy {
  id: number;
  name: string;
  severity: string;
  symptoms: string[];
  comments: any[];
  image: string;
  highRisk: boolean;
  createdAt: Date;
}
