'use client';
</div>
</div>
)}


{step===3 && (
<div className="card p-4 space-y-3">
<h3 className="text-lg font-semibold">AI training uplift</h3>
{func==='cx' && (
<div className="grid md:grid-cols-2 gap-4">
<PercentRow label="Deflection gain (%)" value={uCx.deflectionGainPct} onChange={v=> setUCx({...uCx, deflectionGainPct: v})} />
<PercentRow label="AHT reduction (%)" value={uCx.ahtReductionPct} onChange={v=> setUCx({...uCx, ahtReductionPct: v})} />
<PercentRow label="QA automation gain (%)" value={uCx.qaAutomationGainPct} onChange={v=> setUCx({...uCx, qaAutomationGainPct: v})} />
</div>
)}
{func==='marketing' && (
<div className="grid md:grid-cols-2 gap-4">
<PercentRow label="Time saved per asset (%)" value={uMkt.timeSavedPerAssetPct} onChange={v=> setUMkt({...uMkt, timeSavedPerAssetPct: v})} />
<PercentRow label="Outsourcing reduction (%)" value={uMkt.outsourcingReductionPct} onChange={v=> setUMkt({...uMkt, outsourcingReductionPct: v})} />
</div>
)}
{func==='ops' && (
<div className="grid md:grid-cols-2 gap-4">
<PercentRow label="Time saved per report (%)" value={uOps.timeSavedPerReportPct} onChange={v=> setUOps({...uOps, timeSavedPerReportPct: v})} />
<PercentRow label="Error reduction (%)" value={uOps.errorReductionPct} onChange={v=> setUOps({...uOps, errorReductionPct: v})} />
</div>
)}
<div className="flex gap-2 pt-2">
<button className="btn btn-ghost" onClick={()=> setStep(2)}>← Back</button>
<button className="btn btn-primary" onClick={()=> setStep(4)}>Calculate Results →</button>
</div>
</div>
)}


{step===4 && (
<div className="space-y-4">
<SummaryCards monthly={results.monthlySavings} payback={results.paybackMonths} roi={results.roiMultiple} hours={results.hoursSaved} />


<div className="card p-4">
<h3 className="text-lg font-semibold mb-3">Breakdown</h3>
<div className="grid md:grid-cols-3 gap-3">
{Object.entries(results.breakdown).map(([k,v])=> (
<div key={k} className="card p-3">
<div className="text-xs text-neutral-500">{k}</div>
<div className="text-lg font-semibold">{currencyFmt(v)}</div>
</div>
))}
</div>
</div>


<div className="card p-4 space-y-3">
<h3 className="text-lg font-semibold">What we recommend</h3>
<p className="text-sm text-neutral-700">Based on your inputs, we recommend the <strong>AI for {func==='cx'? 'Customer Support': func==='marketing'? 'Marketing': 'Data & Operations'} Teams</strong> track. Typical ramp achieves ~50% of gains in Month 1, ~80% in Month 2, and ~100% by Month 3.</p>
<div className="flex flex-wrap gap-2">
<button className="btn btn-primary">Generate Proposal (PDF)</button>
<button className="btn btn-ghost">Book a 20‑min ROI Review</button>
<button className="btn btn-ghost">Email me this model</button>
</div>
<p className="help">Defaults reflect conservative industry norms and Brainster cohort outcomes; adjust to your data. Excludes strategic upside (speed to market, morale, brand).</p>
</div>


<div className="flex gap-2">
<button className="btn btn-ghost" onClick={()=> setStep(3)}>← Back</button>
<button className="btn btn-primary" onClick={()=> setStep(1)}>Start over</button>
</div>
</div>
)}
</div>
);
}
