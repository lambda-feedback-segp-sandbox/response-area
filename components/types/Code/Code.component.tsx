import { Loading } from '@lambda-feedback-segp-sandbox/loading-components'
import Editor from '@monaco-editor/react'
import { makeStyles } from '@lambda-feedback-segp-sandbox/styles'

import { BaseResponseAreaProps } from '../base-props.type'

import { CodeConfigSchema } from '.'

type CodeInputProps = Omit<
  BaseResponseAreaProps,
  'handleChange' | 'answer' | 'config'
> & {
  handleChange: (val: string) => void
  answer?: string
  config: CodeConfigSchema
}

export const CodeInput: React.FC<CodeInputProps> = ({
  handleChange,
  answer,
  displayMode,
  config,
}) => {
  const { classes } = useStyles({ displayMode })

  function handleEditorChange(value?: string) {
    if (value !== undefined) handleChange(value)
  }

  return (
    <Editor
      defaultValue={answer}
      onChange={handleEditorChange}
      options={{
        tabSize: 2,
      }}
      loading={<Loading />}
      language={config.language}
      className={classes.codearea}
      beforeMount={console.log}
    />
  )
}

const useStyles = makeStyles<{
  displayMode: BaseResponseAreaProps['displayMode']
}>()((theme, { displayMode }) => ({
  codearea: {
    minHeight: displayMode === 'peek' ? theme.spacing(10) : theme.spacing(40),
    border: '1px solid #ced4da',
  },
}))
