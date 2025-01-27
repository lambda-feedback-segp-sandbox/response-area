import { StandardSubmissionFragment } from '@lambda-feedback-segp-sandbox/graphql-api/api/graphql'
import { Text } from '@lambda-feedback-segp-sandbox/math-components'
import Alert, { AlertColor } from '@mui/material/Alert'
import Typography from '@mui/material/Typography'
import { makeStyles } from '@lambda-feedback-segp-sandbox/styles'
import React from 'react'
import { Stylable } from 'types/react'

interface ResponseAreaFeedbackProps extends Stylable {
  response: Pick<
    StandardSubmissionFragment,
    'isCorrect' | 'isError' | 'feedback' | 'matchedCase' | 'color'
  >
}

export const ResponseAreaFeedback: React.FC<
  ResponseAreaFeedbackProps
> = props => {
  const { response, className } = props
  const { classes, cx } = useStyles()

  const { isCorrect, isError, feedback, color } = response

  let feedbackSeverity: AlertColor = isCorrect ? 'success' : 'error'
  let feedbackOverrideColor: string | undefined
  let feedbackText: string = feedback ?? 'No feedback text'

  // overriding cases for color/content
  if (isError) {
    feedbackSeverity = 'info'
    feedbackText =
      'An error occurred with the evaluation of your response. The teacher has been informed. We apologise and will try and fix it soon.'
  } else {
    feedbackOverrideColor = color || undefined
    feedbackText = feedback || ''
  }

  return (
    <Alert
      severity={feedbackSeverity}
      variant="filled"
      icon={false}
      style={{ backgroundColor: feedbackOverrideColor ?? 'rgba(0, 0, 0, 0)' }} // If no colour is supplied, make it transparent
      className={cx(className)}
      sx={theme => ({
        border: '2px solid',
        borderColor: feedbackOverrideColor ?? 'rgba(0, 0, 0, 0)',
        borderRadius: theme.spacing(1),
        padding: 0,

        alignSelf: 'center',
        width: 'min(600px, 100%)',
        display: 'flex',

        '.MuiAlert-message': {
          backgroundColor: theme.palette.background.default,

          borderRadius: theme.spacing(0.8),
          padding: theme.spacing(1),
          marginLeft: theme.spacing(1),
          flexGrow: 1,
        },
      })}>
      <Typography variant="body1">
        <Text data={feedbackText} className={classes.text} />
      </Typography>
    </Alert>
  )
}

const useStyles = makeStyles()(theme => ({
  text: {
    color: theme.palette.text.primary,
    margin: 0,
    fontWeight: 400,
  },
}))
