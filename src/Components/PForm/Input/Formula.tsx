import React, { useEffect, useRef, useState } from "react";
import { PInput } from "./PInput";

const allowedSymbolsRegex = /^[0-9a-zA-Z@#'()+\-*/.%xX\s]*$/;

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
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [prevVal, setPrevVal] = useState(value || "");
  const wrapperRef = useRef<HTMLDivElement>(null);

  const allLabels = formulaOptions.map((o: any) => o.label);
  const validLabelsSet = new Set(allLabels.map((l: string) => l.toLowerCase()));

  const findFirstDiffIndex = (a: string, b: string): number => {
    const len = Math.min(a.length, b.length);
    for (let i = 0; i < len; i++) {
      if (a[i] !== b[i]) return i;
    }
    return a.length !== b.length ? len : -1;
  };

  const getLabelTokenAt = (str: string, index: number) => {
    const regex = /#([^#]+)#/g;
    let match;
    while ((match = regex.exec(str))) {
      const start = match.index;
      const end = start + match[0].length;
      if (index >= start && index <= end) {
        return { fullMatch: match[0], start, end };
      }
    }
    return null;
  };

  const handleChange = (e: any) => {
    let val = e.target.value;
    const diffIndex = findFirstDiffIndex(prevVal, val);

    // Convert 'x' or 'X' to '*'
    // eslint-disable-next-line no-useless-escape
    val = val.replace(/(?<=\d|\#\w+\#)\s*[xX]\s*(?=\d|\#\w+\#)/g, " * ");

    // Prevent partial deletion of a label
    if (diffIndex !== -1) {
      const deleted = prevVal.length > val.length;
      if (deleted) {
        const token = getLabelTokenAt(prevVal, diffIndex);
        if (token) {
          const cleaned = prevVal.replace(token.fullMatch, "");
          setPrevVal(cleaned);
          setInputVal(cleaned);
          onChange?.({ target: { value: cleaned } });
          return;
        }
      }
    }

    // Allow clearing
    if (val === "") {
      setPrevVal("");
      setInputVal("");
      onChange?.({ target: { value: "" } });
      setShowSuggestions(false);
      return;
    }

    // Reject invalid characters
    if (!allowedSymbolsRegex.test(val)) return;

    // Validate words
    const words = val.split(/[^a-zA-Z]+/).filter(Boolean);
    for (const word of words) {
      if (!validLabelsSet.has(word.toLowerCase())) return;
    }

    // Auto-wrap valid plain labels
    formulaOptions.forEach((opt: any) => {
      const label = opt.label;
      const labelRegex = new RegExp(`(?<!#)\\b${label}\\b(?!#)`, "g");
      val = val.replace(labelRegex, `#${label}#`);
    });

    setPrevVal(val);
    setInputVal(val);
    onChange?.({ target: { value: val } });

    // Trigger suggestions if @ is present
    const atIndex = val.lastIndexOf("@");
    if (atIndex >= 0) {
      // Extract only word characters (letters) after the last @
      const afterAt = val.slice(atIndex + 1);
      const match = afterAt.match(/^[a-zA-Z]*/); // stops at symbol/space
      const keyword = match ? match[0].toLowerCase() : "";

      if (keyword) {
        const suggestions = allLabels.filter((label: string) =>
          label.toLowerCase().startsWith(keyword)
        );
        setFiltered(suggestions);
        setShowSuggestions(true);
      } else {
        // @ is typed, but no valid characters yet
        setFiltered(allLabels);
        setShowSuggestions(true);
      }
    } else {
      setShowSuggestions(false);
    }
  };

  const applySuggestion = (label: string) => {
    const atIndex = inputVal.lastIndexOf("@");
    const before = inputVal.slice(0, atIndex);
    const after = inputVal.slice(atIndex + 1);
    const newVal = `${before}#${label}# `;

    setInputVal(newVal);
    setPrevVal(newVal);
    onChange?.({ target: { value: newVal } });
    setShowSuggestions(false);
  };

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const input = wrapper.querySelector("input.ant-input");
    if (!input) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (
        e.key === "Enter" &&
        showSuggestions &&
        filtered[selectedIndex]
      ) {
        e.preventDefault();
        applySuggestion(filtered[selectedIndex]);
      }
    };

    input.addEventListener("keydown", handleKeyDown as any);
    return () => input.removeEventListener("keydown", handleKeyDown as any);
  }, [filtered, selectedIndex, showSuggestions]);

  return (
    <div style={{ position: "relative" }} ref={wrapperRef}>
      <PInput
        type="text"
        label={label}
        value={inputVal}
        onChange={handleChange}
        disabled={disabled}
        style={{ width }}
      />
      {showSuggestions && filtered.length > 0 && (
        <ul className="suggestion-box">
          {filtered.map((label, idx) => (
            <li
              key={label}
              className={idx === selectedIndex ? "active" : ""}
              onMouseDown={() => applySuggestion(label)}
            >
              {label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FormulaInputWrapper;
