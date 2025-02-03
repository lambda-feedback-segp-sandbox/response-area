import { PreviewFeedback } from '@lambda-feedback-segp-sandbox/graphql-api/api/requests/preview'
import { MathText } from '@lambda-feedback-segp-sandbox/math-components'
import { makeStyles } from '@lambda-feedback-segp-sandbox/styles'
import { Cancel as CancelIcon } from '@mui/icons-material'
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material'
import { RadioButtonUnchecked as RadioButtonUncheckedIcon } from '@mui/icons-material'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Box from '@mui/system/Box'
import React from 'react'

import { Stylable } from '../../../../types/react'

interface DialogPreviewProps extends Stylable {
  latex?: string
  feedback?: PreviewFeedback
  defaultComment: string
  disable?: boolean
}

export const DialogPreview: React.FC<DialogPreviewProps> = props => {
  const { latex, feedback, defaultComment, disable, className } = props
  const { classes, cx } = useStyles()

  return (
    <Paper elevation={3} className={cx(className, classes.paper)}>
      <Typography className={classes.title} variant="subtitle2">
        Response detected as:
      </Typography>
      <MathText
        className={classes.latex}
        text={latex && !disable ? latex : ''}
      />
      <Box className={classes.commentContainer}>
        {feedback?.error || disable ? (
          <>
            <CancelIcon className={classes.validationIcon} color="error" />
            <Typography // Implement helpful error message from evaluation_function
              className={cx(classes.comment, classes.error)}
              variant="caption">
              {disable
                ? 'Preview is disabled.'
                : 'Equation could not be interpreted.'}
            </Typography>
          </>
        ) : feedback?.preview && !!latex ? (
          <>
            <CheckCircleIcon
              className={classes.validationIcon}
              color="success"
            />
            <Typography
              className={cx(classes.comment, classes.success)}
              variant="caption">
              Equation is interpretable.
            </Typography>
          </>
        ) : (
          <>
            {latex && (
              <RadioButtonUncheckedIcon
                className={cx(classes.validationIcon, classes.checking)}
                color="info"
              />
            )}
            <Typography className={cx(classes.comment)} variant="caption">
              {latex ? 'Checking LaTeX is interpretable.' : defaultComment}
            </Typography>
          </>
        )}
      </Box>
    </Paper>
  )
}

const useStyles = makeStyles()(theme => ({
  paper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: theme.spacing(1, 1.5, 1.5, 1.5),
    minwidth: theme.spacing(30),
    minHeight: theme.spacing(15),
  },
  title: {
    fontSize: 12,
    userSelect: 'none',
  },
  commentContainer: {
    display: 'flex',
    alignItems: 'center',
    whiteSpace: 'nowrap',
  },
  latex: {
    margin: theme.spacing(0, 2),
  },
  validationIcon: {
    fontSize: 15,
    marginRight: theme.spacing(0.5),
  },
  comment: {
    fontSize: 10,
    maxWidth: theme.spacing(25),
    fontWeight: theme.typography.fontWeightRegular,
    userSelect: 'none',
  },
  success: {},
  checking: {
    color: theme.palette.grey[500],
  },
  error: {
    color: theme.palette.error.main,
  },
}))
