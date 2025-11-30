"use client";

import { ReactElement } from "react";

interface FieldHighlight {
  field: string;
  severity: "error" | "warning";
}

interface IJsonViewer {
  data: any;
  highlightErrors?: string[];
  highlightFields?: FieldHighlight[];
}

export default function JsonViewer({
  data,
  highlightErrors = [],
  highlightFields = []
}: IJsonViewer) {
  // Helper function to check if a field should be highlighted and with what severity
  const getFieldHighlight = (fieldName: string): FieldHighlight | null => {
    // Check in highlightFields array (new format with severity)
    const found = highlightFields.find(h => h.field === fieldName);
    if (found) return found;

    // Check in legacy highlightErrors array (backwards compatibility)
    if (highlightErrors.includes(fieldName)) {
      return { field: fieldName, severity: "error" };
    }

    return null;
  };

  // Helper to find if a value matches a field in the Fields array
  const findFieldHighlight = (obj: any): FieldHighlight | null => {
    if (obj && typeof obj === "object" && obj.Fields) {
      return getFieldHighlight(obj.Fields);
    }
    return null;
  };

  const formatJson = (obj: any, indent = 0, parentKey?: string): ReactElement[] => {
    const elements: ReactElement[] = [];
    const spaces = "  ".repeat(indent);

    if (typeof obj === "object" && obj !== null) {
      if (Array.isArray(obj)) {
        elements.push(<span key={`arr-start-${indent}`}>{"[\n"}</span>);
        obj.forEach((item, index) => {
          elements.push(<span key={`arr-${indent}-${index}`}>{spaces}  </span>);

          // Check if this array item should be highlighted (for Fields array)
          const itemHighlight = findFieldHighlight(item);

          if (itemHighlight) {
            elements.push(
              <span
                key={`highlighted-${indent}-${index}`}
                className={`json-highlight-${itemHighlight.severity}`}
                style={{
                  display: "inline-block",
                  backgroundColor: itemHighlight.severity === "error"
                    ? "rgba(239, 68, 68, 0.15)"
                    : "rgba(251, 191, 36, 0.15)",
                  borderLeft: `3px solid ${itemHighlight.severity === "error"
                    ? "var(--error)"
                    : "var(--warning)"}`,
                  paddingLeft: "0.5rem",
                  marginLeft: "-0.5rem",
                  borderRadius: "4px",
                }}
              >
                {formatJson(item, indent + 1)}
              </span>
            );
          } else {
            elements.push(...formatJson(item, indent + 1));
          }

          if (index < obj.length - 1) {
            elements.push(<span key={`comma-${indent}-${index}`}>,</span>);
          }
          elements.push(<span key={`newline-${indent}-${index}`}>{"\n"}</span>);
        });
        elements.push(<span key={`arr-end-${indent}`}>{spaces}]</span>);
      } else {
        elements.push(<span key={`obj-start-${indent}`}>{"{\n"}</span>);
        const keys = Object.keys(obj);
        keys.forEach((key, index) => {
          const value = obj[key];
          const highlight = getFieldHighlight(key);

          elements.push(<span key={`key-${indent}-${key}`}>{spaces}  </span>);

          // Highlight the key if it has an error/warning
          elements.push(
            <span
              key={`keyname-${indent}-${key}`}
              className="json-key"
              style={highlight ? {
                color: highlight.severity === "error" ? "var(--error)" : "var(--warning)",
                fontWeight: "bold",
              } : {}}
            >
              "{key}"
            </span>
          );
          elements.push(<span key={`colon-${indent}-${key}`}>: </span>);

          // Highlight the value if it has an error/warning
          if (highlight && typeof value === "string") {
            elements.push(
              <span
                key={`val-${indent}-${key}`}
                className={`json-string json-highlight-${highlight.severity}`}
                style={{
                  backgroundColor: highlight.severity === "error"
                    ? "rgba(239, 68, 68, 0.2)"
                    : "rgba(251, 191, 36, 0.2)",
                  padding: "2px 6px",
                  borderRadius: "3px",
                  border: `1px solid ${highlight.severity === "error"
                    ? "var(--error)"
                    : "var(--warning)"}`,
                }}
              >
                "{value}"
              </span>
            );
          } else if (highlight && typeof value === "number") {
            elements.push(
              <span
                key={`val-${indent}-${key}`}
                className={`json-number json-highlight-${highlight.severity}`}
                style={{
                  backgroundColor: highlight.severity === "error"
                    ? "rgba(239, 68, 68, 0.2)"
                    : "rgba(251, 191, 36, 0.2)",
                  padding: "2px 6px",
                  borderRadius: "3px",
                  border: `1px solid ${highlight.severity === "error"
                    ? "var(--error)"
                    : "var(--warning)"}`,
                }}
              >
                {value}
              </span>
            );
          } else {
            elements.push(...formatJson(value, indent + 1, key));
          }

          if (index < keys.length - 1) {
            elements.push(<span key={`comma-${indent}-${key}`}>,</span>);
          }
          elements.push(<span key={`newline-${indent}-${key}`}>{"\n"}</span>);
        });
        elements.push(<span key={`obj-end-${indent}`}>{spaces}{"}"}</span>);
      }
    } else if (typeof obj === "string") {
      elements.push(
        <span key={`str-${indent}`} className="json-string">
          "{obj}"
        </span>
      );
    } else if (typeof obj === "number") {
      elements.push(
        <span key={`num-${indent}`} className="json-number">
          {obj}
        </span>
      );
    } else if (typeof obj === "boolean") {
      elements.push(
        <span key={`bool-${indent}`} className="json-boolean">
          {obj.toString()}
        </span>
      );
    } else if (obj === null) {
      elements.push(
        <span key={`null-${indent}`} className="json-null">
          null
        </span>
      );
    }

    return elements;
  };

  return (
    <div className="json-viewer">
      <pre className="m-0 text-secondary-200">{formatJson(data)}</pre>
    </div>
  );
}
