export type ExtractProps<T> =
  T extends React.FC<infer U>
    ? U
    : T extends React.Component<infer P>
      ? P
      : never

export type Stylable = {
  className?: string
}
