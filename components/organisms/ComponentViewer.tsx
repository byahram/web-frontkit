"use client";

import React, { useState, useEffect } from "react";
import { mockComponents, ComponentSpec } from "../data/mockComponents";
import { CopyIcon, CheckIcon, InfoIcon } from "../atoms/Icons";
import { Button } from "../atoms/Button";
import { Badge } from "../atoms/Badge";
import { Input } from "../atoms/Input";
import { Card } from "../molecules/Card";

interface ComponentViewerProps {
  componentId: string;
}

export const ComponentViewer = ({ componentId }: ComponentViewerProps) => {
  const component = mockComponents.find((c) => c.id === componentId);
  const [propValues, setPropValues] = useState<Record<string, any>>({});
  const [copied, setCopied] = useState(false);

  // Reset/Set default props whenever component changes
  useEffect(() => {
    if (component) {
      const defaults: Record<string, any> = {};
      component.props.forEach((prop) => {
        defaults[prop.name] = prop.defaultValue;
      });
      setPropValues(defaults);
      setCopied(false);
    }
  }, [component]);

  if (!component) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <InfoIcon className="w-10 h-10 text-zinc-300 dark:text-zinc-700 mb-3" />
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
          Component Not Found
        </h3>
        <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-1 max-w-xs">
          Please select a valid component from the sidebar.
        </p>
      </div>
    );
  }

  const handlePropChange = (name: string, value: any) => {
    setPropValues((prev) => ({ ...prev, [name]: value }));
    setCopied(false);
  };

  const copyToClipboard = () => {
    const code = component.codeTemplate(propValues);
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Render active preview components using actual design system components
  const renderPreview = () => {
    switch (component.id) {
      case "button": {
        const { variant, size, disabled, isLoading, children } = propValues;
        return (
          <Button
            variant={variant}
            size={size}
            disabled={disabled}
            isLoading={isLoading}
          >
            {children}
          </Button>
        );
      }

      case "badge": {
        const { variant, size, children } = propValues;
        return (
          <Badge variant={variant} size={size}>
            {children}
          </Badge>
        );
      }

      case "input": {
        const { label, placeholder, type, error, disabled } = propValues;
        return (
          <Input
            type={type}
            label={label}
            placeholder={placeholder}
            error={error}
            disabled={disabled}
          />
        );
      }

      case "card": {
        const { title, description, showBadge, badgeText, buttonText } = propValues;
        return (
          <Card
            title={title}
            description={description}
            showBadge={showBadge}
            badgeText={badgeText}
            buttonText={buttonText}
          />
        );
      }

      default:
        return <div>Preview not implemented</div>;
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-4xl">
      {/* Header Info */}
      <section id="overview" className="scroll-mt-20">
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          {component.name}
        </h1>
        <p className="text-base text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
          {component.description}
        </p>
      </section>

      {/* Live Preview Area */}
      <section id="preview" className="scroll-mt-20 flex flex-col gap-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          Interactive Preview
        </h3>
        <div className="w-full h-72 border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/10 rounded-2xl flex items-center justify-center p-8 relative overflow-hidden">
          {/* Subtle dotted background grid */}
          <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-900/50 pointer-events-none" />
          <div className="z-10">{renderPreview()}</div>
        </div>
      </section>

      {/* Layout Split: Props Tuner & Code Copy */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column: Props Tuner Panel */}
        <section id="props" className="scroll-mt-20 md:col-span-7 flex flex-col gap-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Props Control Panel
          </h3>
          <div className="border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl bg-white dark:bg-zinc-950 p-5 divide-y divide-zinc-100 dark:divide-zinc-900">
            {component.props.map((prop) => {
              const currentVal = propValues[prop.name];

              return (
                <div key={prop.name} className="py-4 first:pt-0 last:pb-0 flex flex-col gap-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                        {prop.name}
                      </span>
                      <span className="text-[10px] font-semibold font-mono ml-2 px-1.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border border-zinc-200/50 dark:border-zinc-700/50">
                        {prop.type}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500">{prop.description}</p>

                  <div className="mt-2">
                    {/* Select controller */}
                    {prop.type === "select" && prop.options && (
                      <div className="relative inline-block w-full max-w-xs">
                        <select
                          value={currentVal || ""}
                          onChange={(e) => handlePropChange(prop.name, e.target.value)}
                          className="w-full text-sm py-2 px-3 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-lg text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-xs cursor-pointer"
                        >
                          {prop.options.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Boolean controller */}
                    {prop.type === "boolean" && (
                      <button
                        onClick={() => handlePropChange(prop.name, !currentVal)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${
                          currentVal ? "bg-indigo-600" : "bg-zinc-200 dark:bg-zinc-800"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            currentVal ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    )}

                    {/* Text controller */}
                    {prop.type === "text" && (
                      <input
                        type="text"
                        value={currentVal || ""}
                        onChange={(e) => handlePropChange(prop.name, e.target.value)}
                        className="w-full text-sm py-2 px-3 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-lg text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-xs placeholder-zinc-400"
                        placeholder="Type text prop..."
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Right Column: Code Copy Area */}
        <section id="usage" className="scroll-mt-20 md:col-span-5 flex flex-col gap-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Copy Code Area
          </h3>
          <div className="relative border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl bg-zinc-950 overflow-hidden flex flex-col h-full min-h-[300px] shadow-lg">
            {/* Toolbar header */}
            <div className="flex items-center justify-between px-4 py-2 bg-zinc-900/80 border-b border-zinc-900 text-xs text-zinc-400 font-mono">
              <span>jsx</span>
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-all cursor-pointer border border-zinc-800/80 hover:border-zinc-600/50"
              >
                {copied ? (
                  <>
                    <CheckIcon size={14} className="text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <CopyIcon size={14} />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* Code Block Container */}
            <pre className="flex-1 p-5 overflow-auto text-xs font-mono text-zinc-300 leading-relaxed text-left whitespace-pre">
              <code>{component.codeTemplate(propValues)}</code>
            </pre>
          </div>
        </section>
      </div>
    </div>
  );
};
