import React, { useState } from "react";
import { PInput } from "./PInput";

const allowedSymbolsRegex = /^[0-9a-zA-Z@#'()+\-*/.%\s]*$/;

const FormulaInputWrapper = ({
  label,
  value,
  onChange,
  disabled,
  formulaOptions,
  width = "100%",
}: any) => {
  const [inputVal, setInputVal] = useState(value || "");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filtered, setFiltered] = useState<string[]>([]);

  const allLabels = formulaOptions.map((o: any) => o.label);

  const handleChange = (e: any) => {
    let val = e.target.value;

    // ✅ Allow clearing the input completely
    if (val === "") {
      setInputVal("");
      onChange?.(e);
      setShowSuggestions(false);
      return;
    }

    // ❌ Reject input with disallowed characters
    if (!allowedSymbolsRegex.test(val)) return;

    // ✅ Wrap known labels without #
    formulaOptions.forEach((opt: any) => {
      const label = opt.label;
      const labelRegex = new RegExp(`(?<!#)\\b${label}\\b(?!#)`, "g");
      val = val.replace(labelRegex, `#${label}#`);
    });

    // ✅ Update state and propagate
    setInputVal(val);
    onChange?.({ target: { value: val } });

    // 🔍 Handle @-based suggestions
    const atIndex = val.lastIndexOf("@");
    if (atIndex >= 0) {
      const keyword = val.slice(atIndex + 1).toLowerCase();
      const suggestions = allLabels.filter((label: string) =>
        label.toLowerCase().startsWith(keyword)
      );
      setFiltered(suggestions);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const applySuggestion = (label: string) => {
    const atIndex = inputVal.lastIndexOf("@");
    const beforeAt = inputVal.slice(0, atIndex);
    const newVal = `${beforeAt}#${label}# `;

    setInputVal(newVal);
    onChange?.({ target: { value: newVal } });
    setShowSuggestions(false);
  };

  return (
    <div style={{ position: "relative" }}>
      <PInput
        type="text"
        label={label}
        value={inputVal}
        onChange={handleChange}
        disabled={disabled}
        // allowClear
        style={{ width: width ? width : "100%" }}
      />
      {showSuggestions && filtered.length > 0 && (
        <ul className="suggestion-box">
          {filtered.map((label) => (
            <li key={label} onMouseDown={() => applySuggestion(label)}>
              {label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FormulaInputWrapper;
