"use client";

import { useState } from "react";
import { ChevronIcon } from "@/components/icons";
import { faq } from "@/lib/content";

export function FaqList() {
  const [open, setOpen] = useState<number | null>(null);

  function focusItem(index: number) {
    document.getElementById(`faq-button-${index}`)?.focus();
  }

  return (
    <div className="faq-list">
      {faq.items.map((item, index) => {
        const expanded = open === index;
        const panelId = `faq-panel-${index}`;
        const buttonId = `faq-button-${index}`;
        return (
          <div className="faq-item" key={item.question}>
            <h3>
              <button
                id={buttonId}
                type="button"
                className="faq-button"
                aria-expanded={expanded}
                aria-controls={panelId}
                onClick={() => setOpen(expanded ? null : index)}
                onKeyDown={(event) => {
                  if (event.key === "ArrowDown") {
                    event.preventDefault();
                    focusItem((index + 1) % faq.items.length);
                  } else if (event.key === "ArrowUp") {
                    event.preventDefault();
                    focusItem((index - 1 + faq.items.length) % faq.items.length);
                  } else if (event.key === "Home") {
                    event.preventDefault();
                    focusItem(0);
                  } else if (event.key === "End") {
                    event.preventDefault();
                    focusItem(faq.items.length - 1);
                  }
                }}
              >
                <span>{item.question}</span>
                <ChevronIcon className={expanded ? "chevron is-open" : "chevron"} />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!expanded}
            >
              <p className="faq-answer">{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
