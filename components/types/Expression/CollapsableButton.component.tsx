import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import useMediaQuery from '@mui/material/useMediaQuery'
import Box from '@mui/system/Box'
import useTheme from '@mui/system/useTheme'
import { makeStyles } from '@lambda-feedback-segp-sandbox/styles'
import React from 'react'
import { Stylable } from 'types/react'

interface CollapsableButtonProps extends Stylable {
  title: string
  Icon: React.FC<Stylable>
  onClick?: () => void
  disabled?: boolean
  enabled?: boolean
  collapsable?: boolean
  tooltipText?: string
}

export const CollapsableButton: React.FC<CollapsableButtonProps> = props => {
  const {
    title,
    Icon,
    onClick,
    disabled,
    enabled,
    collapsable,
    tooltipText,
    className,
  } = props

  const theme = useTheme()
  const { classes, cx } = useStyles()

  const shouldCollapse = useMediaQuery(theme.breakpoints.down('xl'))
  const iconElement: React.ReactElement = (
    <Icon
      className={
        enabled ? classes.collapsedIconEnabled : classes.collapsedIconNone
      }
    />
  )

  return (
    <>
      {collapsable && shouldCollapse ? (
        <Tooltip title={tooltipText ?? title}>
          <Button
            sx={{
              paddingLeft: 1,
              paddingRight: 1,
              minWidth: 'auto',
              color: enabled ? 'white' : 'primary.main',
              backgroundColor: enabled ? 'primary.main' : 'transparent',
              '&:hover': {
                backgroundColor: enabled
                  ? 'primary.light'
                  : theme.palette.grey[200],
              },
            }}
            size="small"
            onClick={onClick}
            disabled={disabled || enabled}>
            {iconElement}
          </Button>
        </Tooltip>
      ) : tooltipText ? (
        <Tooltip title={tooltipText}>
          <Box>
            <Button
              className={cx(
                className,
                classes.expandedButton,
                enabled && classes.enabled,
              )}
              size="small"
              onClick={onClick}
              disabled={disabled || enabled}
              endIcon={<Icon className={classes.expandedButtonIcon} />}>
              {title}
            </Button>
          </Box>
        </Tooltip>
      ) : (
        <Button
          className={cx(
            className,
            classes.expandedButton,
            enabled && classes.enabled,
          )}
          size="small"
          onClick={onClick}
          disabled={disabled || enabled}
          endIcon={<Icon className={classes.expandedButtonIcon} />}>
          {title}
        </Button>
      )}
    </>
  )
}

const useStyles = makeStyles()(theme => ({
  enabled: {
    '&.MuiButton-root.Mui-disabled': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.background.default,
    },
  },
  expandedButton: {
    padding: theme.spacing(0.25, 0.5),
    margin: theme.spacing(0, 0.5),
    minWidth: theme.spacing(4),
    lineHeight: 1.5,
    textTransform: 'capitalize',
    whiteSpace: 'nowrap',

    '& .MuiButton-endIcon': {
      marginLeft: theme.spacing(0.5),
      marginRight: 0,
    },
  },
  expandedButtonIcon: {
    height: theme.spacing(2),
    width: theme.spacing(2),
  },
  collapsedIconEnabled: {
    color: 'white',
  },
  collapsedIconNone: {},
}))
