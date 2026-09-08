"use client";

import React, { useState } from "react";
import { Check, Copy, WrapText } from "lucide-react";
import { useAtlasStore } from "@/store/useAtlasStore";

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  maxHeight?: string;
}

export function CodeBlock({
  code,
  language = "yaml",
  title,
  maxHeight = "max-h-96",
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [wrap, setWrap] = useState(true);
  const theme = useAtlasStore((state) => state.theme);
  const isLight = theme === "light";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error("Failed to copy code", e);
    }
  };

  // Fast tokenizing formatter for XML, YAML, JSON, SPL, YARA
  const formatTokens = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      let formattedLine: React.ReactNode = line;

      if (language === "yaml" || language === "sigma") {
        if (line.trim().startsWith("#")) {
          formattedLine = (
            <span className={isLight ? "text-slate-400 italic" : "text-slate-500 italic"}>
              {line}
            </span>
          );
        } else if (line.includes(":")) {
          const colonIdx = line.indexOf(":");
          const key = line.slice(0, colonIdx);
          const val = line.slice(colonIdx + 1);
          formattedLine = (
            <span>
              <span
                className={`font-semibold ${
                  isLight ? "text-cyan-700" : "text-cyan-400"
                }`}
              >
                {key}:
              </span>
              <span className={isLight ? "text-emerald-700 font-medium" : "text-emerald-300"}>
                {val}
              </span>
            </span>
          );
        }
      } else if (language === "xml") {
        if (line.includes("<") && line.includes(">")) {
          const tagRegex = /(<\/?[a-zA-Z0-9_:-]+)(\s+[^>]+)?(\/?>)/g;
          const parts: React.ReactNode[] = [];
          let lastIndex = 0;
          let match;

          while ((match = tagRegex.exec(line)) !== null) {
            if (match.index > lastIndex) {
              parts.push(
                <span
                  key={lastIndex}
                  className={isLight ? "text-slate-800" : "text-slate-200"}
                >
                  {line.substring(lastIndex, match.index)}
                </span>
              );
            }
            parts.push(
              <span
                key={match.index}
                className={isLight ? "text-amber-700 font-semibold" : "text-amber-400 font-semibold"}
              >
                {match[1]}
                {match[2] && (
                  <span className={isLight ? "text-cyan-700" : "text-cyan-300"}>
                    {match[2]}
                  </span>
                )}
                {match[3]}
              </span>
            );
            lastIndex = tagRegex.lastIndex;
          }
          if (lastIndex < line.length) {
            parts.push(
              <span
                key={lastIndex}
                className={isLight ? "text-slate-800" : "text-slate-200"}
              >
                {line.substring(lastIndex)}
              </span>
            );
          }
          formattedLine = parts;
        }
      } else if (language === "json") {
        if (line.includes(":")) {
          const colonIdx = line.indexOf(":");
          const key = line.slice(0, colonIdx);
          const val = line.slice(colonIdx + 1);
          formattedLine = (
            <span>
              <span className={isLight ? "text-purple-700 font-semibold" : "text-purple-400 font-semibold"}>
                {key}:
              </span>
              <span className={isLight ? "text-emerald-700 font-medium" : "text-emerald-300"}>
                {val}
              </span>
            </span>
          );
        }
      }

      return (
        <div key={idx} className="table-row">
          <span
            className={`table-cell pr-3 text-right select-none text-[11px] font-mono w-7 shrink-0 ${
              isLight ? "text-slate-400" : "text-slate-600"
            }`}
          >
            {idx + 1}
          </span>
          <span
            className={`table-cell font-mono text-xs ${
              wrap ? "whitespace-pre-wrap break-all" : "whitespace-pre"
            } ${isLight ? "text-slate-800" : "text-slate-200"}`}
          >
            {formattedLine}
          </span>
        </div>
      );
    });
  };

  return (
    <div
      className={`rounded-xl border overflow-hidden my-2 transition-colors ${
        isLight
          ? "border-slate-300 bg-slate-50 shadow-sm"
          : "border-slate-800 bg-slate-950 shadow-inner"
      }`}
    >
      {/* Header bar */}
      <div
        className={`flex items-center justify-between px-3 py-1.5 border-b ${
          isLight
            ? "bg-slate-200/80 border-slate-300"
            : "bg-slate-900/90 border-slate-800/80"
        }`}
      >
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          {title && (
            <span
              className={`text-[11px] font-mono font-medium truncate max-w-xs ${
                isLight ? "text-slate-700" : "text-slate-400"
              }`}
            >
              {title}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setWrap(!wrap)}
            className={`px-1.5 py-0.5 rounded text-[10px] font-mono border transition-colors flex items-center gap-1 ${
              wrap
                ? isLight
                  ? "bg-slate-300 text-slate-800 border-slate-400 font-semibold"
                  : "bg-slate-800 text-slate-200 border-slate-700 font-semibold"
                : isLight
                ? "bg-white text-slate-500 border-slate-300"
                : "bg-slate-950 text-slate-500 border-slate-800"
            }`}
            title={wrap ? "Disable Word Wrap" : "Enable Word Wrap"}
          >
            <WrapText className="w-3 h-3" />
            <span>Wrap</span>
          </button>

          <span
            className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded border ${
              isLight
                ? "text-slate-600 bg-white border-slate-300"
                : "text-slate-500 bg-slate-950 border-slate-800"
            }`}
          >
            {language}
          </span>

          <button
            onClick={handleCopy}
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono border transition-colors ${
              isLight
                ? "bg-white hover:bg-slate-100 text-slate-700 border-slate-300 shadow-sm"
                : "bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700"
            }`}
            title="Copy to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-slate-400" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code viewport */}
      <div className={`p-3 overflow-x-auto overflow-y-auto ${maxHeight} text-xs scrollbar-thin`}>
        <div className="table w-full">{formatTokens(code)}</div>
      </div>
    </div>
  );
}
