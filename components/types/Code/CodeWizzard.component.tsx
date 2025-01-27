import { makeStyles } from '@lambda-feedback-segp-sandbox/styles'
import { useMonaco } from '@monaco-editor/react'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'

import { BaseResponseAreaProps } from '../base-props.type'

import { CodeInput } from './Code.component'

import { CodeConfigSchema } from '.'

type CodeInputWizzardProps = Omit<
  BaseResponseAreaProps,
  'handleChange' | 'answer' | 'config'
> & {
  handleChange: (val: string, config: CodeConfigSchema) => void
  answer?: string
  config: CodeConfigSchema
}

export const CodeInputWizzard: React.FC<CodeInputWizzardProps> = ({
  handleChange,
  answer,
  displayMode,
  config,
  ...otherProps
}) => {
  const { classes } = useStyles({ displayMode })

  const monaco = useMonaco()
  const availableLanguages = monaco?.languages.getLanguages()

  function handleLanguageChange(
    _event: React.SyntheticEvent,
    language: string | null,
  ) {
    if (language) handleChange(answer || '', { language })
  }

  return (
    <>
      {availableLanguages ? (
        <Autocomplete
          value={config.language}
          onChange={handleLanguageChange}
          options={availableLanguages.map(l => l.id)}
          filterOptions={(_options, state) => {
            const matchingLanguages = availableLanguages.filter(language => {
              const candidate = [language.id, ...(language.aliases || [])]
                .join(' ')
                .toLowerCase()
              return candidate.includes(state.inputValue.toLowerCase())
            })
            return matchingLanguages.map(l => l.id)
          }}
          renderInput={params => (
            <TextField
              {...params}
              className={classes.languageInput}
              label="Language"
              placeholder="Language"
              variant="outlined"
              size="small"
            />
          )}
          getOptionLabel={option =>
            availableLanguages.find(l => l.id === option)?.aliases?.[0] ??
            option
          }
        />
      ) : null}

      <CodeInput
        answer={answer}
        displayMode={displayMode}
        config={config}
        {...otherProps}
        handleChange={(value: string) => handleChange(value, config)}
      />
    </>
  )
}

const useStyles = makeStyles<{
  displayMode: BaseResponseAreaProps['displayMode']
}>()((theme, { displayMode }) => ({
  languageInput: {
    ['&.MuiTextField-root']: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(2),
      maxWidth: theme.spacing(30),
    },
  },
}))
