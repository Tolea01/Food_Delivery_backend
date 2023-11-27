import { Like } from 'typeorm';

export default class UserFiltersBuilder {
  private readonly filters: any = {};

  constructor(filters: any) {
    if (filters && filters.username && filters.username.length) {
      this.filters.username = Like(`%${filters.username}%`);
    }

    if (filters && filters.role && filters.role.length) {
      this.filters.role = Like(`%${filters.role}%`);
    }
  }

  public get() {
    return this.filters;
  }
}
