// Simple country flag utility
const countryFlags: Record<string, string> = {
  "UK": "🇬🇧",
  "United Kingdom": "🇬🇧",
  "England": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  "Scotland": "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
  "Wales": "🏴󠁧󠁢󠁷󠁬󠁳󠁿",
  "Northern Ireland": "🇬🇧",
  "London": "🇬🇧",
  "Manchester": "🇬🇧",
  "Birmingham": "🇬🇧",
  "Liverpool": "🇬🇧",
  "Leeds": "🇬🇧",
  "Sheffield": "🇬🇧",
  "Bristol": "🇬🇧",
  "Glasgow": "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
  "Edinburgh": "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
  "Cardiff": "🏴󠁧󠁢󠁷󠁬󠁳󠁿",
  "Belfast": "🇬🇧",
  "Oxford": "🇬🇧",
  "Cambridge": "🇬🇧",
  "Bath": "🇬🇧",
  "York": "🇬🇧",
  "Canterbury": "🇬🇧",
  "Durham": "🇬🇧",
  "Exeter": "🇬🇧",
  "Lancaster": "🇬🇧",
  "Leicester": "🇬🇧",
  "Newcastle": "🇬🇧",
  "Nottingham": "🇬🇧",
  "Southampton": "🇬🇧",
  "Warwick": "🇬🇧",
  "Aberdeen": "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
  "Dundee": "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
  "Stirling": "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
  "Swansea": "🏴󠁧󠁢󠁷󠁬󠁳󠁿",
  "Bangor": "🏴󠁧󠁢󠁷󠁬󠁳󠁿"
};

export function getCountryFlag(location: string): string {
  return countryFlags[location] || "🇬🇧";
}