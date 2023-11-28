import { UserRole } from '@user/entities/user-role.enum';
import { Equal } from 'typeorm';

export default class UserFiltersBuilder {
  private readonly filters: any = {};

  constructor(filters: any) {
    if (filters && filters.username && filters.username.length) {
      this.filters.username = Equal(filters.username);
    }

    if (
      filters &&
      filters.role &&
      filters.role.length &&
      Object.values(UserRole).includes(filters.role)
    ) {
      this.filters.role = filters.role;
    }
  }

  public get() {
    return this.filters;
  }
}
