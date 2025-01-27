import { makeStyles } from '@lambda-feedback-segp-sandbox/styles'
import FormHelperText from '@mui/material/FormHelperText'
import { useCallback } from 'react'

import { BaseResponseAreaProps } from '../base-props.type'

import styles from './NumberInput.module.css'

type NumberInputProps = Omit<
  BaseResponseAreaProps,
  'handleChange' | 'answer'
> & {
  handleChange: (val: number | '') => void
  answer?: number | null
}

// Stateless TextInput Response Area
export const NumberInput: React.FC<NumberInputProps> = ({
  handleChange,
  handleSubmit,
  answer,
  typesafeErrorMessage,
}) => {
  const { classes } = useStyles()

  const submitOnEnter: React.KeyboardEventHandler<HTMLDivElement> = useCallback(
    event => {
      if (event.key !== 'Enter' || !handleSubmit) return
      event.preventDefault()
      return handleSubmit()
    },
    [handleSubmit],
  )

  const getConvertedInput = useCallback((inputValue: string) => {
    if (inputValue === '') {
      return ''
    }
    return isNaN(inputValue as any) ? NaN : parseFloat(inputValue)
  }, [])

  return (
    <>
      <input
        type="text"
        onChange={({ target: { value } }) => {
          const convertedInput = getConvertedInput(value)
          handleChange(convertedInput)
        }}
        defaultValue={answer ?? ''}
        onKeyDown={submitOnEnter}
        className={styles.inputStyles}
        placeholder="Number"
      />
      {typesafeErrorMessage && (
        <FormHelperText className={classes.errorMessage}>
          {/received nan/.test(typesafeErrorMessage)
            ? 'Expected number'
            : typesafeErrorMessage}
        </FormHelperText>
      )}
    </>
  )
}

const useStyles = makeStyles()(theme => ({
  errorMessage: {
    color: 'red',
    fontSize: 16,
  },
}))
