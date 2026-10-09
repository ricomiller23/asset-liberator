import { LenderPortfolioGroup } from "../types";

/**
 * INVERTED LENDER INDEX & PORTFOLIO BUYOUT MAP
 * 
 * Tracks repeat distressed noteholders across multiple OTC/Nasdaq borrowers.
 * Inverts outreach from target-by-target to portfolio-purchase negotiations:
 * One meeting with a senior debt fund unlocks 3-5 operating subsidiaries simultaneously.
 */

export const DISTRESSED_LENDERS_INDEX: LenderPortfolioGroup[] = [
  {
    lenderId: "lender-streeterville",
    lenderName: "Streeterville Capital, LLC",
    principal: "John M. Fife (Salt Lake City, UT)",
    borrowerCount: 4,
    totalSecuredDebt: 18500000,
    borrowerTickers: ["ALPP", "PHIL", "OZSC", "SING"],
    uccFilingStates: ["Delaware", "Nevada", "Utah"],
    playbookFit: "article_9_foreclosure",
    negotiationStrategy: "Purchase blended senior secured promissory note portfolio at 50-60% discount to face value. Execute friendly Article 9 strict foreclosure on operating subsidiaries (e.g. American Precision Avionics)."
  },
  {
    lenderId: "lender-discover-growth",
    lenderName: "Discover Growth Fund / Discover Financing",
    principal: "Michael A. Chermak (St. Thomas, USVI)",
    borrowerCount: 3,
    totalSecuredDebt: 12400000,
    borrowerTickers: ["SING", "LADX", "QRON"],
    uccFilingStates: ["Delaware", "Massachusetts", "Nevada"],
    playbookFit: "consensual_carveout",
    negotiationStrategy: "Negotiate assignment of senior 1st-lien security interests covering Boston Solar assets and specialty IP. Settle intercreditor standstill agreements."
  },
  {
    lenderId: "lender-ema-financial",
    lenderName: "EMA Financial, LLC",
    principal: "Felicia Preston (New York, NY)",
    borrowerCount: 3,
    totalSecuredDebt: 8200000,
    borrowerTickers: ["SING", "OPTI", "RGBP"],
    uccFilingStates: ["Delaware", "New York"],
    playbookFit: "article_9_foreclosure",
    negotiationStrategy: "Acquire convertible promissory notes prior to default conversion ratchets. Extinguish toxic dilution in exchange for standalone cash payout upon sub carve-out."
  },
  {
    lenderId: "lender-geneva-roth",
    lenderName: "Geneva Roth Remark Holdings, LLC",
    principal: "Curt Kramer (Great Neck, NY)",
    borrowerCount: 2,
    totalSecuredDebt: 4600000,
    borrowerTickers: ["OZSC", "PBIO"],
    uccFilingStates: ["New York", "Delaware", "Massachusetts"],
    playbookFit: "article_9_foreclosure",
    negotiationStrategy: "Clean buyout of senior perfected UCC-1 filings on nanoemulsion processing rig (UST) and microgrid patents."
  },
  {
    lenderId: "lender-ionic-ventures",
    lenderName: "Ionic Ventures, LLC",
    principal: "Brendan O'Neil (San Diego, CA)",
    borrowerCount: 2,
    totalSecuredDebt: 6100000,
    borrowerTickers: ["ALPP", "QPRC"],
    uccFilingStates: ["California", "Delaware"],
    playbookFit: "section_363_sale",
    negotiationStrategy: "Partner with fund to serve as stalking horse bidder in court-supervised asset sale or Article 9 public disposition."
  },
  {
    lenderId: "lender-b-riley",
    lenderName: "B. Riley Principal Investments / Senior Syndicate",
    principal: "Bryant Riley (Los Angeles, CA)",
    borrowerCount: 2,
    totalSecuredDebt: 28000000,
    borrowerTickers: ["XELA", "RWAX"],
    uccFilingStates: ["Delaware", "Texas", "California"],
    playbookFit: "section_363_sale",
    negotiationStrategy: "Purchase senior credit facility tranche at 55% discount or credit-bid in Chapter 11 to extract $94M healthcare automation subsidiary (SourceHOV)."
  },
  {
    lenderId: "lender-yorkville",
    lenderName: "YA II PN, Ltd. (Yorkville Advisors Global)",
    principal: "Mark Angelo (Mountainside, NJ)",
    borrowerCount: 2,
    totalSecuredDebt: 15000000,
    borrowerTickers: ["BBLG", "ZENA"],
    uccFilingStates: ["New Jersey", "Delaware", "Alberta"],
    playbookFit: "consensual_carveout",
    negotiationStrategy: "Restructure debentures secured by commercial patents and de-SPAC operating divisions ahead of Nasdaq delisting deadlines."
  }
];
