export const detectBrowserConsole = (setIsOpen) => {
    const devtools = {
      isOpen: false,
      orientation: undefined,
    };
  
    const threshold = 170;
  
    const emitEvent = (isOpen, orientation) => {
      window.globalThis.dispatchEvent(
        new window.globalThis.CustomEvent("devtoolschange", {
          detail: {
            isOpen,
            orientation,
          },
        })
      );
    };
  
    const main = ({ emitEvents = true } = {}) => {
      const widthThreshold =
        window.globalThis.outerWidth - window.globalThis.innerWidth > threshold;
      const heightThreshold =
        window.globalThis.outerHeight - window.globalThis.innerHeight > threshold;
      const orientation = widthThreshold ? "vertical" : "horizontal";
  
      if (
        !(heightThreshold && widthThreshold) &&
        ((window.globalThis.Firebug &&
          window.globalThis.Firebug.chrome &&
          window.globalThis.Firebug.chrome.isInitialized) ||
          widthThreshold ||
          heightThreshold)
      ) {
        if (
          (!devtools.isOpen || devtools.orientation !== orientation) &&
          emitEvents
        ) {
          emitEvent(true, orientation);
        }
  
        devtools.isOpen = true;
        devtools.orientation = orientation;
      } else {
        if (devtools.isOpen && emitEvents) {
          emitEvent(false, undefined);
        }
  
        devtools.isOpen = false;
        devtools.orientation = undefined;
      }
      // alert(JSON.stringify(devtools, null, 4))
      setIsOpen(devtools.isOpen);
    };
  
    main({ emitEvents: false });
  };