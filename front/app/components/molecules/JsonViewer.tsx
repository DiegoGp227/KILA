"use client";

interface IJsonViewer {
  data: any;
  highlightErrors?: string[];
}

export default function JsonViewer({ data, highlightErrors = [] }: IJsonViewer) {
  const formatJson = (obj: any, indent = 0): JSX.Element[] => {
    const elements: JSX.Element[] = [];
    const spaces = "  ".repeat(indent);

    if (typeof obj === "object" && obj !== null) {
      if (Array.isArray(obj)) {
        elements.push(<span key={`arr-start-${indent}`}>{"[\n"}</span>);
        obj.forEach((item, index) => {
          elements.push(<span key={`arr-${indent}-${index}`}>{spaces}  </span>);
          elements.push(...formatJson(item, indent + 1));
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
          const isError = highlightErrors.includes(key);

          elements.push(<span key={`key-${indent}-${key}`}>{spaces}  </span>);
          elements.push(
            <span key={`keyname-${indent}-${key}`} className="json-key">
              "{key}"
            </span>
          );
          elements.push(<span key={`colon-${indent}-${key}`}>: </span>);

          if (isError && typeof value === "string") {
            elements.push(
              <span key={`val-${indent}-${key}`} className="highlight-error json-string">
                "{value}"
              </span>
            );
          } else if (isError && typeof value === "number") {
            elements.push(
              <span key={`val-${indent}-${key}`} className="highlight-error json-number">
                {value}
              </span>
            );
          } else {
            elements.push(...formatJson(value, indent + 1));
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
