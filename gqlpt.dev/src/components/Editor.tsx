import MonacoEditor from "react-monaco-editor";

export function Editor(
  props: React.PropsWithChildren<{
    width: number;
    height: number;
    onChange: (...a: any) => any;
    value: any;
    readonly?: boolean;
  }>
) {
  return (
    <MonacoEditor
      value={props.value}
      defaultValue={props.value}
      width={props.width}
      height={props.height}
      language="graphql"
      theme="vs-dark"
      options={{
        fontSize: 20,
        readOnly: props.readonly,
        selectOnLineNumbers: true,
        lineNumbers: "off",
        minimap: {
          enabled: false,
        },
      }}
      onChange={props.onChange}
    />
  );
}
