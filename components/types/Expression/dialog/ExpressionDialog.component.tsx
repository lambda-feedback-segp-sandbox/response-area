import { makeStyles } from '@lambda-feedback-segp-sandbox/styles'
import { Close as CloseIcon } from '@mui/icons-material'
import { Done as DoneIcon } from '@mui/icons-material'
import AppBar from '@mui/material/AppBar'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import useTheme from '@mui/system/useTheme'
import React from 'react'
import { Stylable } from 'types/react'

export interface ExpressionDialogProps extends Stylable {
  title: string
  open: boolean
  onClose: () => void
  onDone?: () => void
  children: JSX.Element | JSX.Element[]
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false
  color?:
    | 'default'
    | 'info'
    | 'primary'
    | 'secondary'
    | 'error'
    | 'success'
    | 'warning'
}

export const ExpressionDialog: React.FC<ExpressionDialogProps> = props => {
  const {
    title,
    open,
    maxWidth = 'lg',
    color = 'default',
    children,
    onClose,
    onDone,
    className,
  } = props
  const { classes, cx } = useStyles()

  const theme = useTheme()
  const isFullScreen = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <Dialog
      className={cx(className, classes.dialog)}
      maxWidth={!isFullScreen ? maxWidth : undefined}
      fullScreen={isFullScreen}
      open={open}
      onClose={onClose}>
      <AppBar className={classes.appBar} elevation={1}>
        <Toolbar>
          <Tooltip title="Close">
            <IconButton
              edge="start"
              color={color}
              onClick={onClose}
              aria-label="close">
              <CloseIcon />
            </IconButton>
          </Tooltip>
          <Typography
            className={classes.title}
            sx={{ ml: 2, flex: 1 }}
            variant="h6"
            component="div">
            {title}
          </Typography>
          {onDone && (
            <Tooltip title="Done">
              <IconButton color={color} onClick={onDone}>
                <DoneIcon />
              </IconButton>
            </Tooltip>
          )}
        </Toolbar>
      </AppBar>
      {children}
    </Dialog>
  )
}

const useStyles = makeStyles()(theme => ({
  dialog: {},
  title: {
    userSelect: 'none',
  },
  appBar: {
    display: 'flex',
    justifyContent: 'center',
    position: 'sticky',
    height: theme.spacing(6),
  },
}))
