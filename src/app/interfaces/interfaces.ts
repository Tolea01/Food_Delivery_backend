import { Region } from "../modules/geo/region/entities/region.entity";
import { Country } from "../modules/geo/country/entities/country.entity";

interface GeoQueryResult {
  id: number,
  name?: string
}

interface UserData {
  id: number,
  username: string,
  role: string
}

interface UpdatedCountryFields {
  name_en?: string;
  name_ro?: string;
  name_ru?: string;
}

interface UpdatedLocationFields extends UpdatedCountryFields {
  region_id?: Region;
}

interface UpdatedRegionFields extends UpdatedCountryFields {
  country_id?: Country;
}

interface UpdateCustomerFields {
  name?: string;
}

export {
  GeoQueryResult,
  UserData,
  UpdatedCountryFields,
  UpdatedLocationFields,
  UpdatedRegionFields,
  UpdateCustomerFields
};