import { TextInput } from '@lambda-feedback-segp-sandbox/form-components'
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import IconButton from '@mui/material/IconButton'
import Switch from '@mui/material/Switch'
import { makeStyles } from '@lambda-feedback-segp-sandbox/styles'
import React from 'react'
import { Stylable } from 'types/react'

interface MultipleChoiceWizardProps extends Stylable {
  options: Array<string>
  answers: Array<boolean>
  randomise: boolean
  single: boolean
  onChange: (args: {
    options: Array<string>
    answers: Array<boolean>
    randomise: boolean
    single: boolean
  }) => void
}

export const MultipleChoiceWizard: React.FC<
  MultipleChoiceWizardProps
> = props => {
  const { className, options, answers, randomise, single, onChange } = props
  const { classes } = useStyles()

  const addOption = () => {
    onChange({
      options: [...options, ''],
      answers: [...answers, false],
      randomise,
      single,
    })
  }

  const deleteOption = (index: number) => {
    const newOptions = [...options]
    const newAnswers = [...answers]
    newOptions.splice(index, 1)
    newAnswers.splice(index, 1)
    onChange({ options: newOptions, answers: newAnswers, randomise, single })
  }

  const updateOption = (args: {
    index: number
    option: string
    answer: boolean
  }) => {
    const newOptions = [...options]
    const newAnswers = [...answers]
    newOptions[args.index] = args.option
    newAnswers[args.index] = args.answer
    onChange({ options: newOptions, answers: newAnswers, randomise, single })
  }

  return (
    <div className={className}>
      <FormGroup>
        <FormControlLabel
          control={
            <Switch
              checked={randomise}
              onChange={event => {
                onChange({
                  options,
                  answers,
                  randomise: event.target.checked,
                  single,
                })
              }}
            />
          }
          label={'Randomise'}
        />
      </FormGroup>
      <FormGroup>
        <FormControlLabel
          label={'Multiple correct answers'}
          control={
            <Switch
              checked={!single}
              onChange={event => {
                const single = !event.target.checked
                let newAnswers = [...answers]
                if (single) {
                  let firstSingle = false
                  newAnswers = newAnswers.map(ans => {
                    if (!ans) {
                      return false
                    }
                    if (firstSingle) {
                      return false
                    }
                    firstSingle = true
                    return ans
                  })
                }
                onChange({
                  options,
                  answers: newAnswers,
                  randomise,
                  single,
                })
              }}
            />
          }
        />
      </FormGroup>
      {options.map((option, index) => {
        const answer = answers[index] ?? false
        return (
          <div className={classes.option} key={index}>
            <FormGroup className={className}>
              <FormControlLabel
                control={
                  <Switch
                    checked={answer}
                    onChange={event => {
                      updateOption({
                        index,
                        option,
                        answer: event.target.checked,
                      })
                    }}
                  />
                }
                label={'correct'}
              />
            </FormGroup>
            <div className={classes.input}>
              <TextInput
                onChange={event => {
                  updateOption({
                    index,
                    option: event.target.value,
                    answer,
                  })
                }}
                label={'option'}
                value={option}
              />
            </div>
            <IconButton onClick={() => deleteOption(index)}>
              <DeleteIcon />
            </IconButton>
          </div>
        )
      })}
      <Button
        className={classes.addButton}
        endIcon={<AddIcon />}
        onClick={() => addOption()}
        variant="contained">
        Add Option
      </Button>
    </div>
  )
}

const useStyles = makeStyles()(theme => ({
  option: {
    display: 'flex',
    margin: theme.spacing(2, 0),
    alignItems: 'center',
    maxWidth: theme.spacing(50),
  },
  input: {
    flex: 1,
    margin: theme.spacing(0, 1),
  },
  addButton: {
    marginTop: theme.spacing(2),
  },
}))
