import React, { useRef, useEffect } from "react";

const Dropdown = ({
  isOpen,
  onClose,
  children,
  position = "bottom-right",
  width = "auto",
  maxHeight = "none",
  triggerRef,
}) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose, triggerRef]);

  const handleClickInside = (event) => {
    const isActionElement =
      event.target.tagName.toLowerCase() === "button" ||
      event.target.closest("button") ||
      event.target.onclick ||
      event.target.closest("[onClick]");

    if (isActionElement) {
      onClose();
    }
  };

  if (!isOpen) return null;
  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-1 z-50"
      style={{ width, maxHeight }}
      onClick={handleClickInside}
    >
      <div className="bg-bg2 border border-cinza6 rounded-l-md shadow-default overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default Dropdown;
