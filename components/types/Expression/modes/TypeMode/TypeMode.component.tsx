import { PreviewFeedback } from '@lambda-feedback-segp-sandbox/graphql-api/api/requests/preview'
import { MathText, Text } from '@lambda-feedback-segp-sandbox/math-components'
import {
  ResponsePreviewFormParams,
  useResponsePreviewForm,
} from '../../../../useResponsePreviewForm'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Box from '@mui/system/Box'
import { makeStyles } from '@lambda-feedback-segp-sandbox/styles'
import React, { memo, useEffect, useState } from 'react'
import { Stylable } from 'types/react'

import { ExpressionMenu } from '../../ExpressionMenu.component'
import { InputMode } from '../types'

export interface TypeSuggestion {
  latex: string
  sympy: string
  mode: InputMode
}

interface TypeModeProps extends Stylable {
  setResponse: (answer?: PreviewFeedback) => void
  setPreviewLatex?: (latex: string) => void
  mode: InputMode
  setMode: (mode: InputMode) => void
  preResponseText?: string | null
  postResponseText?: string | null
  onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>
  defaultValue?: string
  autocompleteOptions: TypeSuggestion[]
  responseParams: ResponsePreviewFormParams | null
  placeholder?: string
  disableDraw?: boolean
  disableScan?: boolean
}

export const TypeMode: React.FC<TypeModeProps> = props => {
  const {
    setResponse,
    setPreviewLatex,
    mode,
    setMode,
    preResponseText,
    postResponseText,
    onKeyDown,
    defaultValue,
    autocompleteOptions,
    responseParams,
    placeholder = 'Type here, e.g. sin(x)**2 + 1',
    disableDraw,
    disableScan,
    className,
  } = props

  const { classes, cx } = useStyles()
  const { previewSubmit, feedback } = useResponsePreviewForm(responseParams)
  const [textResponse, setTextResponse] = useState<string>(defaultValue ?? '')

  useEffect(() => {
    if (feedback) {
      setPreviewLatex?.(feedback.preview?.latex ?? '')
      setResponse(feedback)
    }
  }, [feedback, setResponse, setPreviewLatex])

  return (
    <Box className={cx(className, classes.container)}>
      <Box className={cx(className, classes.inputWrapper)}>
        <Box className={classes.flexbox}>
          {preResponseText && (
            <Text
              className={cx(
                classes.prePostResponseText,
                classes.preResponseText,
              )}
              data={preResponseText}
            />
          )}
          <Autocomplete
            className={classes.inputField}
            disableClearable
            fullWidth
            freeSolo
            options={autocompleteOptions}
            value={textResponse}
            onKeyDown={onKeyDown}
            onChange={(_, value) =>
              setTextResponse(typeof value === 'string' ? value : value.sympy)
            }
            renderInput={params => (
              <TextField {...params} placeholder={placeholder} multiline />
            )}
            getOptionLabel={option =>
              typeof option === 'string' ? option : option.sympy
            }
            renderOption={(props, option) => (
              <li {...props}>
                <Box className={classes.optionContainer}>
                  <Box className={classes.optionEquationContainer}>
                    <MathText
                      className={classes.optionEquation}
                      text={option.latex}
                    />
                  </Box>
                  <Typography
                    className={classes.optionFromText}
                    variant="subtitle2">
                    ({option.mode})
                  </Typography>
                </Box>
              </li>
            )}
            onInputChange={(_, value) => {
              if (responseParams) {
                previewSubmit(value, { is_latex: false })
              } else {
                setPreviewLatex?.(value)
              }
            }}
          />
          {postResponseText && (
            <Text
              className={cx(
                classes.prePostResponseText,
                classes.postResponseText,
              )}
              data={postResponseText}
            />
          )}
        </Box>
      </Box>
      {(!disableDraw || !disableScan) && (
        <ExpressionMenu
          mode={mode}
          setMode={setMode}
          disableDraw={disableDraw}
          disableScan={disableScan}
        />
      )}
    </Box>
  )
}

export const MemoisedTypeMode = memo(TypeMode)

const useStyles = makeStyles()(theme => ({
  container: {
    borderBottomColor: theme.palette.grey[300],
    borderBottomStyle: 'solid',
    borderBottomWidth: theme.spacing(0.125),
  },
  inputWrapper: {
    width: '100%',
    minHeight: theme.spacing(12),
    display: 'flex',
    alignItems: 'center',
  },
  flexbox: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
  },
  prePostResponseText: {
    padding: theme.spacing(2),
    whiteSpace: 'nowrap',
  },
  inputField: {
    padding: 0,
    '& .MuiAutocomplete-root .MuiOutlinedInput-root .MuiAutocomplete-input': {
      padding: theme.spacing(0.1),
    },
    '& .MuiOutlinedInput-input': {
      fontFamily: 'monospace',
      fontSize: 15,
      padding: theme.spacing(0.5),
    },
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none',
      padding: theme.spacing(0.1, 0),
    },
    '&.MuiAutocomplete-root .MuiOutlinedInput-root': {
      padding: 0,
    },
  },
  optionContainer: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionEquationContainer: {
    minWidth: theme.spacing(15),
    overflow: 'hidden',
  },
  optionEquation: {
    display: 'inline-block',
  },
  optionFromText: {
    fontSize: 12,
  },
  preResponseText: {
    paddingRight: 0,
  },
  postResponseText: {
    paddingLeft: 0,
  },
}))
