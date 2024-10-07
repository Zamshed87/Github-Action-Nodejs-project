import { useEffect, useState } from "react";
import "./LanguageDropdown.css";

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}

function LanguageDropdown() {
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const googleTranslateElementInit = () => {
    new window.google.translate.TranslateElement(
      {
        pageLanguage: "en",
        includedLanguages: "en,bn,hi,ar",
        autoDisplay: false,
      },
      "hireDesk_google_translate"
    );
  };

  useEffect(() => {
    const addScript = document.createElement("script");
    addScript.setAttribute(
      "src",
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
    );
    document.body.appendChild(addScript);
    window.googleTranslateElementInit = () => {
      googleTranslateElementInit();
      setIsLanguageDropdownOpen(true);

      const select: any = document.querySelector(".goog-te-combo");
      if (select === null) return;
      select.addEventListener("change", () => {
        handleLanguageDropdown();
      });

      let selectFind = false;
      const checkGoogleTECombo = () => {
        const select: any = document.querySelector(".goog-te-combo");
        if (selectFind) {
          clearInterval(intervalId);
        }
        if (select) {
          handleLanguageDropdown();
          selectFind = true;
        }
      };
      const intervalId = setInterval(checkGoogleTECombo, 500);
    };
    return () => {
      document.body.removeChild(addScript);
    };
  }, []);

  const handleLanguageDropdown = () => {
    const languageMap: any = {
      bn: "Bengali",
      ar: "Arabic",
      hi: "Hindi",
      en: "English",
    };
    const select: any = document.querySelector(".goog-te-combo");
    if (select === null) return;
    setTimeout(() => {
      const selectOptions = select?.options;
      for (let i = 0; i < selectOptions?.length; i++) {
        const option = selectOptions?.[i];
        if (languageMap[option?.value]) {
          option.text = languageMap[option?.value];
        }
      }
      if (
        ["Select Language", "ভাষা বেছে নিন"].includes(
          select?.options?.[select?.selectedIndex]?.text
        )
      ) {
        select.options[select?.selectedIndex].text = "English";
      }
    }, 500);
  };

  return (
    <>
      <div
        className="languageDropdownWraper"
        style={{
          display: isLanguageDropdownOpen ? "block" : "none",
          margin: "0 10px",
        }}
      >
        <div id="hireDesk_google_translate"></div>
      </div>
    </>
  );
}

export default LanguageDropdown;
