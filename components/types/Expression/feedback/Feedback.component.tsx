import { StandardSubmissionFragment } from '@lambda-feedback-segp-sandbox/graphql-api/api/graphql-sdk'
import { PreviewFeedback } from '@lambda-feedback-segp-sandbox/graphql-api/api/requests/preview'
import { Text } from '@lambda-feedback-segp-sandbox/math-components'
import { Math } from '@lambda-feedback-segp-sandbox/math-components'
import { makeStyles } from '@lambda-feedback-segp-sandbox/styles'
import {
  Cancel as CancelIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material'
import LoadingButton from '@mui/lab/LoadingButton'
import Typography from '@mui/material/Typography'
import Box from '@mui/system/Box'
import React, { JSX } from 'react'

import { Stylable } from '../../../../types/react'

interface FeedbackMessageProps extends Stylable {
  title?: string
  message: string | string[]
  icon?: JSX.Element
}

export const FeedbackMessage: React.FC<FeedbackMessageProps> = props => {
  const { title, message, icon, className } = props
  const { classes, cx } = useStyles()()
  return (
    <Box className={cx(classes.feedbackContainer, className)}>
      <Box className={classes.feedbackTitleContainer}>
        {icon}
        {title && (
          <Typography
            className={(classes.feedback, classes.title)}
            variant="subtitle2">
            {title}
          </Typography>
        )}
      </Box>
      {Array.isArray(message) ? (
        message.map((line, index) => (
          <Typography variant="body1">
            <Text data={line} className={classes.text} />
          </Typography>
        ))
      ) : (
        <Typography variant="body1">
          <Text data={message} className={classes.text} />
        </Typography>
      )}
    </Box>
  )
}

interface FeedbackProps extends Stylable {
  handleSubmit?: () => void
  validationIsLoading: boolean
  checkIsLoading: boolean
  disableCheck: boolean
  showFeedback: boolean
  teacherMode: boolean
  allowPreview: boolean
  isTeacherMode?: boolean
  previewLatex?: string
  previewFeedback?: PreviewFeedback
  submissionFeedback?: Pick<
    StandardSubmissionFragment,
    'isCorrect' | 'isError' | 'feedback' | 'matchedCase'
  > | null
  typesafeErrorMessage?: string
  showTypesafeError: boolean
}

export const Feedback: React.FC<FeedbackProps> = props => {
  const {
    handleSubmit,
    validationIsLoading,
    checkIsLoading,
    disableCheck,
    showFeedback,
    allowPreview,
    isTeacherMode,
    previewFeedback,
    previewLatex,
    submissionFeedback,
    typesafeErrorMessage,
    showTypesafeError,
    className,
  } = props

  const { classes, cx } = useStyles()()

  let LeftBox
  if (showTypesafeError && typesafeErrorMessage) {
    LeftBox = (
      <FeedbackMessage
        className={classes.error}
        title="Could not evaluate the expression."
        message={`Message received from type checker: "${typesafeErrorMessage}"`}
      />
    )
  } else if (previewFeedback?.error) {
    LeftBox = (
      <FeedbackMessage
        className={classes.error}
        title="Expression could not be interpreted."
        message={
          previewFeedback.error.description ??
          'No further details were provided by the evaluation function.'
        }
      />
    )
  } else if (isTeacherMode) {
    LeftBox = (
      <FeedbackMessage
        title="Preview is disabled"
        message="A preview of the expression is not available when editing."
      />
    )
  } else if (allowPreview && previewLatex) {
    LeftBox = (
      <Box className={classes.latexContainer}>
        <Typography className={classes.latexTitle} variant="subtitle2">
          Interpreted as:
        </Typography>
        <Box className={classes.latex}>
          <Math tex={previewLatex} inline />
        </Box>
      </Box>
    )
  } else if (allowPreview) {
    LeftBox = (
      <FeedbackMessage message="Type, draw or scan your expression to see a preview." />
    )
  }

  let RightBox
  if (showFeedback) {
    RightBox = (
      <FeedbackMessage
        className={cx(classes.submissionFeedbackWithIcon, classes.rightBox)}
        title={submissionFeedback?.isCorrect ? 'Correct' : 'Incorrect'}
        message={submissionFeedback?.feedback ?? []}
        icon={
          submissionFeedback?.isCorrect ? (
            <CheckCircleIcon className={classes.icon} color="success" />
          ) : (
            <CancelIcon className={classes.icon} color="error" />
          )
        }
      />
    )
  } else {
    RightBox = (
      <Box className={cx(classes.checkButtonContainer, classes.rightBox)}>
        <LoadingButton
          className={classes.checkButton}
          variant="contained"
          size="small"
          onClick={handleSubmit}
          loading={checkIsLoading || validationIsLoading}
          disabled={disableCheck || !previewLatex}>
          Check
        </LoadingButton>
      </Box>
    )
  }

  return (
    <Box className={cx(className, classes.paper)}>
      <Box className={classes.container}>
        {LeftBox}
        {RightBox}
      </Box>
    </Box>
  )
}

const useStyles = () =>
  makeStyles()(theme => ({
    paper: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: theme.spacing(0, 0.5),
      minWidth: theme.spacing(30),
      height: '100%',
    },
    container: {
      height: '100%',
      margin: theme.spacing(0.5, 0),
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      [theme.breakpoints.down('md')]: {
        flexDirection: 'column',
        justifyContent: 'center',
      },
    },
    latexContainer: {
      alignSelf: 'start',
      display: 'inline-flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-start',
      minWidth: '30%',
      [theme.breakpoints.down('md')]: {
        width: '100%',
        marginTop: theme.spacing(0.5),
      },
    },
    latex: {
      margin: theme.spacing(1, 2),
      textAlign: 'center',
      alignSelf: 'center',
    },
    rightBox: {
      minWidth: theme.spacing(15),

      [theme.breakpoints.up('md')]: {
        marginLeft: 'auto',
      },
    },
    feedbackContainer: {
      width: 'fit-content',
      justifySelf: 'flex-end',
      borderRadius: theme.spacing(0.25),
      padding: theme.spacing(1),
      margin: theme.spacing('auto', 0),

      [theme.breakpoints.down('md')]: {
        alignSelf: 'flex-start',
      },
    },
    feedbackTitleContainer: {
      display: 'flex',
      alignItems: 'center',
    },
    feedback: {
      fontSize: 12,
      userSelect: 'none',
      color: theme.palette.text.disabled,
    },
    markdownFeedback: {
      '.ProseMirror': {
        fontSize: 12,
        userSelect: 'none',
        padding: '0!important',
      },
    },
    success: {
      color: theme.palette.success.main,
    },
    error: {
      color: theme.palette.error.main,
    },
    checkButtonContainer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },
    checkButton: {
      margin: theme.spacing(1, 3),
      alignSelf: 'center',
    },
    icon: {
      fontSize: 15,
      marginRight: theme.spacing(0.5),
    },
    submissionFeedbackWithIcon: {
      paddingLeft: theme.spacing(0.5),
    },
    title: {
      fontSize: 12,
    },
    latexTitle: {
      fontSize: 11,
      userSelect: 'none',
    },
    text: {
      color: theme.palette.text.primary,
      margin: 0,
      fontWeight: 400,
    },
  }))
