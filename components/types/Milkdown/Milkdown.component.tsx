import { ContentInput } from '@lambda-feedback-segp-sandbox/form-components'
import { makeStyles } from '@lambda-feedback-segp-sandbox/styles'
import { useEffect, useState } from 'react'

import { BaseResponseAreaProps } from '../base-props.type'

type MilkdownInputProps = Omit<
  BaseResponseAreaProps,
  'handleChange' | 'answer'
> & {
  handleChange: (val: string) => void
  answer?: string
}

export const MilkdownInput: React.FC<MilkdownInputProps> = ({
  handleChange,
  handleSubmit,
  answer,
}) => {
  const { classes } = useStyles()
  const [isMounted, setIsMounted] = useState(false)

  // Effect to set mounted state
  useEffect(() => {
    setIsMounted(true)

    return () => {
      setIsMounted(false)
    }
  }, [])

  if (!isMounted) {
    return <div>Loading...</div>
  }

  return (
    <ContentInput
      className={classes.contentInputContainer}
      value={answer ?? ''}
      onChangeValue={handleChange}
      placeholder={'*Type your response here…*'}
      editable
      focused
    />
  )
}

const useStyles = makeStyles()(theme => ({
  contentInputContainer: {
    width: '100%',
    minHeight: theme.spacing(20),
  },
}))
