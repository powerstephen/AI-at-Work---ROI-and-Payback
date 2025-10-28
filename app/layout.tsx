import './globals.css';
import type { Metadata } from 'next';


export const metadata: Metadata = {
title: 'AI at Work — ROI & Payback Builder',
description: 'Estimate savings, payback, and ROI for AI upskilling with Brainster.',
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
return (
<html lang="en">
<body>
<header className="bg-gradient-to-r from-brainster-purple to-brainster-coral text-white">
<div className="container-lg py-6">
<h1 className="text-2xl font-semibold">AI at Work — ROI & Payback Builder</h1>
<p className="opacity-90">Build a business case for AI training in minutes.</p>
</div>
</header>
<main className="container-lg py-8">{children}</main>
</body>
</html>
);
}
