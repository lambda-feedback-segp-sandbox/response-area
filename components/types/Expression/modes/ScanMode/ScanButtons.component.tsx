import { makeStyles } from '@lambda-feedback-segp-sandbox/styles'
import { Delete as DeleteIcon } from '@mui/icons-material'
import { Crop as CropIcon } from '@mui/icons-material'
import { Done as DoneIcon } from '@mui/icons-material'
import { Undo as UndoIcon } from '@mui/icons-material'
import Box from '@mui/system/Box'
import React from 'react'

import { Stylable } from '../../../../../types/react'
import { CollapsableButton } from '../../CollapsableButton.component'

interface ScanInlineButtonProps extends Stylable {
  handlePaste: () => void
  switchCrop: () => void
  handleClear?: () => void
  handleUndo: () => void
  handleDone: () => void
  canCrop?: boolean
  cropMode?: boolean
  canClear?: boolean
  collapsable?: boolean
}

export const ScanInlineButtons: React.FC<ScanInlineButtonProps> = props => {
  const {
    handleClear,
    switchCrop,
    canCrop,
    canClear,
    handleUndo,
    handleDone,
    cropMode,
    collapsable = true,
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
        collapsable={collapsable}
      />
      <CollapsableButton
        title="Undo"
        Icon={UndoIcon}
        onClick={handleUndo}
        disabled={!canCrop || !cropMode}
        collapsable={collapsable}
      />
      <CollapsableButton
        title="Crop"
        Icon={CropIcon}
        onClick={switchCrop}
        disabled={!canCrop || cropMode}
        collapsable={collapsable}
      />
      <CollapsableButton
        title="Done"
        Icon={DoneIcon}
        onClick={handleDone}
        disabled={!canCrop || !cropMode}
        collapsable={collapsable}
      />
    </Box>
  )
}

const useStyles = makeStyles()(theme => ({
  container: {
    display: 'inline-flex',
  },
}))
