import * as argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { User } from '../../../domain/auth/entities/user';
import { UserRepository } from '../../../domain/auth/repositories/user_repository';
import { UserRepositoryImpl } from '../../../infrastructure/database/repositories/user_repository_impl';
import { RegisterDto } from '../dtos/register_dto';
import { env } from '../../../config/env';
import { AppError } from '../../../domain/shared/exceptions/app_error';

export class AuthService {
  // ⚠️ EL REPOSITORIO SE CREA CUANDO SE USA, NO EN EL CONSTRUCTOR
  private get userRepo(): UserRepository {
    return new UserRepositoryImpl();
  }

  async register(data: RegisterDto): Promise<{ user: User; token: string }> {
    const existingUser = await this.userRepo.findByEmail(data.email);
    if (existingUser) {
      throw new AppError('El email ya está registrado', 409, 'EMAIL_ALREADY_EXISTS');
    }

    const passwordHash = await argon2.hash(data.password);

    const user = new User();
    user.email = data.email;
    user.passwordHash = passwordHash;
    user.name = data.name;
    user.role = data.role;

    const savedUser = await this.userRepo.save(user);

    const token = jwt.sign(
      { id: savedUser.id, email: savedUser.email, role: savedUser.role },
      env.JWT_ACCESS_SECRET,
      { expiresIn: env.JWT_ACCESS_EXPIRES_IN } as jwt.SignOptions
    );

    return { user: savedUser, token };
  }
}