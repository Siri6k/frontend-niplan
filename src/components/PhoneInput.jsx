// components/PhoneInput.jsx
import React, { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

// Liste des pays avec indicatifs
const COUNTRIES = [
  { code: "CD", name: "RDC", dial: "+243", flag: "🇨🇩", mask: "## ### ####" },
  { code: "CG", name: "Congo", dial: "+242", flag: "🇨🇬", mask: "## ### ####" },
  { code: "RW", name: "Rwanda", dial: "+250", flag: "🇷🇼", mask: "### ### ###" },
  {
    code: "BI",
    name: "Burundi",
    dial: "+257",
    flag: "🇧🇮",
    mask: "## ## ## ##",
  },
  {
    code: "TZ",
    name: "Tanzanie",
    dial: "+255",
    flag: "🇹🇿",
    mask: "### ### ###",
  },
  {
    code: "UG",
    name: "Ouganda",
    dial: "+256",
    flag: "🇺🇬",
    mask: "### ### ###",
  },
  { code: "ZM", name: "Zambie", dial: "+260", flag: "🇿🇲", mask: "## ### ####" },
  { code: "AO", name: "Angola", dial: "+244", flag: "🇦🇴", mask: "### ### ###" },
  {
    code: "FR",
    name: "France",
    dial: "+33",
    flag: "🇫🇷",
    mask: "# ## ## ## ##",
  },
  {
    code: "BE",
    name: "Belgique",
    dial: "+32",
    flag: "🇧🇪",
    mask: "### ## ## ##",
  },
  {
    code: "CA",
    name: "Canada",
    dial: "+1",
    flag: "🇨🇦",
    mask: "(###) ###-####",
  },
  { code: "US", name: "USA", dial: "+1", flag: "🇺🇸", mask: "(###) ###-####" },
  { code: "GB", name: "UK", dial: "+44", flag: "🇬🇧", mask: "#### ######" },
  {
    code: "DE",
    name: "Allemagne",
    dial: "+49",
    flag: "🇩🇪",
    mask: "### #######",
  },
  { code: "OTHER", name: "Autre", dial: "+", flag: "🌍", mask: "##########" },
];

const PhoneInput = ({ value, onChange, error, disabled }) => {
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [isOpen, setIsOpen] = useState(false);
  const [localNumber, setLocalNumber] = useState("");
  const dropdownRef = useRef(null);

  // Détection auto du pays au montage
  /* useEffect(() => {
    const detectCountry = () => {
      const userLang = navigator.language || navigator.userLanguage;
      const countryCode = userLang.split("-")[1]?.toUpperCase();
      const matched = COUNTRIES.find((c) => c.code === countryCode);
      if (matched) setSelectedCountry(matched);
    };
    detectCountry();
  }, []);*/

  // Fermer dropdown quand clic extérieur
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Formatage selon le masque du pays
  const formatNumber = (input, mask) => {
    const cleaned = input.replace(/\D/g, "");
    let formatted = "";
    let index = 0;

    for (let char of mask) {
      if (index >= cleaned.length) break;
      if (char === "#") {
        formatted += cleaned[index];
        index++;
      } else {
        formatted += char;
      }
    }

    return formatted;
  };

  const handleNumberChange = (e) => {
    const raw = e.target.value;
    const formatted = formatNumber(raw, selectedCountry.mask);
    setLocalNumber(formatted);

    const fullNumber = `${selectedCountry.dial} ${formatted}`.trim();
    onChange(fullNumber);
  };

  const selectCountry = (country) => {
    setSelectedCountry(country);
    setLocalNumber("");
    onChange(country.dial);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className={`flex bg-gray-50 dark:bg-slate-800 border-2 rounded-2xl overflow-hidden transition-all ${
          error
            ? "border-red-500 focus-within:border-red-500"
            : "border-gray-200 dark:border-slate-700 focus-within:border-green-500 dark:focus-within:border-green-400"
        }`}
      >
        {/* Sélecteur de pays */}
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-4 bg-gray-100 dark:bg-slate-700/50 border-r border-gray-200 dark:border-slate-700 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors min-w-[100px]"
          disabled={disabled}
        >
          <span className="text-xl">{selectedCountry.flag}</span>
          <span className="font-medium text-gray-700 dark:text-slate-300 text-sm">
            {selectedCountry.dial}
          </span>
          <ChevronDown
            size={16}
            className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {/* Input numéro */}
        <input
          type="tel"
          value={localNumber}
          onChange={handleNumberChange}
          placeholder={selectedCountry.mask.replace(/#/g, "0")}
          className="flex-1 px-4 py-4 bg-transparent outline-none text-lg font-medium text-gray-900 dark:text-white placeholder-gray-400"
          disabled={disabled}
        />
      </div>

      {/* Dropdown des pays */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 max-h-64 overflow-y-auto bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 z-50 animate-in fade-in slide-in-from-top-2">
          <div className="p-2">
            <p className="text-xs font-medium text-gray-400 px-3 py-2 uppercase tracking-wider">
              Sélectionnez votre pays
            </p>
            {COUNTRIES.map((country) => (
              <button
                key={country.code}
                onClick={() => selectCountry(country)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                  selectedCountry.code === country.code
                    ? "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                    : "hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-slate-300"
                }`}
              >
                <span className="text-xl">{country.flag}</span>
                <div className="flex-1">
                  <p className="font-medium text-sm">{country.name}</p>
                  <p className="text-xs text-gray-400">{country.dial}</p>
                </div>
                {selectedCountry.code === country.code && (
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Hint */}
      <p className="mt-1.5 text-xs text-gray-400 dark:text-slate-500">
        Format: {selectedCountry.dial} {selectedCountry.mask}
      </p>
    </div>
  );
};

export default PhoneInput;
