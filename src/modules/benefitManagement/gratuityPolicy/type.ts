export interface GratuityPolicyDetail {
  idx: string;
  intPolicyDetailsId: number;
  intPolicyId: number;
  intServiceLengthInMonth: number;
  intServiceLengthStartInMonth: number;
  intServiceLengthEndInMonth: number;
  intDisbursementDependOnId: number;
  disbursementDependOnName: string;
  numPercentageOrFixedAmount: number;
}

export interface GratuityPolicy {
  intPolicyId: number;
  strPolicyName: string;
  isProvision: boolean;
  isInvestment: boolean;
  intWorkplaceId: number;
  workplaceName: string;
  intEmploymentTypeId: number;
  intEligibilityDependOn: number;
  eligibilityDependOnName: string;
  employmentTypeName: string;
  isActive: boolean;
  gratuityPolicyDetails: GratuityPolicyDetail[];
}

export type DataState = GratuityPolicyDetail[];
