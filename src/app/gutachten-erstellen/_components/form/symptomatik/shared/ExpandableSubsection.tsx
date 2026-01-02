'use client';

import { useRef, useEffect } from 'react';
import { ExpandableSubsectionProps } from './types';

export function ExpandableSubsection({ title, children, isExpanded, onToggle, level = 0 }: ExpandableSubsectionProps) {
  const indentClass = level === 0 ? '' : level === 1 ? 'ml-6' : 'ml-12';
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const wasManualToggle = useRef<boolean>(false);

  const handleToggle = () => {
    wasManualToggle.current = true;
    onToggle();
  };

  useEffect(() => {
    if (isExpanded && sectionRef.current && wasManualToggle.current) {
      // Small delay to allow animation to start
      setTimeout(() => {
        if (sectionRef.current && contentRef.current) {
          const rect = sectionRef.current.getBoundingClientRect();
          const contentHeight = contentRef.current.scrollHeight;
          const viewportHeight = window.innerHeight;
          const currentScrollY = window.scrollY;

          // Calculate if content will be visible
          const availableSpace = viewportHeight - rect.top;

          // If content won't fit in viewport, scroll to show it better
          if (contentHeight > availableSpace * 0.7) {
            const targetScroll = currentScrollY + rect.top - (viewportHeight * 0.2);
            window.scrollTo({
              top: Math.max(0, targetScroll),
              behavior: 'smooth'
            });
          }
        }
      }, 50);
    }

    // Reset the manual toggle flag after handling the expansion
    if (isExpanded) {
      setTimeout(() => {
        wasManualToggle.current = false;
      }, 100);
    }
  }, [isExpanded]);

  return (
    <div className={`${indentClass} relative`} ref={sectionRef}>
      <button
        onClick={handleToggle}
        className={`w-full p-3 text-left hover:bg-foreground/5 hover:shadow-sm active:scale-[0.98] transition-all duration-200 ease-in-out flex items-center justify-between rounded-md group relative z-10 border border-foreground/20 ${isExpanded ? 'bg-foreground/5' : ''}`}
      >
        <h4 className="text-lg font-medium text-foreground">{title}</h4>
        <span className={`text-lg text-foreground/60 ml-2 transition-all duration-200 ease-in-out ${isExpanded ? 'scale-110' : 'scale-100'}`}>
          {isExpanded ? '−' : '+'}
        </span>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
        isExpanded ? 'max-h-none opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div
          ref={contentRef}
          className={`mt-2 mb-6 transition-all duration-200 ${
            isExpanded ? 'transform translate-y-0 delay-100' : 'transform -translate-y-2'
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
