export type FunctionType = 'cx' | 'marketing' | 'ops';

export type GlobalInputs = {
  func: FunctionType;
  teamSize: number;
  hourlyCost: number; // €
  trainingCostPerPerson: number; // €
  adoptionRatePct: number; // 0-100
};

export type CxBaseline = {
  ticketsPerAgentMonth: number;
  avgHandleTimeMin: number;
  currentDeflectionPct: number; // informational
  qaWorkloadPct: number; // default 10
};

export type MarketingBaseline = {
  assetsPerPersonMonth: number;
  hoursPerAsset: number;
  outsourcedPct: number;
  vendorCostPerAsset: number;
};

export type OpsBaseline = {
  reportsPerPersonMonth: number;
  hoursPerReport: number;
  errorCostPerReport: number;
};

export type UpliftCx = {
  deflectionGainPct: number;
  ahtReductionPct: number;
  qaAutomationGainPct: number;
};
export type UpliftMarketing = { timeSavedPerAssetPct: number; outsourcingReductionPct: number };
export type UpliftOps = { timeSavedPerReportPct: number; errorReductionPct: number };

export type Results = {
  monthlySavings: number;
  annualSavings: number;
  trainingCostTotal: number;
  paybackMonths: number;
  roiMultiple: number;
  hoursSaved: number;
  breakdown: Record<string, number>;
};

export const calcCx = (g: GlobalInputs, b: CxBaseline, u: UpliftCx): Results => {
  const team = g.teamSize;
  const adoption = g.adoptionRatePct / 100;
  const baselineHours = (b.ticketsPerAgentMonth * b.avgHandleTimeMin * team) / 60;
  const timeSavedDeflection = baselineHours * (u.deflectionGainPct / 100);
  const timeSavedEfficiency = baselineHours * (u.ahtReductionPct / 100);
  const timeSavedQa = baselineHours * (u.qaAutomationGainPct / 100) * (b.qaWorkloadPct / 100);
  const totalTimeSaved = (timeSavedDeflection + timeSavedEfficiency + timeSavedQa) * adoption;
  const costSavingsMonth = totalTimeSaved * g.hourlyCost;
  const trainingCostTotal = team * g.trainingCostPerPerson;
  const annualSavings = costSavingsMonth * 12;
  return {
    monthlySavings: costSavingsMonth,
    annualSavings,
    trainingCostTotal,
    paybackMonths: costSavingsMonth > 0 ? trainingCostTotal / costSavingsMonth : Infinity,
    roiMultiple: trainingCostTotal > 0 ? annualSavings / trainingCostTotal : 0,
    hoursSaved: totalTimeSaved,
    breakdown: {
      deflection: timeSavedDeflection * g.hourlyCost,
      aht: timeSavedEfficiency * g.hourlyCost,
      qa: timeSavedQa * g.hourlyCost,
    },
  };
};

export const calcMarketing = (
  g: GlobalInputs,
  b: MarketingBaseline,
  u: UpliftMarketing
): Results => {
  const team = g.teamSize;
  const adoption = g.adoptionRatePct / 100;
  const baselineHours = b.assetsPerPersonMonth * b.hoursPerAsset * team;
  const timeSaved = baselineHours * (u.timeSavedPerAssetPct / 100) * adoption;
  const timeSavingsValue = timeSaved * g.hourlyCost;
  const vendorSavings =
    b.assetsPerPersonMonth * team * b.vendorCostPerAsset * (u.outsourcingReductionPct / 100);
  const total = timeSavingsValue + vendorSavings;
  const trainingCostTotal = team * g.trainingCostPerPerson;
  const annual = total * 12;
  return {
    monthlySavings: total,
    annualSavings: annual,
    trainingCostTotal,
    paybackMonths: total > 0 ? trainingCostTotal / total : Infinity,
    roiMultiple: trainingCostTotal > 0 ? annual / trainingCostTotal : 0,
    hoursSaved: timeSaved,
    breakdown: { time: timeSavingsValue, vendor: vendorSavings },
  };
};

export const calcOps = (g: GlobalInputs, b: OpsBaseline, u: UpliftOps): Results => {
  const team = g.teamSize;
  const adoption = g.adoptionRatePct / 100;
  const baselineHours = b.reportsPerPersonMonth * b.hoursPerReport * team;
  const timeSaved = baselineHours * (u.timeSavedPerReportPct / 100) * adoption;
  const timeSavingsValue = timeSaved * g.hourlyCost;
  const errorSavings =
    b.reportsPerPersonMonth * team * b.errorCostPerReport * (u.errorReductionPct / 100);
  const total = timeSavingsValue + errorSavings;
  const trainingCostTotal = team * g.trainingCostPerPerson;
  const annual = total * 12;
  return {
    monthlySavings: total,
    annualSavings: annual,
    trainingCostTotal,
    paybackMonths: total > 0 ? trainingCostTotal / total : Infinity,
    roiMultiple: trainingCostTotal > 0 ? annual / trainingCostTotal : 0,
    hoursSaved: timeSaved,
    breakdown: { time: timeSavingsValue, error: errorSavings },
  };
};
