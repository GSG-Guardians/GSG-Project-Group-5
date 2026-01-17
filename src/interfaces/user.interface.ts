import { RolesEnum } from 'src/enums/roles.enum';

export interface User {
  id: string;
  national_id: string;
  phone_number: string;
  first_name: string;
  last_name: string;
  roles: RolesEnum[];
}
