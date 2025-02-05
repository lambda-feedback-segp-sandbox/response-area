import { TextCursor } from '@lambda-feedback/icon-components'
import { TextCursorInverted } from '@lambda-feedback/icon-components'
import { makeStyles } from '@lambda-feedback/styles'
import { CameraAlt as CameraAltIcon } from '@mui/icons-material'
import { Draw as DrawIcon } from '@mui/icons-material'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import useMediaQuery from '@mui/material/useMediaQuery'
import Box from '@mui/system/Box'
import useTheme from '@mui/system/useTheme'
import React from 'react'

import { Stylable } from '../../../types/react'

import { CollapsableButton } from './CollapsableButton.component'
import { InputMode, isInputMode } from './modes'

interface ExpressionButtonsProps extends Stylable {
  mode: InputMode
  setMode: (mode: InputMode) => void
  disableDraw?: boolean
  disableScan?: boolean
}

export const ExpressionButtons: React.FC<ExpressionButtonsProps> = props => {
  const { mode, setMode, disableScan, disableDraw, className } = props
  const { classes, cx } = useStyles()

  const theme = useTheme()
  const collapse = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <>
      {collapse ? (
        <Select
          className={cx(className, classes.collapsedModes)}
          value={mode}
          color="primary"
          onChange={({ target: { value } }) =>
            isInputMode(value) && setMode(value)
          }
          autoWidth>
          <MenuItem disabled={mode === 'type'} value="type">
            Type
          </MenuItem>
          {!disableDraw && (
            <MenuItem disabled={mode === 'draw'} value="draw">
              Draw
            </MenuItem>
          )}
          {!disableScan && (
            <MenuItem disabled={mode === 'scan'} value="scan">
              Scan
            </MenuItem>
          )}
        </Select>
      ) : (
        <Box className={cx(className, classes.expandedModes)}>
          <CollapsableButton
            title="Type"
            onClick={() => setMode('type')}
            enabled={mode === 'type'}
            Icon={mode === 'type' ? TextCursorInverted : TextCursor}
          />
          {!disableDraw && (
            <CollapsableButton
              title="Draw"
              onClick={() => setMode('draw')}
              enabled={mode === 'draw'}
              Icon={DrawIcon}
              tooltipText={
                disableDraw ? 'Draw mode is currently disabled.' : undefined
              }
            />
          )}
          {!disableScan && (
            <CollapsableButton
              title="Scan"
              onClick={() => setMode('scan')}
              enabled={mode === 'scan'}
              Icon={CameraAltIcon}
              tooltipText={
                disableScan ? 'Scan mode is currently disabled.' : undefined
              }
            />
          )}
        </Box>
      )}
    </>
  )
}

interface ExpressionMenuProps extends Stylable {
  mode: InputMode
  setMode: (mode: InputMode) => void
  children?: JSX.Element | JSX.Element[]
  disableDraw?: boolean
  disableScan?: boolean
}

export const ExpressionMenu: React.FC<ExpressionMenuProps> = props => {
  const { mode, setMode, children, disableDraw, disableScan, className } = props
  const { classes, cx } = useStyles()

  return (
    <Box className={cx(className, classes.container)}>
      <Box
        className={classes.buttonsContainer}
        sx={{
          justifyContent: children ? 'space-between' : 'flex-end',
        }}>
        {(!disableDraw || !disableScan) && (
          <ExpressionButtons
            className={classes.expressionButtons}
            mode={mode}
            setMode={setMode}
            disableDraw={disableDraw}
            disableScan={disableScan}
          />
        )}
        {children}
      </Box>
    </Box>
  )
}

const useStyles = makeStyles()(theme => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1, 0),

    borderTopColor: theme.palette.grey[300],
    borderTopStyle: 'solid',
    borderTopWidth: theme.spacing(0.125),

    height: theme.spacing(5),
  },
  buttonsContainer: {
    width: '100%',
    display: 'flex',
    overflow: 'scroll',
  },
  expressionButtons: {
    marginRight: 'auto',
  },
  expandedModes: {
    display: 'inline-flex',
  },
  collapsedModes: {
    fontSize: 14,

    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none',
    },
    '& .MuiSelect-select.MuiInputBase-input.MuiOutlinedInput-input': {
      paddingTop: theme.spacing(0.25),
      paddingBottom: theme.spacing(0.25),
    },
  },
  modeButton: {
    padding: theme.spacing(0.25, 0.5),
    margin: theme.spacing(0, 0.25),
    minWidth: theme.spacing(7),
    lineHeight: 1.5,
    textTransform: 'capitalize',

    '& .MuiButton-endIcon': {
      marginLeft: theme.spacing(0.5),
      marginRight: 0,
    },
  },
  expandedButtonIcon: {
    height: theme.spacing(2),
    width: theme.spacing(2),
  },
}))
