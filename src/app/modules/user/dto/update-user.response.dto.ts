import { Expose } from 'class-transformer';

@Expose()
export class UpdateUserResponseDto {
  username?: string | undefined;
  password?: string | undefined;
  role?: string | undefined;
}
