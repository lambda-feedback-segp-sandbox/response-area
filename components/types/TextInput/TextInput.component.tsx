import { useCallback } from 'react'

import { BaseResponseAreaProps } from '../base-props.type'

import styles from './TextInput.module.css'

type TextInputProps = Omit<BaseResponseAreaProps, 'handleChange' | 'answer'> & {
  handleChange: (val: string) => void
  answer?: string
}

// Stateless TextInput Response Area
export const TextInput: React.FC<TextInputProps> = ({
  handleChange,
  handleSubmit,
  answer,
}) => {
  const submitOnEnter: React.KeyboardEventHandler<HTMLTextAreaElement> =
    useCallback(
      event => {
        if (event.key !== 'Enter' || event.shiftKey || !handleSubmit) return
        event.preventDefault()
        return handleSubmit()
      },
      [handleSubmit],
    )

  return (
    <textarea
      defaultValue={answer}
      onChange={event => {
        event.preventDefault()
        // Update ResponseArea state
        handleChange(event.target.value)
      }}
      onKeyDown={submitOnEnter}
      className={styles.inputStyles}
      placeholder="Text"
    />
  )
}
