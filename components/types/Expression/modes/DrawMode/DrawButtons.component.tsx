import { makeStyles } from '@lambda-feedback/styles'
import { Delete as DeleteIcon } from '@mui/icons-material'
import { Draw as DrawIcon } from '@mui/icons-material'
import { Redo as RedoIcon } from '@mui/icons-material'
import { Undo as UndoIcon } from '@mui/icons-material'
import Box from '@mui/system/Box'
import React from 'react'

import { Stylable } from '../../../../../types/react'
import { CollapsableButton } from '../../CollapsableButton.component'

import { PencilState } from './DrawMode.component'
import { EraserIcon } from './EraserIcon.component'

interface DrawInlineButtonsProps extends Stylable {
  pencilState: PencilState
  setPencilState?: (state: PencilState) => void
  handleUndo?: () => void
  handleRedo?: () => void
  handleClear?: () => void
  canUndo?: boolean
  canRedo?: boolean
  canClear?: boolean
  collapsable?: boolean
}
export const DrawInlineButtons: React.FC<DrawInlineButtonsProps> = props => {
  const {
    pencilState,
    setPencilState,
    handleUndo,
    handleRedo,
    handleClear,
    canUndo,
    canRedo,
    canClear,
    collapsable = true,
    className,
  } = props
  const { classes, cx } = useStyles()

  return (
    <Box className={cx(className, classes.container)}>
      <CollapsableButton
        title="Undo"
        Icon={UndoIcon}
        onClick={handleUndo}
        disabled={!canUndo}
        collapsable={collapsable}
      />
      <CollapsableButton
        title="Redo"
        Icon={RedoIcon}
        onClick={handleRedo}
        disabled={!canRedo}
        collapsable={collapsable}
      />
      <CollapsableButton
        title="Delete"
        Icon={DeleteIcon}
        onClick={handleClear}
        disabled={!canClear}
        collapsable={collapsable}
      />
      <CollapsableButton
        title="Eraser"
        Icon={EraserIcon}
        onClick={() => setPencilState && setPencilState('erase')}
        enabled={pencilState === 'erase'}
        collapsable={collapsable}
      />
      <CollapsableButton
        title="Pen"
        Icon={DrawIcon}
        onClick={() => setPencilState && setPencilState('input')}
        enabled={pencilState === 'input'}
        collapsable={collapsable}
      />
    </Box>
  )
}

interface DrawDialogButtonsProps extends Stylable {
  pencilState: PencilState
  setPencilState?: (state: PencilState) => void
  handleUndo?: () => void
  handleRedo?: () => void
  handleClear?: () => void
  canUndo?: boolean
  canRedo?: boolean
  canClear?: boolean
}

export const DrawDialogButtons: React.FC<DrawDialogButtonsProps> = props => {
  const {
    pencilState,
    setPencilState,
    handleUndo,
    handleRedo,
    handleClear,
    canUndo,
    canRedo,
    canClear,
    className,
  } = props
  const { classes, cx } = useStyles()

  return (
    <Box className={cx(className, classes.container)}>
      <CollapsableButton
        title="Delete"
        Icon={DeleteIcon}
        onClick={handleClear}
        disabled={!canClear}
        collapsable={false}
      />
      <CollapsableButton
        title="Undo"
        Icon={UndoIcon}
        onClick={handleUndo}
        disabled={!canUndo}
        collapsable={false}
      />
      <CollapsableButton
        title="Redo"
        Icon={RedoIcon}
        onClick={handleRedo}
        disabled={!canRedo}
        collapsable={false}
      />
      <CollapsableButton
        title="Eraser"
        Icon={EraserIcon}
        onClick={() => setPencilState && setPencilState('erase')}
        enabled={pencilState === 'erase'}
        collapsable={false}
      />
      <CollapsableButton
        title="Pen"
        Icon={DrawIcon}
        onClick={() => setPencilState && setPencilState('input')}
        enabled={pencilState === 'input'}
        collapsable={false}
      />
    </Box>
  )
}

const useStyles = makeStyles()(theme => ({
  container: {
    display: 'inline-flex',
  },
}))
