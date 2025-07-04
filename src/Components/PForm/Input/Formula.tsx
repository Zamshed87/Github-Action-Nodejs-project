import React, { useEffect, useRef, useState } from "react";
import { PInput } from "./PInput";

// const allowedSymbolsRegex = /^[0-9a-zA-Z@#'()+\-*/.%xX\s]*$/;
// const allowedSymbolsRegex = /^[0-9a-zA-Z@#'()+\-*\/.%xX\s]*$/;
// eslint-disable-next-line no-useless-escape
const allowedSymbolsRegex = /^[0-9a-zA-Z@#'()+\-*\/.%xX\s]*$/;

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

  // const handleChange = (e: any) => {
  //   let val = e.target.value;
  //   const diffIndex = findFirstDiffIndex(prevVal, val);

  //   // Convert 'x' or 'X' to '*'
  //   // eslint-disable-next-line no-useless-escape
  //   // val = val.replace(/(?<=\d|\#\w+\#)\s*[xX]\s*(?=\d|\#\w+\#)/g, " * ");
  //   // Handle x/X to * conversion only when it's between numbers or labels
  //   if (prevVal.length + 1 === val.length) {
  //     const lastChar = val[val.length - 1].toLowerCase();
  //     if (lastChar === "x") {
  //       // Check if the x is between two valid operands (numbers or labels)
  //       const prevChar = val[val.length - 2];
  //       const isBetweenOperands =
  //         /\d|#/.test(prevChar) ||
  //         (val.length > 2 && /\d|#/.test(val[val.length - 3]));
  //       if (isBetweenOperands) {
  //         val = val.slice(0, -1) + "*";
  //       }
  //     }
  //   }
  //   // Prevent partial deletion of a label
  //   if (diffIndex !== -1) {
  //     const deleted = prevVal.length > val.length;
  //     if (deleted) {
  //       const token = getLabelTokenAt(prevVal, diffIndex);
  //       if (token) {
  //         const cleaned = prevVal.replace(token.fullMatch, "");
  //         setPrevVal(cleaned);
  //         setInputVal(cleaned);
  //         onChange?.({ target: { value: cleaned } });
  //         return;
  //       }
  //     }
  //   }

  //   // Allow clearing
  //   if (val === "") {
  //     setPrevVal("");
  //     setInputVal("");
  //     onChange?.({ target: { value: "" } });
  //     setShowSuggestions(false);
  //     return;
  //   }

  //   // Reject invalid characters
  //   if (!allowedSymbolsRegex.test(val)) return;

  //   // Validate words
  //   const words = val.split(/[^a-zA-Z]+/).filter(Boolean);
  //   for (const word of words) {
  //     if (!validLabelsSet.has(word.toLowerCase())) return;
  //   }

  //   // Auto-wrap valid plain labels
  //   formulaOptions.forEach((opt: any) => {
  //     const label = opt.label;
  //     const labelRegex = new RegExp(`(?<!#)\\b${label}\\b(?!#)`, "g");
  //     val = val.replace(labelRegex, `#${label}#`);
  //   });

  //   setPrevVal(val);
  //   setInputVal(val);
  //   onChange?.({ target: { value: val } });

  //   // Trigger suggestions if @ is present
  //   const atIndex = val.lastIndexOf("@");
  //   if (atIndex >= 0) {
  //     // Extract only word characters (letters) after the last @
  //     const afterAt = val.slice(atIndex + 1);
  //     const match = afterAt.match(/^[a-zA-Z]*/); // stops at symbol/space
  //     const keyword = match ? match[0].toLowerCase() : "";

  //     if (keyword) {
  //       const suggestions = allLabels.filter((label: string) =>
  //         label.toLowerCase().startsWith(keyword)
  //       );
  //       setFiltered(suggestions);
  //       setShowSuggestions(true);
  //     } else {
  //       // @ is typed, but no valid characters yet
  //       setFiltered(allLabels);
  //       setShowSuggestions(true);
  //     }
  //   } else {
  //     setShowSuggestions(false);
  //   }
  // };
  // ------------------------------------------
  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   let val = e.target.value;
  //   const diffIndex = findFirstDiffIndex(prevVal, val);

  //   // Handle x/X to * conversion in multiplication contexts
  //   if (prevVal.length + 1 === val.length) {
  //     // Only on new character insertion
  //     const lastChar = val[val.length - 1].toLowerCase();
  //     if (lastChar === "x") {
  //       // Check if we're between operands (numbers or labels)
  //       const isMultiplicationContext = () => {
  //         // Look backward for operand
  //         let i = val.length - 2;
  //         while (i >= 0) {
  //           if (/\d/.test(val[i])) return true; // Number
  //           if (val[i] === "#") {
  //             // Found label end, now look for label start
  //             let j = i - 1;
  //             while (j >= 0 && val[j] !== "#") j--;
  //             if (j >= 0) return true; // Complete label found
  //           }
  //           if (!/\s/.test(val[i])) break; // Not whitespace
  //           i--;
  //         }

  //         // Look forward for operand
  //         i = val.length;
  //         while (i < val.length) {
  //           if (/\d/.test(val[i])) return true; // Number
  //           if (val[i] === "#") {
  //             // Found label start, now look for label end
  //             let j = i + 1;
  //             while (j < val.length && val[j] !== "#") j++;
  //             if (j < val.length) return true; // Complete label found
  //           }
  //           if (!/\s/.test(val[i])) break; // Not whitespace
  //           i++;
  //         }

  //         return false;
  //       };

  //       if (isMultiplicationContext()) {
  //         val = val.slice(0, -1) + "*";
  //       }
  //     }
  //   }

  //   // Prevent partial deletion of a label
  //   if (diffIndex !== -1 && prevVal.length > val.length) {
  //     const token = getLabelTokenAt(prevVal, diffIndex);
  //     if (token) {
  //       const cleaned = prevVal.replace(token.fullMatch, "");
  //       setPrevVal(cleaned);
  //       setInputVal(cleaned);
  //       onChange?.({ target: { value: cleaned } });
  //       return;
  //     }
  //   }

  //   // Allow clearing the input
  //   if (val === "") {
  //     setPrevVal("");
  //     setInputVal("");
  //     onChange?.({ target: { value: "" } });
  //     setShowSuggestions(false);
  //     return;
  //   }

  //   // Reject invalid characters
  //   if (!allowedSymbolsRegex.test(val)) return;

  //   // Auto-wrap valid plain labels
  //   formulaOptions.forEach((opt: any) => {
  //     const label = opt.label;
  //     const labelRegex = new RegExp(`(?<!#)\\b${label}\\b(?!#)`, "g");
  //     val = val.replace(labelRegex, `#${label}#`);
  //   });

  //   setPrevVal(val);
  //   setInputVal(val);
  //   onChange?.({ target: { value: val } });

  //   // Handle suggestions
  //   const atIndex = val.lastIndexOf("@");
  //   if (atIndex >= 0) {
  //     const afterAt = val.slice(atIndex + 1);
  //     const match = afterAt.match(/^[a-zA-Z]*/);
  //     const keyword = match ? match[0].toLowerCase() : "";

  //     setFiltered(
  //       keyword
  //         ? allLabels.filter((label: string) =>
  //             label.toLowerCase().startsWith(keyword)
  //           )
  //         : allLabels
  //     );
  //     setShowSuggestions(true);
  //     setSelectedIndex(0);
  //   } else {
  //     setShowSuggestions(false);
  //   }
  // };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    const diffIndex = findFirstDiffIndex(prevVal, val);

    // 1. Reject invalid characters
    if (!allowedSymbolsRegex.test(val)) return;

    // 2. Prevent partial deletion of a #Label#
    if (diffIndex !== -1 && prevVal.length > val.length) {
      const token = getLabelTokenAt(prevVal, diffIndex);
      if (token) {
        const cleaned = prevVal.replace(token.fullMatch, "");
        setPrevVal(cleaned);
        setInputVal(cleaned);
        onChange?.({
          target: { value: cleaned },
        } as React.ChangeEvent<HTMLInputElement>);
        return;
      }
    }

    // 3. Convert X to * in valid math contexts
    // Examples: 10x5 → 10 * 5, #Basic# x 2 → #Basic# * 2
    val = val.replace(
      /(#[^#]+#|\d+|\))\s*[xX]\s*(#[^#]+#|\d+|\(|\s|$)/g,
      "$1 * $2"
    );
    val = val.replace(/\)\s*[xX]\s*(\d+|#\w+#)/gi, ") * $1");
    val = val.replace(/(^|\s)[xX](?=#\w+#|\d+)/g, "$1*");

    // 4. Token validation: ensure all raw words are known labels (outside of @typing)
    const atIndex = val.lastIndexOf("@");
    const beforeAt = atIndex !== -1 ? val.slice(0, atIndex) : val;
    const words = beforeAt.split(/[^a-zA-Z#]+/).filter(Boolean);
    for (const word of words) {
      if (word.includes("#")) continue; // skip already wrapped labels
      if (!validLabelsSet.has(word.toLowerCase())) return;
    }

    // 5. Auto-wrap labels with #...#
    formulaOptions.forEach((opt: any) => {
      const label = opt.label;
      const labelRegex = new RegExp(`(?<!#)\\b${label}\\b(?!#)`, "g");
      val = val.replace(labelRegex, `#${label}#`);
    });

    // 6. Final state updates
    setPrevVal(val);
    setInputVal(val);
    onChange?.({
      target: { value: val },
    } as React.ChangeEvent<HTMLInputElement>);

    // 7. Suggestions logic (@...)
    if (atIndex >= 0) {
      const afterAt = val.slice(atIndex + 1);
      const match = afterAt.match(/^[a-zA-Z]*/);
      const keyword = match ? match[0].toLowerCase() : "";

      setFiltered(
        keyword
          ? allLabels.filter((label: string) =>
              label.toLowerCase().startsWith(keyword)
            )
          : allLabels
      );
      setShowSuggestions(true);
      setSelectedIndex(0);
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
