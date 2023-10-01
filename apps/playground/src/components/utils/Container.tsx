export function Container(props: React.PropsWithChildren) {
  return <div className="container mx-auto">{props.children}</div>;
}
