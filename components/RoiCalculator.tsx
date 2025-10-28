'use client';

import { useMemo, useState } from 'react';
import { NumberRow, PercentRow, Segmented, StepHeader } from './ui';
import {
  FunctionType,
  GlobalInputs,
  CxBaseline,
  MarketingBaseline,
  OpsBaseline,
  UpliftCx,
  UpliftMarketing,
  UpliftOps,
  calcCx,
  calcMarketing,
  calcOps,
} from '../lib/model';

const currency = '€';

function currencyFmt(n: number) {
  return new Intl.NumberFormat('en', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(n);
}

function SummaryCards({
  monthly,
  payback,
  roi,
  hours,
}: {
  monthly: number;
  payback: number;
  roi: number;
  hours: number;
}) {
  const cards = [
    { label: 'Monthly savings', value: currencyFmt(monthly) },
    { label: 'Payback', value: isFinite(payback) ? `${payback.toFixed(1)} mo` : '—' },
    { label: 'Annual ROI', value: `${roi.toFixed(1)}×` },
    { label: 'Hours saved / mo', value: Math.round(hours).toString() },
  ];
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {cards.map((c) => (
        <div key={c.label} className="card p-4">
          <div className="text-xs text-neutral-500">{c.label}</div>
          <div className="text-lg font-semibold">{c.value}</div>
        </div>
      ))}
    </div>
  );
}

