import React, { useState, useRef } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import style from "./autoComplete.module.css";
import { shallowEqual, useSelector } from "react-redux";
const AutoCompleteWithHint = () => {
  const history = useHistory();

  const [childMenu, setChildMenus] = useState([]);
  const { menuList } = useSelector((state) => state?.auth, shallowEqual);
  // let childMenu = [];
  React.useEffect(() => {
    const newChildMenus = [];
    menuList?.length > 0 &&
      menuList.forEach((menu) => {
        menu?.childList?.length > 0 &&
          menu?.childList.forEach((childMenu) => {
            newChildMenus.push(childMenu);
            childMenu?.childList?.length > 0 &&
              childMenu?.childList.forEach((thirdChild) => {
                newChildMenus.push(thirdChild);
              });
          });
      });
    // childMenu = newChildMenus;

    setChildMenus(newChildMenus);
  }, [menuList]);

  const [inputValue, setInputValue] = useState("");
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedKey, setSelectedKey] = useState("");
  const inputRef = useRef(null);

  const filterSuggestion = (inputValue) => {
    const filteredSuggestions = childMenu.filter((keyword) =>
      keyword.label.toLowerCase().startsWith(inputValue.toLowerCase())
    );
    return filteredSuggestions;
  };

  const handleInputChange = (event) => {
    const { value } = event.target;
    setInputValue(value);
    const filteredSuggestions = filterSuggestion(value);
    setSuggestions(filteredSuggestions);
    setShowSuggestion(true);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Tab" && suggestions.length > 0) {
      event.preventDefault();
      const suggestion = suggestions[0];
      setInputValue(suggestion.label);
      setSelectedKey(suggestion);
      setShowSuggestion(false);
    } else if (event.key === "Enter" && selectedKey) {
      history.push({
        pathname: `${selectedKey.to}`,
        state: {},
      });
    }
  };

  const handleClickOutside = (event) => {
    if (inputRef.current && !inputRef.current.contains(event.target)) {
      setShowSuggestion(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // const getCaretPosition = () => {
  //   if (!inputRef.current) return 0;
  //   return inputRef.current.selectionStart;
  // };

  const checkSuggestion = (inputValue) => {
    const suggestionText = suggestions[0]?.label;
    if (inputValue?.length > 3) {
      const text = suggestionText?.split("")?.map((char, index) => {
        const lowerCaseChar = char.toLowerCase();
        const upperCaseChar = char.toUpperCase();

        const inputValueChar = inputValue[index];

        if (index > inputValue?.length) return char;
        else if (inputValueChar === lowerCaseChar) {
          return lowerCaseChar;
        } else if (inputValueChar === upperCaseChar) {
          return upperCaseChar;
        } else return char;
      });
      return text?.join("");
    }
  };

  return (
    <div
      className={style?.autoCompleteContainer}
      style={{ position: "relative" }}
    >
      <input
        type="text"
        className={style?.autoCompleteInputField}
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        ref={inputRef}
        placeholder={`Type to get suggestions`}
      />
      {showSuggestion && suggestions.length > 0 && (
        <span
          style={{
            position: "absolute",
            top: "2px",
            left: "6px",
            zIndex: 1,
            background: "transparent",
            height: "100%",
            width: "100%",
            opacity: 0.4,
            margin: 0,
            padding: 0,
            outline: 0,
            border: "2px",
            fontSize: "14px",
          }}
        >
          {checkSuggestion(inputValue)}
        </span>
      )}
    </div>
  );
};

export default AutoCompleteWithHint;
