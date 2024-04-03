export interface IProcedure {
  facilityName: string;
  procedureEntryId: number;
  medServiceName: null | string;
  patientAge: number;
  patientName: string;
  referrersName: string;
  referrersFacility: string;
  phoneNumber: string;
  patientPhone: string;
  patientEmail: string;
  patientGenderId: number;
  facilityDiscountPercent: number;
  facilityDiscountCodeName: string;
  fprocedureDiscountPercent: number;
  procedureDiscountCodeName: string;
  totalAfterDisc: number;
  procedureEntryStatus: string;
  date: Date;
  refererName: string;
  rebatePaid: number;
  refererHospital: string;
  refererPhone: string;
  refererEmail: string;
  phoneNo: string;
  patientId: string;
  medServiceId: number;
  quantity: number;
  amount: number;
  subotal: number;
  facilityId: string;
  remarks: string;
  faclityDiscountId: number | null;
  procedureDiscountId: number;
  entryUserId: string;
  trackId: string;
  rebateId: string;
}

export interface IProcedure2 {
  facilityName: string;
  procedureEntryId: number;
  medServiceName: string;
  categoryName: string;
  patientAge: number;
  patientName: string;
  patientGender?: any;
  address: string;
  procedureCategory?: any;
  referrersName?: string;
  patientPhone: string;
  patientFacilityCode: string;
  patientEmail: string;
  facilityDiscountPercent?: number;
  facilityDiscountCodeName?: string;
  fprocedureDiscountPercent?: number;
  procedurediscountCodeName?: string;
  totalAfterDisc: number;
  procedureEntryStatus: string;
  rebatePercent?: number;
  refererName?: string;
  rebatePaid: number;
  refererHospital?: string;
  refererEmail?: string;
  refererPhone?: string;
  discountPercent?: number;
  patientId: string;
  medServiceId: number;
  quantity: number;
  amount: number;
  subotal: number;
  facilityId: string;
  remarks: string;
  faclityDiscountId: number;
  procedureDiscountId: number;
  entryUserId: string;
  trackId: string;
  date: string;
  rebateId?: string;
}

export interface IMedService {
  medServiceId: number;
  medServiceCategoryId: number;
  medServiceName: string;
  medServiceDescription: string;
  isActive: number;
  price: number;
  new_Price: number;
  dateCreated?: Date;
  dateModified?: Date;
  facilityId: string;
}

export interface IMedserviceCategory {
  categoryId: number;
  categoryName: string;
  createdAt?: Date;
  updatedAt?: Date;
  isActive: boolean;
}

export interface IMedservice {
  medServiceId: number;
  medServiceCategoryId: number;
  medServiceName: string;
  medServiceDescription: string;
  isActive: number;
  price: number;
  new_Price: number;
  dateCreated: Date;
  dateModified: Date;
  facilityId: string;
}

export interface ICreateProcedure {
  medServiceCategoryId: number;
  medServiceName: string;
  medServiceDescription: string;
  price: number;
  facilityId: string;
}

export interface IProcedureCategory {
  categoryId: string;
  categoryName: string;
  categoryDescription?: any;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}
