import { Text } from '@lambda-feedback/math-components'
import { BaseResponseAreaProps } from '@lambda-feedback/response-area-base'
import { makeStyles } from '@lambda-feedback/styles'
import { RadioButtonChecked as CircleChecked } from '@mui/icons-material'
import { RadioButtonUnchecked as CircleUnchecked } from '@mui/icons-material'
import Checkbox from '@mui/material/Checkbox'
import { useState } from 'react'
import * as ShuffleSeed from 'shuffle-seed'

import { useDeepCompareEffect } from '../../../hooks/useDeepCompareEffect'

import { padAnswersFromOptions } from './helpers'

type MultipleChoiceProps = Omit<BaseResponseAreaProps, 'handleChange'> & {
  options: Array<string>
  answers: Array<boolean>
  single: boolean
  randomise: boolean
  handleChange: (answers: Array<boolean>) => void
}

export const MultipleChoice: React.FC<MultipleChoiceProps> = ({
  options,
  answers,
  single,
  randomise,
  handleChange,
}) => {
  const { classes } = useStyles()
  const [seed] = useState(Math.random())
  useDeepCompareEffect(
    () => {
      handleChange(padAnswersFromOptions({ answers, options }))
    },
    [answers, options],
    { skipInitialEffect: false },
  )

  const Options = options.map((option, index) => (
    <div className={classes.row} key={index}>
      <Checkbox
        icon={single ? <CircleUnchecked /> : undefined}
        checkedIcon={single ? <CircleChecked /> : undefined}
        checked={answers[index]}
        onChange={event => {
          const checked = event.target.checked
          let newAnswers = [...answers]
          if (single) {
            newAnswers = newAnswers.map(() => false)
          }
          newAnswers[index] = checked

          handleChange(newAnswers)
        }}
      />
      <Text className={classes.text} data={option} />
    </div>
  ))

  return <div>{randomise ? ShuffleSeed.shuffle(Options, seed) : Options}</div>
}

const useStyles = makeStyles()(theme => ({
  row: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  text: {
    overflow: 'scroll',
  },
}))
