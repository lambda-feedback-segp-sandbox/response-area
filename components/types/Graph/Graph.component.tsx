import { TextInput } from '@lambda-feedback-segp-sandbox/form-components'
import { useDeepCompareEffect } from '@hooks/useDeepCompareEffect'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { makeStyles } from '@lambda-feedback-segp-sandbox/styles'
import React, { useState } from 'react'

import { BaseResponseAreaProps } from '../base-props.type'

type GraphProps = Omit<BaseResponseAreaProps, 'handleChange' | 'answer'> & {
  answer?: string
  lowestX: number
  highestX: number
  lowestY: number
  highestY: number
  xScale: number
  yScale: number
  studentAxis: boolean
  handleChange: (
    answer: string,
    additionalParams?: {
      x_lower: number
      x_upper: number
      y_lower: number
      y_upper: number
      x_scale: number
      y_scale: number
    },
  ) => void
}

export const Graph: React.FC<GraphProps> = ({
  answer,
  lowestX,
  highestX,
  lowestY,
  highestY,
  xScale,
  yScale,
  studentAxis,
  handleChange,
}) => {
  useDeepCompareEffect(
    () => {
      var x_lower = studentAxis ? student.lowestX : lowestX
      var x_upper = studentAxis ? student.highestX : highestX
      var y_lower = studentAxis ? student.lowestY : lowestY
      var y_upper = studentAxis ? student.highestY : highestY
      var x_scale = studentAxis ? student.xScale : xScale
      var y_scale = studentAxis ? student.yScale : yScale

      handleChange(answer ?? '', {
        x_lower,
        x_upper,
        y_lower,
        y_upper,
        x_scale,
        y_scale,
      })
    },
    [answer],
    { skipInitialEffect: false },
  )
  const { classes } = useStyles()
  var saveableCanvas: any
  //BELOW ONLY FOR TESTING STUDENT AXIS
  //var studentAxis = true

  const [xInput, setXInput] = useState('')
  const [yInput, setYInput] = useState('')
  const [points, setPoints] = useState<number[][]>([])
  const [errorText, setErrorText] = useState('')
  const [errorState, setErrorState] = useState('none')
  const [student, setStudent] = useState({
    lowestX: -1,
    highestX: 1,
    lowestY: -1,
    highestY: 1,
    xScale: 1,
    yScale: 1,
    changed: false,
  })

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
    return true
  }

  function isInt(n: number) {
    return Number.isInteger(n)
  }

  const GraphCanvas = (
    <div style={{ width: '5rem' }}>
      {studentAxis ? (
        <div className="Set Axes">
          <br />
          <Button
            onClick={() => {
              if (
                checkValid(
                  student.lowestX,
                  student.highestX,
                  student.xScale,
                  'x',
                ) &&
                checkValid(
                  student.lowestY,
                  student.highestY,
                  student.yScale,
                  'y',
                )
              ) {
                setStudent({
                  lowestX: student.lowestX,
                  highestX: student.highestX,
                  lowestY: student.lowestY,
                  highestY: student.highestY,
                  xScale: student.xScale,
                  yScale: student.yScale,
                  changed: false,
                })
                setPoints([])
              }
            }}
            variant={'contained'}>
            Delete Graph
          </Button>
          {'\t'}
          <Button
            onClick={() => {
              if (
                checkValid(
                  student.lowestX,
                  student.highestX,
                  student.xScale,
                  'x',
                ) &&
                checkValid(
                  student.lowestY,
                  student.highestY,
                  student.yScale,
                  'y',
                )
              ) {
                setStudent({
                  lowestX: student.lowestX,
                  highestX: student.highestX,
                  lowestY: student.lowestY,
                  highestY: student.highestY,
                  xScale: student.xScale,
                  yScale: student.yScale,
                  changed: true,
                })
              }
            }}
            variant={'contained'}>
            Create graph
          </Button>
          <br />
          <br />
          <TextInput
            onChange={e =>
              setStudent({
                lowestX: parseFloat(e.target.value),
                highestX: student.highestX,
                lowestY: student.lowestY,
                highestY: student.highestY,
                xScale: student.xScale,
                yScale: student.yScale,
                changed: student.changed,
              })
            }
            value={
              student.lowestX || student.lowestX === 0 ? student.lowestX : ''
            }
            type={'number'}
            placeholder="x lower bound"
            label="x lower bound"
          />
          <br />
          <TextInput
            onChange={e =>
              setStudent({
                lowestX: student.lowestX,
                highestX: parseFloat(e.target.value),
                lowestY: student.lowestY,
                highestY: student.highestY,
                xScale: student.xScale,
                yScale: student.yScale,
                changed: student.changed,
              })
            }
            value={
              student.highestX || student.highestX === 0 ? student.highestX : ''
            }
            type={'number'}
            placeholder="x upper bound"
            label="x upper bound"
          />
          <br />
          <TextInput
            onChange={e =>
              setStudent({
                lowestX: student.lowestX,
                highestX: student.highestX,
                lowestY: parseFloat(e.target.value),
                highestY: student.highestY,
                xScale: student.xScale,
                yScale: student.yScale,
                changed: student.changed,
              })
            }
            value={
              student.lowestY || student.lowestY === 0 ? student.lowestY : ''
            }
            type={'number'}
            placeholder="y lower bound"
            label="y lower bound"
          />
          <br />
          <TextInput
            onChange={e =>
              setStudent({
                lowestX: student.lowestX,
                highestX: student.highestX,
                lowestY: student.lowestY,
                highestY: parseFloat(e.target.value),
                xScale: student.xScale,
                yScale: student.yScale,
                changed: student.changed,
              })
            }
            value={
              student.highestY || student.highestY === 0 ? student.highestY : ''
            }
            type={'number'}
            placeholder="y upper bound"
            label="y upper bound"
          />
          <br />
          <TextInput
            onChange={e =>
              setStudent({
                lowestX: student.lowestX,
                highestX: student.highestX,
                lowestY: student.lowestY,
                highestY: student.highestY,
                xScale: parseFloat(e.target.value),
                yScale: student.yScale,
                changed: student.changed,
              })
            }
            value={student.xScale || student.xScale === 0 ? student.xScale : ''}
            type={'number'}
            placeholder="x scale"
            label="x scale"
          />
          <br />
          <TextInput
            onChange={e =>
              setStudent({
                lowestX: student.lowestX,
                highestX: student.highestX,
                lowestY: student.lowestY,
                highestY: student.highestY,
                xScale: student.xScale,
                yScale: parseFloat(e.target.value),
                changed: student.changed,
              })
            }
            value={student.yScale || student.yScale === 0 ? student.yScale : ''}
            type={'number'}
            placeholder="y scale"
            label="y scale"
          />
        </div>
      ) : null}
      <br />
      <textarea value={errorText} style={{ display: errorState }} />
    </div>
  )

  return (
    <div className="Main">
      <div className={classes.outerContainer}>
        {!student.changed && studentAxis ? null : (
          <Box
            sx={{
              border: 3,
              borderColor: 'primary.main',
              borderRadius: '16px',
            }}
            color="black"
            bgcolor="aliceblue"
            p={1}
            className={classes.box}>
            <button
              onClick={() => {
                saveableCanvas.eraseAll()
              }}
              // variant={'contained'}
            >
              Erase All
            </button>
            <button
              onClick={() => {
                saveableCanvas.undo()
              }}
              // variant={'contained'}
            >
              Undo
            </button>
            <br />
            <br />
            <div className="Add Guide Point">
              <button
                onClick={() => {
                  if (
                    !isNaN(parseFloat(xInput)) &&
                    !isNaN(parseFloat(yInput))
                  ) {
                    points.push([parseFloat(xInput), parseFloat(yInput)])
                    saveableCanvas.placePoints(points)
                    setXInput('')
                    setYInput('')
                  }
                }}
                // variant={'contained'}
              >
                Add Guide Point
              </button>
              <input
                type="text"
                onChange={e => setXInput(e.target.value)}
                value={xInput}
                placeholder="x val"
                size={5}
              />
              <input
                type="text"
                onChange={e => setYInput(e.target.value)}
                value={yInput}
                placeholder="y val"
                size={5}
              />
            </div>
            <button
              onClick={() => {
                points.pop()
                saveableCanvas.placePoints(points)
              }}
              // variant={'contained'}
            >
              Undo Point
            </button>
          </Box>
        )}
        <Box
          sx={{
            border: 3,
            borderColor: 'primary.main',
            borderRadius: '16px',
            width: '5rem',
          }}
          color="black"
          bgcolor="aliceblue"
          p={1}
          className={classes.box}>
          {GraphCanvas}
        </Box>
      </div>
    </div>
  )
}

const useStyles = makeStyles()(
  (theme: {
    breakpoints: { down: (arg0: number) => any }
    spacing: (arg0: number) => any
  }) => ({
    outerContainer: {
      marginBottom: '1000px',
    },
    box: {
      maxWidth: '100%',
      overflow: 'hidden',
      wordBreak: 'break-all',
    },
    options: {
      marginLeft: '4%',
    },
    title: {
      textAlign: 'left',
      marginTop: 0,
      minWidth: 400,
      maxWidth: 1150,
      fontSize: '1.5rem',
      fontWeight: 600,
      [theme.breakpoints.down(823)]: {
        fontSize: '3rem',
      },
      [theme.breakpoints.down(600)]: {
        paddingLeft: 0,
        minWidth: 0,
      },
    },
  }),
)
