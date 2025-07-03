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
  const [selectedIndex, setSelectedIndex] = useState<any>(0);
  const [prevVal, setPrevVal] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  const allLabels = formulaOptions.map((o: any) => o.label);
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

    // ✅ Convert last typed 'x' or 'X' to '*'
    if (val[val.length - 1]?.toLowerCase() === "x") {
      const lastCharIndex = val.length - 1;
      const before = val.slice(0, lastCharIndex);
      const after = val.slice(lastCharIndex + 1);
      val = before + "*" + after;
    }

    // ✅ If user partially deletes a #Label#, auto-remove full block
    const diffIndex = findFirstDiffIndex(prevVal, val);
    if (diffIndex !== -1) {
      const fullMatch = getLabelTokenAt(prevVal, diffIndex);
      if (fullMatch) {
        const cleaned = prevVal.replace(fullMatch.fullMatch, "");
        setPrevVal(cleaned);
        setInputVal(cleaned);
        onChange?.({ target: { value: cleaned } });
        return;
      }
    }

    // ✅ Allow clearing input
    if (val === "") {
      setPrevVal("");
      setInputVal("");
      onChange?.(e);
      setShowSuggestions(false);
      return;
    }

    // ❌ Reject disallowed characters
    if (!allowedSymbolsRegex.test(val)) return;

    // ✅ Tokenize and check if words are valid labels
    const tokens = val.split(/[^a-zA-Z]+/).filter(Boolean);
    const validLabels = formulaOptions.map((opt: any) =>
      opt.label.toLowerCase()
    );

    for (const word of tokens) {
      if (!validLabels.includes(word.toLowerCase())) {
        return;
      }
    }

    // ✅ Wrap plain labels with #...#
    formulaOptions.forEach((opt: any) => {
      const label = opt.label;
      const labelRegex = new RegExp(`(?<!#)\\b${label}\\b(?!#)`, "g");
      val = val.replace(labelRegex, `#${label}#`);
    });

    // ✅ Final update
    setPrevVal(val);
    setInputVal(val);
    onChange?.({ target: { value: val } });

    // 🔍 Suggestion logic
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
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const input = wrapper.querySelector("input.ant-input");
    if (!input) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev: any) =>
          Math.min(prev + 1, filtered.length - 1)
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev: any) => Math.max(prev - 1, 0));
      } else if (
        e.key === "Enter" &&
        showSuggestions &&
        filtered[selectedIndex]
      ) {
        e.preventDefault();
        applySuggestion(filtered[selectedIndex]);
      }
    };
    // @ts-ignore or eslint-disable-next-line
    input.addEventListener("keydown", handleKeyDown);
    // @ts-ignore or eslint-disable-next-line
    return () => input.removeEventListener("keydown", handleKeyDown);
  }, [filtered, selectedIndex, showSuggestions]);

  return (
    <div style={{ position: "relative" }} ref={wrapperRef}>
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
