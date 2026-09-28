import React, { useState } from "react";
import { TargetCompany } from "@/lib/types";
import { X, Scale, FileText, Check, Copy, ArrowRight, ShieldCheck, DollarSign } from "lucide-react";

interface DealPlaybookModalProps {
  target: TargetCompany | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DealPlaybookModal: React.FC<DealPlaybookModalProps> = ({
  target,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !target) return null;

  const generateTermSheet = () => {
    return `NON-BINDING INDICATIVE TERM SHEET
CARVE-OUT ACQUISITION & PUBLIC SHELL ROLLUP

TARGET OPERATING ASSET: ${target.asset.subsidiaryName}
CURRENT PUBLIC VEHICLE: ${target.name} (${target.ticker})
DATE: ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}

1. TRANSACTION STRUCTURE:
   Acquisition of 100% of the equity, commercial assets, intellectual property, and operating contracts of ${target.asset.subsidiaryName} through an Article 9 Uniform Commercial Code (UCC) secured debt assignment and foreclosure, or consensual Section 363 asset sale.

2. SENIOR SECURED DEBT ACQUISITION:
   - Senior Creditor: ${target.extractionFeasibility.seniorSecuredHolder}
   - Face Value: ${(target.extractionFeasibility.seniorSecuredDebtAmount / 1000000).toFixed(2)}M
   - Cash Purchase Price: ${(target.extractionFeasibility.estimatedAcquisitionCost / 1000).toFixed(0)},000 (Approx. ${100 - target.extractionFeasibility.estimatedBuyoutDiscountPct}% of Face)
   - Collateral Assigned: First priority perfected UCC-1 blanket security interest covering all machinery, accounts receivable, and patents of ${target.asset.subsidiaryName}.

3. TOXIC DEBT EXTINGUISHMENT:
   Upon execution of the secured foreclosure, all junior unsecured debt, convertible debentures (${(target.vehicleDistress.toxicDebtBalance / 1000000).toFixed(1)}M total, including claims by ${target.vehicleDistress.toxicLenders.join(", ")}), and legacy parent obligations are extinguished as against ${target.asset.subsidiaryName}.

4. CLEAN PUBLIC SHELL ROLLUP:
   - ${target.asset.subsidiaryName} will be merged into a fully reporting, clean public shell entity controlled by Purchaser.
   - Shell Specifications: 0 debt, 0 legal claims, PCAOB auditor current, Cede & Co / DTC eligible.
   - Operating Management Incentive: 15.0% un-diluted common equity pool reserved for key subsidiary founders and operators, plus a $500,000 working capital line injected at closing.

5. EXCLUSIVITY & TIMELINE:
   - 30-Day exclusive confirmatory due diligence period.
   - Target closing within 21 business days of UCC-1 notice of sale expiration.

REGULATORY & DISCLOSURE AUDIT TRAIL:
   - OTC Markets Profile: ${target.otcMarketsUrl}
   - SEC EDGAR Dossier: ${target.secEdgarUrl} (CIK: ${target.cik})
   - Verified Filing Reference: Form ${target.latestFilingType} (${target.latestFilingDate})
     Link: ${target.latestFilingUrl}

CONFIDENTIAL & NON-BINDING`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateTermSheet());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-2xl rounded-2xl border border-stone-800 bg-stone-950 p-3.5 sm:p-6 shadow-2xl text-stone-200 my-auto sm:my-8 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-3 mb-4">
          <div className="flex items-center space-x-2 text-cyan-400 font-bold text-sm">
            <Scale className="h-5 w-5" />
            <span>Statutory Deal Playbook: {target.extractionFeasibility.recommendedPlaybook.replace(/_/g, " ").toUpperCase()}</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-stone-400 hover:text-white hover:bg-stone-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 3-Step Execution Mechanics */}
        <div className="space-y-3 mb-5 text-xs">
          <div className="rounded-xl border border-stone-800 bg-stone-900/90 p-3">
            <div className="flex items-center space-x-2 text-cyan-300 font-mono font-bold mb-1">
              <span>STEP 1: SENIOR NOTE ASSIGNMENT & LIEN LOCK</span>
            </div>
            <p className="text-stone-300 leading-relaxed">
              Execute absolute assignment agreement with <strong>{target.extractionFeasibility.seniorSecuredHolder}</strong>. Pay <strong>${(target.extractionFeasibility.estimatedAcquisitionCost / 1000).toFixed(0)}k cash</strong> to take over the first-priority UCC-1 lien recorded with {target.extractionFeasibility.uccLienJurisdiction}.
            </p>
          </div>

          <div className="rounded-xl border border-stone-800 bg-stone-900/90 p-3">
            <div className="flex items-center space-x-2 text-amber-300 font-mono font-bold mb-1">
              <span>STEP 2: ARTICLE 9 FORECLOSURE OR 363 SALE ORDER</span>
            </div>
            <p className="text-stone-300 leading-relaxed">
              Serve 10-day statutory UCC notice of disposition to parent company and junior toxic lenders (wiping out <strong>${(target.vehicleDistress.toxicDebtBalance / 1000000).toFixed(1)}M</strong> in convertible debt from {target.vehicleDistress.toxicLenders.join(", ")}). Take clean title to 100% of <strong>{target.asset.subsidiaryName}</strong>.
            </p>
          </div>

          <div className="rounded-xl border border-stone-800 bg-stone-900/90 p-3">
            <div className="flex items-center space-x-2 text-emerald-300 font-mono font-bold mb-1">
              <span>STEP 3: CLEAN PUBLIC SHELL ROLLUP & RECAPITALIZATION</span>
            </div>
            <p className="text-stone-300 leading-relaxed">
              Transfer operating business into our clean public shell. Grant subsidiary founder and management team clean, non-diluted equity, retain all {target.asset.employees} employees, and preserve all customer contracts.
            </p>
          </div>
        </div>

        {/* Term Sheet Preview */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-mono text-stone-400 font-semibold">INDICATIVE CARVE-OUT TERM SHEET</span>
            <button
              onClick={handleCopy}
              className="inline-flex items-center space-x-1 text-emerald-400 hover:text-emerald-300 font-mono text-[11px]"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? "Copied Term Sheet" : "Copy Full Term Sheet"}</span>
            </button>
          </div>
          <pre className="p-3.5 rounded-xl bg-stone-900 border border-stone-800 text-[10px] font-mono text-stone-300 overflow-x-auto whitespace-pre-wrap max-h-56">
            {generateTermSheet()}
          </pre>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end space-x-3 pt-3 border-t border-stone-800">
          <button
            onClick={onClose}
            className="rounded-xl border border-stone-800 px-4 py-2 text-xs font-semibold text-stone-400 hover:text-white hover:bg-stone-900 transition"
          >
            Close
          </button>
          <button
            onClick={handleCopy}
            className="inline-flex items-center space-x-1.5 rounded-xl bg-cyan-500 px-4 py-2 text-xs font-bold text-stone-950 hover:bg-cyan-400 transition"
          >
            <Copy className="h-3.5 w-3.5" />
            <span>{copied ? "Copied to Clipboard" : "Copy Term Sheet"}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
