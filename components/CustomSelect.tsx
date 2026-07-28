"use client";

import { KeyboardEvent, useEffect, useId, useRef, useState } from "react";

export type SelectOption = { value: string | number; label: string; detail?: string };

interface CustomSelectProps {
  id: string;
  value: string | number;
  options: SelectOption[];
  onChange: (value: string) => void;
}

export default function CustomSelect({ id, value, options, onChange }: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const listboxId = useId();
  const selected = options.find((option) => String(option.value) === String(value)) ?? options[0];

  useEffect(() => {
    const closeOnOutsidePress = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutsidePress);
    return () => document.removeEventListener("mousedown", closeOnOutsidePress);
  }, []);

  const moveFocus = (currentIndex: number, direction: 1 | -1) => {
    const nextIndex = (currentIndex + direction + options.length) % options.length;
    optionRefs.current[nextIndex]?.focus();
  };

  const handleOptionKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === "ArrowDown") { event.preventDefault(); moveFocus(index, 1); }
    if (event.key === "ArrowUp") { event.preventDefault(); moveFocus(index, -1); }
    if (event.key === "Home") { event.preventDefault(); optionRefs.current[0]?.focus(); }
    if (event.key === "End") { event.preventDefault(); optionRefs.current[options.length - 1]?.focus(); }
    if (event.key === "Escape") { event.preventDefault(); setOpen(false); document.getElementById(id)?.focus(); }
  };

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
      window.requestAnimationFrame(() => {
        const selectedIndex = Math.max(0, options.findIndex((option) => String(option.value) === String(value)));
        const index = event.key === "ArrowDown" ? selectedIndex : (selectedIndex - 1 + options.length) % options.length;
        optionRefs.current[index]?.focus();
      });
    }
  };

  const openMenu = () => {
    setOpen((isOpen) => {
      if (!isOpen) window.requestAnimationFrame(() => optionRefs.current.find(Boolean)?.focus());
      return !isOpen;
    });
  };

  return <div className="custom-select" ref={rootRef}>
    <button id={id} type="button" className="select-trigger" onClick={openMenu} onKeyDown={handleTriggerKeyDown} aria-haspopup="listbox" aria-expanded={open} aria-controls={listboxId}>
      <span className="select-value"><span>{selected.label}</span>{selected.detail && <small>{selected.detail}</small>}</span>
      <svg className={open ? "select-chevron open" : "select-chevron"} viewBox="0 0 20 20" aria-hidden="true"><path d="m5.5 7.5 4.5 4.5 4.5-4.5" /></svg>
    </button>
    {open && <div id={listboxId} className="select-menu" role="listbox" aria-labelledby={id}>
      {options.map((option, index) => {
        const active = String(option.value) === String(value);
        return <button key={String(option.value)} ref={(element) => { optionRefs.current[index] = element; }} type="button" role="option" aria-selected={active} className={active ? "select-option selected" : "select-option"} onKeyDown={(event) => handleOptionKeyDown(event, index)} onClick={() => { onChange(String(option.value)); setOpen(false); }}>
          <span><strong>{option.label}</strong>{option.detail && <small>{option.detail}</small>}</span>
          {active && <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m4 10 3.4 3.4L16 5" /></svg>}
        </button>;
      })}
    </div>}
  </div>;
}
