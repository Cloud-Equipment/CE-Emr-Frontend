export interface ISettings {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  twoFactorEnabled: boolean;
  id: string;
  roles: string[];
  emailConfirmed: boolean;
  phoneNumberConfirmed: boolean;
  emailVerificatioEnabled: boolean;
  phoneVerificationEnabled: boolean;
}
