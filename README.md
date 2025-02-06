# `response-area`

This package contains the React components, contexts and hooks used to render
response areas within the Lambda Feedback interface.

Currently, the source code for each existing response area type can also be
found here, but this is expected to change as response area types become more
modular.

## Root Exports

- `ResponseAreaView` renders the input component of a given `ResponseAreaTub`.
- `ResponseArea` initialises a `ResponseAreaTub` for a given response area type
  and displays its input component using a `ResponseAreaView`.

## See Also

- `response-area-base` contains the definitions of `ResponseAreaTub` and
  `BaseResponseAreaProps`.
