import { Repository } from 'typeorm';
import { AppDataSource } from '../../../config/database';
import { UserEntity } from '../entities/user_entity';
import { UserRepository } from '../../../domain/auth/repositories/user_repository';
import { User } from '../../../domain/auth/entities/user';

export class UserRepositoryImpl implements UserRepository {
  private get repo(): Repository<UserEntity> {
    return AppDataSource.getRepository(UserEntity);
  }

  private toDomain(entity: UserEntity): User {
    const user = new User();
    user.id = entity.id;
    user.email = entity.email;
    user.passwordHash = entity.passwordHash;
    user.name = entity.name;
    user.role = entity.role as 'patient' | 'nutritionist';
    user.createdAt = entity.createdAt;
    user.updatedAt = entity.updatedAt;
    user.deletedAt = entity.deletedAt;
    return user;
  }

  private toEntity(domain: User): UserEntity {
    const entity = new UserEntity();
    entity.id = domain.id;
    entity.email = domain.email;
    entity.passwordHash = domain.passwordHash;
    entity.name = domain.name;
    entity.role = domain.role;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    entity.deletedAt = domain.deletedAt;
    return entity;
  }

  async findByEmail(email: string): Promise<User | null> {
    const entity = await this.repo.findOne({ where: { email } });
    return entity ? this.toDomain(entity) : null;
  }

  async findById(id: string): Promise<User | null> {
    const entity = await this.repo.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async save(user: User): Promise<User> {
    const entity = this.toEntity(user);
    const saved = await this.repo.save(entity);
    return this.toDomain(saved);
  }

  async softDelete(id: string): Promise<void> {
    await this.repo.update(id, { deletedAt: new Date() });
  }
}