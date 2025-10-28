'use client';
import { useState, useMemo } from 'react';
import { RoiCalculator } from '@/components/RoiCalculator';


export default function Page() {
return (
<div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
<RoiCalculator />
<aside className="card p-4 space-y-3 h-fit sticky top-6">
<h3 className="text-lg font-semibold">Your Summary</h3>
<p className="text-sm text-neutral-600">Values update live as you tweak inputs.</p>
<div id="live-summary" className="space-y-2 text-sm"></div>
</aside>
</div>
);
}
