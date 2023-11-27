interface GeoQueryResult {
  id: number;
  name?: string;
}

interface UserData {
  id: number;
  username: string;
  role: string;
}

interface PaginatorConfig {
  page: number;
  limit: number;
  sortOrder: string;
  sortColumn: string;
}

interface ProductCategoryQueryResult extends GeoQueryResult {}

export { GeoQueryResult, UserData, ProductCategoryQueryResult, PaginatorConfig };
