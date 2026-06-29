export class User {
  id!: string;
  email!: string;
  passwordHash!: string;
  name!: string;
  role!: 'patient' | 'nutritionist';
  createdAt!: Date;
  updatedAt!: Date;
  deletedAt?: Date;
}