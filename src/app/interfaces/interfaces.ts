interface GeoQueryResult {
  id: number,
  name?: string
}

interface UserData {
  id: number,
  username: string,
  role: string
}

interface ProductCategoryQueryResult extends GeoQueryResult {
}

export {
  GeoQueryResult,
  UserData,
  ProductCategoryQueryResult
};