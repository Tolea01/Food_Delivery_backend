import { Exclude, Expose } from 'class-transformer';
import { UserRole } from '@user/entities/user-role.enum';

@Expose()
export class UserItemDto {
  id: number;

  username: string;

  @Exclude()
  password: string;

  role: UserRole;
}
