import { TextInput } from '@lambda-feedback-segp-sandbox/form-components'
import { makeStyles } from '@lambda-feedback-segp-sandbox/styles'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import FormLabel from '@mui/material/FormLabel'
import Switch from '@mui/material/Switch'
import React, { useState } from 'react'

import { Stylable } from '../../../types/react'

interface GraphWizardProps extends Stylable {
  answer: string
  lowestX: number
  highestX: number
  lowestY: number
  highestY: number
  xScale: number
  yScale: number
  studentAxis: boolean
  setAllowSave: React.Dispatch<React.SetStateAction<boolean>>
  onChange: (args: {
    answer: string
    lowestX: number
    highestX: number
    lowestY: number
    highestY: number
    xScale: number
    yScale: number
    studentAxis: boolean
  }) => void
}

function isInt(n: number) {
  return Number.isInteger(n)
}

export const GraphWizard: React.FC<GraphWizardProps> = props => {
  const {
    className,
    answer,
    lowestX,
    highestX,
    lowestY,
    highestY,
    xScale,
    yScale,
    studentAxis,
    onChange,
    setAllowSave,
  } = props
  const { classes, cx } = useStyles()

  const [errorText, setErrorText] = useState('')
  const [errorState, setErrorState] = useState('none')

  function checkValid(
    lowest: number,
    highest: number,
    scale: number,
    coord: string,
  ) {
    if (scale === 0) {
      setErrorText(coord + ' scale cannot be 0')
      setErrorState('inline')
      return false
    }
    if (highest <= lowest) {
      setErrorText('highest ' + coord + ' must be greater than lowest ' + coord)
      setErrorState('inline')
      return false
    }
    let boxTotal = 0
    if (lowest < 0 && 0 < highest) {
      boxTotal = (highest - lowest) / scale
      let posAxis = (-1 * lowest) / scale
      let negAxis = highest / scale
      if (!isInt(negAxis)) {
        setErrorText(
          'lowest ' +
            coord +
            ' must divide into an integer by ' +
            coord +
            ' scale',
        )
        setErrorState('inline')
        return false
      } else if (!isInt(posAxis)) {
        setErrorText(
          'highest ' +
            coord +
            ' must divide into an integer by ' +
            coord +
            ' scale',
        )
        setErrorState('inline')
        return false
      }
    } else if (highest < 0) {
      boxTotal = (-1 * (lowest + highest)) / scale
    } else {
      boxTotal = (highest - lowest) / scale
    }
    boxTotal = boxTotal + 2
    if (!isInt(boxTotal)) {
      setErrorText(
        'difference of lowest ' +
          coord +
          ' and highest ' +
          coord +
          ' must divide into an integer by ' +
          coord +
          ' scale',
      )
      setErrorState('inline')
      return false
    } else if (boxTotal < 4) {
      setErrorText('increase ' + coord + ' axis size')
      setErrorState('inline')
      return false
    } else if (coord === 'x' && boxTotal > 16) {
      setErrorText('decrease x axis size')
      setErrorState('inline')
      return false
    } else if (coord === 'y' && boxTotal > 9) {
      setErrorText('decrease y axis size')
      setErrorState('inline')
      return false
    }
    setErrorText('')
    setErrorState('none')
    setAllowSave(true)
    return true
  }

  const updateAnswer = (newAnswer: string) => {
    onChange({
      answer: newAnswer,
      lowestX: lowestX,
      highestX: highestX,
      lowestY: lowestY,
      highestY: highestY,
      xScale: xScale,
      yScale: yScale,
      studentAxis: studentAxis,
    })
  }

  const updateStudentAxis = () => {
    onChange({
      answer: answer,
      lowestX: lowestX,
      highestX: highestX,
      lowestY: lowestY,
      highestY: highestY,
      xScale: xScale,
      yScale: yScale,
      studentAxis: !studentAxis,
    })
    if (!studentAxis) {
      setAllowSave(true)
    } else if (studentAxis && errorText !== '') {
      setAllowSave(false)
    }
  }

  const updateLowestX = (newLowestX: number) => {
    onChange({
      answer: answer,
      lowestX: newLowestX,
      highestX: highestX,
      lowestY: lowestY,
      highestY: highestY,
      xScale: xScale,
      yScale: yScale,
      studentAxis: studentAxis,
    })
    if (!checkValid(newLowestX, highestX, xScale, 'x')) {
      setAllowSave(false)
    }
  }

  const updateHighestX = (newHighestX: number) => {
    onChange({
      answer: answer,
      lowestX: lowestX,
      highestX: newHighestX,
      lowestY: lowestY,
      highestY: highestY,
      xScale: xScale,
      yScale: yScale,
      studentAxis: studentAxis,
    })
    if (!checkValid(lowestX, newHighestX, xScale, 'x')) {
      setAllowSave(false)
    }
  }

  const updateLowestY = (newLowestY: number) => {
    onChange({
      answer: answer,
      lowestX: lowestX,
      highestX: highestX,
      lowestY: newLowestY,
      highestY: highestY,
      xScale: xScale,
      yScale: yScale,
      studentAxis: studentAxis,
    })
    if (!checkValid(newLowestY, highestY, yScale, 'y')) {
      setAllowSave(false)
    }
  }

  const updateHighestY = (newHighestY: number) => {
    onChange({
      answer: answer,
      lowestX: lowestX,
      highestX: highestX,
      lowestY: lowestY,
      highestY: newHighestY,
      xScale: xScale,
      yScale: yScale,
      studentAxis: studentAxis,
    })
    if (!checkValid(lowestY, newHighestY, yScale, 'y')) {
      setAllowSave(false)
    }
  }

  const updateXScale = (newXScale: number) => {
    onChange({
      answer: answer,
      lowestX: lowestX,
      highestX: highestX,
      lowestY: lowestY,
      highestY: highestY,
      xScale: newXScale,
      yScale: yScale,
      studentAxis: studentAxis,
    })
    if (!checkValid(lowestX, highestX, newXScale, 'x')) {
      setAllowSave(false)
    }
  }

  const updateYScale = (newYScale: number) => {
    onChange({
      answer: answer,
      lowestX: lowestX,
      highestX: highestX,
      lowestY: lowestY,
      highestY: highestY,
      xScale: xScale,
      yScale: newYScale,
      studentAxis: studentAxis,
    })
    if (!checkValid(lowestY, highestY, newYScale, 'y')) {
      setAllowSave(false)
    }
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
            <Switch checked={studentAxis} onChange={updateStudentAxis} />
          }
          label="Students select axes"
          labelPlacement="end"
        />
      </FormGroup>
      <FormGroup style={{ display: studentAxis ? 'none' : 'inline' }}>
        <FormLabel className={classes.label}>Lowest X Value</FormLabel>
        <TextInput
          onChange={event => {
            updateLowestX(parseFloat(event.target.value))
          }}
          value={lowestX || lowestX === 0 ? lowestX : ''}
          type={'number'}
        />
        <FormLabel className={classes.label}>Highest X Value</FormLabel>
        <TextInput
          onChange={event => {
            updateHighestX(parseFloat(event.target.value))
          }}
          value={highestX || highestX === 0 ? highestX : ''}
          type={'number'}
        />
        <FormLabel className={classes.label}>Lowest Y Value</FormLabel>
        <TextInput
          onChange={event => {
            updateLowestY(parseFloat(event.target.value))
          }}
          value={lowestY || lowestY === 0 ? lowestY : ''}
          type={'number'}
        />
        <FormLabel className={classes.label}>Highest Y Value</FormLabel>
        <TextInput
          onChange={event => {
            updateHighestY(parseFloat(event.target.value))
          }}
          value={highestY || highestY === 0 ? highestY : ''}
          type={'number'}
        />
        <FormLabel className={classes.label}>X Axis Scale</FormLabel>
        <TextInput
          onChange={event => {
            updateXScale(parseFloat(event.target.value))
          }}
          value={xScale || xScale === 0 ? xScale : ''}
          type={'number'}
        />
        <FormLabel className={classes.label}>Y Axis Scale</FormLabel>
        <TextInput
          onChange={event => {
            updateYScale(parseFloat(event.target.value))
          }}
          value={yScale || yScale === 0 ? yScale : ''}
          type={'number'}
        />
      </FormGroup>
      <FormGroup>
        <textarea
          value={errorText}
          style={{ display: studentAxis ? 'none' : errorState }}
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
