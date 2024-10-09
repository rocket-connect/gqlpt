import clsx from "clsx";
import { Highlight, type Language } from "prism-react-renderer";
import { Fragment } from "react";

interface CodeBlockProps {
  code: string;
  language: Language;
  title: string;
}

type TrafficLightsIconProps = React.SVGProps<SVGSVGElement>;

function TrafficLightsIcon(props: TrafficLightsIconProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 42 10" fill="none" {...props}>
      <title>traffic lights menu</title>
      <circle cx="5" cy="5" r="4.5" fill="#ef4444" />
      <circle cx="21" cy="5" r="4.5" fill="#fbbf24" />
      <circle cx="37" cy="5" r="4.5" fill="#22c55e" />
    </svg>
  );
}

export function CodeBlock({ code, language, title }: CodeBlockProps) {
  return (
    <div className="p-3 pb-0 w-full text-sm">
      <TrafficLightsIcon className="h-2.5 mb-2" />
      <p className="mb-2 font-bold">{title}</p>
      <div className="flex items-start px-1">
        <div
          aria-hidden="true"
          className="select-none border-r border-zinc-300/5 pr-2 font-mono text-zinc-600"
        >
          {Array.from({
            length: code.split("\n").length,
          }).map((_, index) => (
            <Fragment key={`line_number_${index}`}>
              {(index + 1).toString().padStart(2, "0")}
              <br />
            </Fragment>
          ))}
        </div>
        <Highlight
          code={code}
          language={language}
          theme={{
            plain: {
              color: "graphiql-light",
              backgroundColor: "graphiql-dark",
            },
            styles: [
              {
                types: ["comment"],
                style: {
                  color: "#2F8525",
                  fontStyle: "italic",
                },
              },
              {
                types: ["keyword"],
                style: {
                  color: "#569BD6",
                  fontWeight: "bold",
                },
              },
              {
                types: ["punctuation"],
                style: {
                  color: "graphiql-border",
                },
              },
              {
                types: ["string"],
                style: {
                  color: "#B66E4E",
                },
              },
              {
                types: ["number"],
                style: {
                  color: "#2D3648",
                },
              },
              {
                types: ["function"],
                style: {
                  color: "#DBDBAA",
                },
              },
              {
                types: ["operator"],
                style: {
                  color: "#C485BF",
                },
              },
            ],
          }}
        >
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre
              className={clsx(
                className,
                "flex overflow-scroll custom-scrollbar w-5/6 homepage-code-block p-0",
              )}
              style={style}
            >
              <code className="px-4 homepage-code-block">
                {tokens.map((line, lineIndex) => (
                  <div key={`line_${lineIndex}`} {...getLineProps({ line })}>
                    {line.map((token, tokenIndex) => (
                      <span
                        key={`token_${tokenIndex}`}
                        {...getTokenProps({ token })}
                      />
                    ))}
                  </div>
                ))}
              </code>
            </pre>
          )}
        </Highlight>
      </div>
    </div>
  );
}
