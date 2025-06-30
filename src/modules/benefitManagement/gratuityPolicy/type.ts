export interface GratuityPolicyDetail {
  idx: string;
  intPolicyDetailsId: number;
  intPolicyId: number;
  intServiceLengthInMonth: number;
  serviceLengthStart: number;
  serviceLengthEnd: number;
  intDisbursementDependOnId: number;
  disbursementDependOnName: string;
  numPercentage: number;
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
