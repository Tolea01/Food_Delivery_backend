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

interface ErrorInterceptorResponse {
  statusCode: number,
  message: string
}

export {
  GeoQueryResult,
  UserData,
  ProductCategoryQueryResult,
  ErrorInterceptorResponse
};