export function RoiCalculator() {
  // STEP
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // GLOBAL
  const [func, setFunc] = useState<FunctionType>('cx');
  const [teamSize, setTeamSize] = useState(20);
  const [hourlyCost, setHourlyCost] = useState(35);
  const [trainingCostPerPerson, setTrainingCostPerPerson] = useState(850);
  const [adoptionRatePct, setAdoptionRatePct] = useState(80);

  const g: GlobalInputs = { func, teamSize, hourlyCost, trainingCostPerPerson, adoptionRatePct };

  // BASELINES
  const [cx, setCx] = useState<CxBaseline>({
    ticketsPerAgentMonth: 800,
    avgHandleTimeMin: 8,
    currentDeflectionPct: 5,
    qaWorkloadPct: 10,
  });
  const [mkt, setMkt] = useState<MarketingBaseline>({
    assetsPerPersonMonth: 25,
    hoursPerAsset: 2,
    outsourcedPct: 25,
    vendorCostPerAsset: 80,
  });
  const [ops, setOps] = useState<OpsBaseline>({
    reportsPerPersonMonth: 20,
    hoursPerReport: 3,
    errorCostPerReport: 40,
  });

  // UPLIFT
  const [uCx, setUCx] = useState<UpliftCx>({
    deflectionGainPct: 10,
    ahtReductionPct: 20,
    qaAutomationGainPct: 30,
  });
  const [uMkt, setUMkt] = useState<UpliftMarketing>({
    timeSavedPerAssetPct: 40,
    outsourcingReductionPct: 30,
  });
  const [uOps, setUOps] = useState<UpliftOps>({ timeSavedPerReportPct: 30, errorReductionPct: 15 });

  const results = useMemo(() => {
    if (func === 'cx') return calcCx(g, cx, uCx);
    if (func === 'marketing') return calcMarketing(g, mkt, uMkt);
    return calcOps(g, ops, uOps);
  }, [g, cx, mkt, ops, uCx, uMkt, uOps, func]);

  const trainingCostTotal = teamSize * trainingCostPerPerson;

  return (
    <div className="space-y-4">
      <StepHeader current={step} />

      {step === 1 && (
        <div className="grid md:grid-cols-2 gap-4">
          <div className="card p-4 space-y-3">
            <h3 className="text-lg font-semibold">Who are we training?</h3>
            <Segmented
              value={func}
              onChange={setFunc}
              options={[
                { label: 'Customer Support / CX', value: 'cx' },
                { label: 'Marketing', value: 'marketing' },
                { label: 'Operations & Analytics', value: 'ops' },
              ]}
            />
            <NumberRow label={`Team size`} value={teamSize} onChange={setTeamSize} min={1} />
            <NumberRow
              label={`Avg hourly cost (${currency})`}
              value={hourlyCost}
              onChange={setHourlyCost}
              min={0}
              step={1}
            />
            <NumberRow
              label={`Training cost per person (${currency})`}
              value={trainingCostPerPerson}
              onChange={setTrainingCostPerPerson}
              min={0}
              step={25}
            />
            <PercentRow
              label="Adoption rate (%)"
              value={adoptionRatePct}
              onChange={setAdoptionRatePct}
              min={50}
              max={100}
            />
            <div className="flex gap-2 pt-2">
              <button className="btn btn-primary" onClick={() => setStep(2)}>
                Continue → Baseline
              </button>
            </div>
          </div>

          <div className="card p-4 space-y-2">
            <h4 className="font-semibold">Quick facts</h4>
            <ul className="text-sm list-disc pl-5 space-y-1 text-neutral-700">
              <li>Start with one function for a realistic pilot. Scale later.</li>
              <li>Assumptions are conservative; edit any field.</li>
              <li>Outputs show monthly savings, payback, and annual ROI.</li>
            </ul>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="card p-3">
                <div className="text-xs text-neutral-500">Training cost (est.)</div>
                <div className="text-lg font-semibold">{currencyFmt(trainingCostTotal)}</div>
              </div>
              <div className="card p-3">
                <div className="text-xs text-neutral-500">Adoption</div>
                <div className="text-lg font-semibold">{adoptionRatePct}%</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="card p-4 space-y-3">
          <h3 className="text-lg font-semibold">Baseline metrics</h3>
          {func === 'cx' && (
            <div className="grid md:grid-cols-2 gap-4">
              <NumberRow
                label="Tickets per agent / month"
                value={cx.ticketsPerAgentMonth}
                onChange={(v) => setCx({ ...cx, ticketsPerAgentMonth: v })}
                min={0}
              />
              <NumberRow
                label="Avg handle time (min)"
                value={cx.avgHandleTimeMin}
                onChange={(v) => setCx({ ...cx, avgHandleTimeMin: v })}
                min={0}
                step={0.5}
              />
              <NumberRow
                label="Current deflection (%)"
                value={cx.currentDeflectionPct}
                onChange={(v) => setCx({ ...cx, currentDeflectionPct: v })}
                min={0}
                step={1}
              />
              <NumberRow
                label="QA workload (% of time)"
                value={cx.qaWorkloadPct}
                onChange={(v) => setCx({ ...cx, qaWorkloadPct: v })}
                min={0}
                step={1}
              />
            </div>
          )}
          {func === 'marketing' && (
            <div className="grid md:grid-cols-2 gap-4">
              <NumberRow
                label="Assets per person / month"
                value={mkt.assetsPerPersonMonth}
                onChange={(v) => setMkt({ ...mkt, assetsPerPersonMonth: v })}
                min={0}
              />
              <NumberRow
                label="Hours per asset"
                value={mkt.hoursPerAsset}
                onChange={(v) => setMkt({ ...mkt, hoursPerAsset: v })}
                min={0}
                step={0.5}
              />
              <NumberRow
                label="% outsourced today"
                value={mkt.outsourcedPct}
                onChange={(v) => setMkt({ ...mkt, outsourcedPct: v })}
                min={0}
                step={1}
              />
              <NumberRow
                label={`Vendor cost per asset (${currency})`}
                value={mkt.vendorCostPerAsset}
                onChange={(v) => setMkt({ ...mkt, vendorCostPerAsset: v })}
                min={0}
                step={10}
              />
            </div>
          )}
          {func === 'ops' && (
            <div className="grid md:grid-cols-2 gap-4">
              <NumberRow
                label="Reports per person / month"
                value={ops.reportsPerPersonMonth}
                onChange={(v) => setOps({ ...ops, reportsPerPersonMonth: v })}
                min={0}
              />
              <NumberRow
                label="Hours per report"
                value={ops.hoursPerReport}
                onChange={(v) => setOps({ ...ops, hoursPerReport: v })}
                min={0}
                step={0.5}
              />
              <NumberRow
                label={`Rework / error cost per report (${currency})`}
                value={ops.errorCostPerReport}
                onChange={(v) => setOps({ ...ops, errorCostPerReport: v })}
                min={0}
                step={5}
              />
            </div>
          )}
          <div className="flex gap-2 pt-2">
            <button className="btn btn-ghost" onClick={() => setStep(1)}>
              ← Back
            </button>
            <button className="btn btn-primary" onClick={() => setStep(3)}>
              Continue → AI Uplift
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="card p-4 space-y-3">
          <h3 className="text-lg font-semibold">AI training uplift</h3>
          {func === 'cx' && (
            <div className="grid md:grid-cols-2 gap-4">
              <PercentRow
                label="Deflection gain (%)"
                value={uCx.deflectionGainPct}
                onChange={(v) => setUCx({ ...uCx, deflectionGainPct: v })}
              />
              <PercentRow
                label="AHT reduction (%)"
                value={uCx.ahtReductionPct}
                onChange={(v) => setUCx({ ...uCx, ahtReductionPct: v })}
              />
              <PercentRow
                label="QA automation gain (%)"
                value={uCx.qaAutomationGainPct}
                onChange={(v) => setUCx({ ...uCx, qaAutomationGainPct: v })}
              />
            </div>
          )}
          {func === 'marketing' && (
            <div className="grid md:grid-cols-2 gap-4">
              <PercentRow
                label="Time saved per asset (%)"
                value={uMkt.timeSavedPerAssetPct}
                onChange={(v) => setUMkt({ ...uMkt, timeSavedPerAssetPct: v })}
              />
              <PercentRow
                label="Outsourcing reduction (%)"
                value={uMkt.outsourcingReductionPct}
                onChange={(v) => setUMkt({ ...uMkt, outsourcingReductionPct: v })}
              />
            </div>
          )}
          {func === 'ops' && (
            <div className="grid md:grid-cols-2 gap-4">
              <PercentRow
                label="Time saved per report (%)"
                value={uOps.timeSavedPerReportPct}
                onChange={(v) => setUOps({ ...uOps, timeSavedPerReportPct: v })}
              />
              <PercentRow
                label="Error reduction (%)"
                value={uOps.errorReductionPct}
                onChange={(v) => setUOps({ ...uOps, errorReductionPct: v })}
              />
            </div>
          )}
          <div className="flex gap-2 pt-2">
            <button className="btn btn-ghost" onClick={() => setStep(2)}>
              ← Back
            </button>
            <button className="btn btn-primary" onClick={() => setStep(4)}>
              Calculate Results →
            </button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4">
          <SummaryCards
            monthly={results.monthlySavings}
            payback={results.paybackMonths}
            roi={results.roiMultiple}
            hours={results.hoursSaved}
          />

          <div className="card p-4">
            <h3 className="text-lg font-semibold mb-3">Breakdown</h3>
            <div className="grid md:grid-cols-3 gap-3">
              {Object.entries(results.breakdown).map(([k, v]) => (
                <div key={k} className="card p-3">
                  <div className="text-xs text-neutral-500">{k}</div>
                  <div className="text-lg font-semibold">{currencyFmt(v)}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-4 space-y-3">
            <h3 className="text-lg font-semibold">What we recommend</h3>
            <p className="text-sm text-neutral-700">
              Based on your inputs, we recommend the <strong>
                AI for {func === 'cx' ? 'Customer Support' : func === 'marketing' ? 'Marketing' : 'Data & Operations'}
              </strong>{' '}
              Teams track. Typical ramp achieves ~50% of gains in Month 1, ~80% in Month 2, and ~100% by Month 3.
            </p>
            <div className="flex flex-wrap gap-2">
              <button className="btn btn-primary">Generate Proposal (PDF)</button>
              <button className="btn btn-ghost">Book a 20-min ROI Review</button>
              <button className="btn btn-ghost">Email me this model</button>
            </div>
            <p className="help">
              Defaults reflect conservative industry norms and Brainster cohort outcomes; adjust to your data. Excludes
              strategic upside (speed to market, morale, brand).
            </p>
          </div>

          <div className="flex gap-2">
            <button className="btn btn-ghost" onClick={() => setStep(3)}>
              ← Back
            </button>
            <button className="btn btn-primary" onClick={() => setStep(1)}>
              Start over
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
