import { TextInput } from '@lambda-feedback-segp-sandbox/form-components'
import { makeStyles } from '@lambda-feedback-segp-sandbox/styles'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import FormLabel from '@mui/material/FormLabel'
import Switch from '@mui/material/Switch'
import React from 'react'

import { Stylable } from '../../../types/react'

interface ExpressionWizardProps extends Stylable {
  answer: string
  allowHandwrite: boolean
  allowPhoto: boolean
  onChange: (args: {
    answer: string
    allowHandwrite: boolean
    allowPhoto: boolean
  }) => void
}

export const ExpressionWizard: React.FC<ExpressionWizardProps> = props => {
  const { className, answer, allowHandwrite, allowPhoto, onChange } = props
  const { classes, cx } = useStyles()

  const updateAnswer = (newAnswer: string) => {
    onChange({
      answer: newAnswer,
      allowHandwrite: allowHandwrite,
      allowPhoto: allowPhoto,
    })
  }

  const updateAllowHandwrite = () => {
    onChange({
      answer: answer,
      allowHandwrite: !allowHandwrite,
      allowPhoto: allowPhoto,
    })
  }

  const updateAllowPhoto = () => {
    onChange({
      answer: answer,
      allowHandwrite: allowHandwrite,
      allowPhoto: !allowPhoto,
    })
  }

  return (
    <div className={cx(classes.container, className)}>
      <FormGroup>
        <FormLabel className={classes.label}>Answer</FormLabel>
        <TextInput
          onChange={event => {
            updateAnswer(event.target.value)
          }}
          value={answer}
        />
        <FormControlLabel
          value="end"
          control={
            <Switch checked={allowHandwrite} onChange={updateAllowHandwrite} />
          }
          label="Enable Handwriting Input"
          labelPlacement="end"
        />
        <FormControlLabel
          value="end"
          control={<Switch checked={allowPhoto} onChange={updateAllowPhoto} />}
          label="Enable Photo Upload"
          labelPlacement="end"
        />
      </FormGroup>
    </div>
  )
}

const useStyles = makeStyles()(theme => ({
  container: { padding: theme.spacing(1) },
  option: {
    display: 'flex',
    margin: theme.spacing(2, 0),
    alignItems: 'center',
  },
  input: {
    flex: 1,
    margin: theme.spacing(0, 1),
  },
  addButton: {
    marginTop: theme.spacing(2),
  },
  type: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    marginRight: theme.spacing(2),
  },
}))
