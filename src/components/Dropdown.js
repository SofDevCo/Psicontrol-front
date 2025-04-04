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
    if (!isOpen || !dropdownRef.current || !triggerRef.current) return;

    const updatePosition = () => {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const dropdownRect = dropdownRef.current.getBoundingClientRect();
      
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      let left, top;
      
    
      switch (position) {
        case "bottom-right":
          left = triggerRect.right - dropdownRect.width;
          top = triggerRect.bottom + 8;
          break;
        case "bottom-left":
          left = triggerRect.left;
          top = triggerRect.bottom + 8;
          break;
        case "top-right":
          left = triggerRect.right - dropdownRect.width;
          top = triggerRect.top - dropdownRect.height - 8;
          break;
        case "top-left":
          left = triggerRect.left;
          top = triggerRect.top - dropdownRect.height - 8;
          break;
        default:
          left = triggerRect.right - dropdownRect.width;
          top = triggerRect.bottom + 8;
      }
      
      if (left < 0) left = 0;
      if (left + dropdownRect.width > viewportWidth) {
        left = viewportWidth - dropdownRect.width;
      }
      
      if (top < 0) top = 0;
      if (top + dropdownRect.height > viewportHeight) {
        top = viewportHeight - dropdownRect.height;
      }
    
      dropdownRef.current.style.left = `${left}px`;
      dropdownRef.current.style.top = `${top}px`;
    };

    updatePosition();
    
    window.addEventListener('scroll', updatePosition);
    window.addEventListener('resize', updatePosition);
    
    return () => {
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen, position, triggerRef]);

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
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="fixed z-50"
      style={{ width, maxHeight }}
    >
      <div className="bg-bg2 border border-cinza6 rounded-md shadow-default overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default Dropdown;