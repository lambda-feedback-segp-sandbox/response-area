import { StandardSubmissionFragment } from '@lambda-feedback/graphql-api/api/graphql-sdk'
import { PreviewFeedback } from '@lambda-feedback/graphql-api/api/requests/preview'
import { Text } from '@lambda-feedback/math-components'
import { BaseResponseAreaProps } from '@lambda-feedback/response-area-base'
import { makeStyles } from '@lambda-feedback/styles'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import useMediaQuery from '@mui/material/useMediaQuery'
import Box from '@mui/system/Box'
import useTheme from '@mui/system/useTheme'
import React, { useCallback, useEffect, useState } from 'react'

import { useDeepCompareEffect } from '../../../hooks/useDeepCompareEffect'
import { ResponsePreviewFormParams } from '../../useResponsePreviewForm'

import { Feedback } from './feedback'
import { DrawMode, InputMode, ScanMode, TypeMode } from './modes'
import { TypeSuggestion } from './modes/TypeMode/TypeMode.component'

type ExpressionProps = Omit<
  BaseResponseAreaProps,
  | 'handleChange'
  | 'setId'
  | 'responseAreaId'
  | 'universalResponseAreaId'
  | 'moduleSlug'
  | 'hasPreview'
  | 'answer'
> & {
  handleChange: (
    submission: string,
    additionalParams?: { is_latex: boolean },
  ) => void
  checkIsLoading?: boolean
  answer?: string
  allowDraw: boolean
  allowScan: boolean
  allowPreview: boolean
  isTeacherMode?: boolean
  showFeedbackContainer?: boolean
  preResponseText?: string | null
  postResponseText?: string | null
  responseParams?: ResponsePreviewFormParams
  feedback?: Pick<
    StandardSubmissionFragment,
    'isCorrect' | 'isError' | 'feedback' | 'matchedCase'
  > | null
  typesafeErrorMessage?: string
}

export const ExpressionInput: React.FC<ExpressionProps> = props => {
  const {
    handleSubmit,
    checkIsLoading,
    answer,
    handleChange,
    preResponseText,
    postResponseText,
    responseParams = null,
    feedback,
    typesafeErrorMessage,
    allowDraw,
    allowScan,
    allowPreview,
    isTeacherMode,
    showFeedbackContainer = true,
  } = props

  const { classes, cx } = useStyles()
  const theme = useTheme()

  const isBelowMediumScreen = useMediaQuery(theme.breakpoints.down('md'))

  const [mode, setMode] = useState<InputMode>('type')

  const [typePreview, setTypePreview] = useState<PreviewFeedback>()
  const [drawPreview, setDrawPreview] = useState<PreviewFeedback>()
  const [scanPreview, setScanPreview] = useState<PreviewFeedback>()

  const [typeLatex, setTypeLatex] = useState<string>('')
  const [drawLatex, setDrawLatex] = useState<string>('')
  const [scanLatex, setScanLatex] = useState<string>('')

  const [currentFeedback, setCurrentFeedback] = useState<PreviewFeedback>()
  const [currentLatex, setCurrentLatex] = useState<string>(answer ?? '')
  const [disableCheck, setDisableCheck] = useState<boolean>(false)
  const [validationIsLoading, setValidationIsLoading] = useState<boolean>(false)

  const [suggestions, setSuggestions] = useState<Array<TypeSuggestion>>([])
  const [showFeedback, setShowFeedback] = useState<boolean>(!!feedback)
  const [showTypesafeError, setShowTypesafeError] = useState<boolean>(false)

  useDeepCompareEffect(() => {
    setShowFeedback(!!feedback && !checkIsLoading)
  }, [feedback, checkIsLoading])

  useEffect(() => {
    setShowTypesafeError(!!typesafeErrorMessage)
  }, [typesafeErrorMessage])

  useDeepCompareEffect(() => {
    let response: PreviewFeedback | undefined, latex: string

    switch (mode) {
      case 'draw':
        response = drawPreview
        latex = drawLatex
        break
      case 'scan':
        response = scanPreview
        latex = scanLatex
        break
      default:
        response = typePreview
        latex = typeLatex
    }

    setShowFeedback(
      prev =>
        prev &&
        mode === 'type' &&
        (responseParams
          ? typePreview?.preview?.sympy === answer
          : latex === answer),
    )

    setShowTypesafeError(false)
    setCurrentFeedback(response)
    setCurrentLatex(latex)

    setValidationIsLoading(!!responseParams && !response && latex !== '')

    if (!responseParams) {
      handleChange(latex, { is_latex: mode !== 'type' })
      setDisableCheck(allowPreview && !latex)
      return
    }

    const sympy = response?.preview?.sympy
    handleChange(sympy, { is_latex: false })
    setDisableCheck(allowPreview && !sympy)
  }, [
    mode,
    typeLatex,
    typePreview,
    drawLatex,
    drawPreview,
    scanLatex,
    scanPreview,
  ])

  useDeepCompareEffect(() => {
    setSuggestions(
      [
        {
          ...drawPreview?.preview,
          mode: 'draw',
        },
        {
          ...scanPreview?.preview,
          mode: 'scan',
        },
      ].filter(({ sympy, latex }) => !!sympy && !!latex),
    )
  }, [drawPreview, scanPreview])

  const keyPress: React.KeyboardEventHandler<HTMLDivElement> = useCallback(
    event => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault()
        handleSubmit?.()

        return false
      }
    },
    [handleSubmit],
  )

  return (
    <Paper className={classes.container} elevation={0}>
      <Grid container>
        <Grid item xs={12} md={2}>
          <Box
            className={cx(
              classes.prePostResponseTextContainer,
              classes.preResponseTextContainer,
              (allowDraw || allowScan) && classes.prePostResponseTextGutter,
            )}>
            <Text
              className={classes.prePostResponseText}
              data={preResponseText ?? ''}
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={8}>
          <Box className={classes.modeWrapper}>
            <Box className={classes.inputWrapper}>
              <TypeMode
                className={cx(mode !== 'type' && classes.hiddenMode)}
                mode={mode}
                setMode={setMode}
                disableDraw={!allowDraw}
                disableScan={!allowScan}
                setResponse={setTypePreview}
                setPreviewLatex={setTypeLatex}
                autocompleteOptions={suggestions}
                responseParams={responseParams}
                defaultValue={answer}
                onKeyDown={keyPress}
              />
              {allowDraw && (
                <DrawMode
                  className={cx(mode !== 'draw' && classes.hiddenMode)}
                  mode={mode}
                  setMode={setMode}
                  disableScan={!allowScan}
                  setResponse={setDrawPreview}
                  setPreviewLatex={setDrawLatex}
                  responseParams={responseParams}
                  allowPreview={allowPreview}
                />
              )}
              {allowScan && (
                <ScanMode
                  className={cx(mode !== 'scan' && classes.hiddenMode)}
                  mode={mode}
                  setMode={setMode}
                  disableDraw={!allowDraw}
                  setResponse={setScanPreview}
                  setPreviewLatex={setScanLatex}
                  responseParams={responseParams}
                  allowPreview={allowPreview}
                />
              )}
            </Box>
          </Box>
        </Grid>
        {!isBelowMediumScreen && (
          <Grid item xs={12} md={2}>
            <Box
              className={cx(
                classes.prePostResponseTextContainer,
                classes.postResponseTextContainer,
                (allowDraw || allowScan) && classes.prePostResponseTextGutter,
              )}>
              <Text
                className={cx(classes.prePostResponseText)}
                data={postResponseText ?? ''}
              />
            </Box>
          </Grid>
        )}
        <Grid item xs={12} md={2}></Grid>
        <Grid item xs={12} md={8}>
          {showFeedbackContainer && (
            <Box className={classes.feedbackContainer}>
              <Feedback
                className={classes.feedback}
                handleSubmit={handleSubmit}
                validationIsLoading={validationIsLoading}
                checkIsLoading={!!checkIsLoading}
                disableCheck={disableCheck}
                allowPreview={allowPreview}
                isTeacherMode={isTeacherMode}
                teacherMode={!responseParams}
                showFeedback={showFeedback}
                showTypesafeError={showTypesafeError}
                previewFeedback={currentFeedback}
                previewLatex={currentLatex}
                submissionFeedback={feedback}
                typesafeErrorMessage={typesafeErrorMessage}
              />
            </Box>
          )}
        </Grid>
        <Grid item xs={12} md={2}></Grid>
        {isBelowMediumScreen && (
          <Grid item xs={12} md={2}>
            <Box
              className={cx(
                classes.prePostResponseTextContainer,
                classes.postResponseTextContainer,
                (allowDraw || allowScan) && classes.prePostResponseTextGutter,
              )}>
              <Text
                className={cx(classes.prePostResponseText)}
                data={postResponseText ?? ''}
              />
            </Box>
          </Grid>
        )}
      </Grid>
    </Paper>
  )
}

const useStyles = makeStyles()(theme => ({
  container: {
    maxWidth: theme.spacing(120),
    padding: theme.spacing(1),
    width: '100%',
    flexGrow: 1,

    [theme.breakpoints.down('md')]: {
      maxWidth: theme.spacing(65),
    },
  },
  modeWrapper: {
    borderTopColor: theme.palette.grey[300],
    borderTopStyle: 'solid',
    borderTopWidth: theme.spacing(0.2),
    borderLeftColor: theme.palette.grey[300],
    borderLeftStyle: 'solid',
    borderLeftWidth: theme.spacing(0.2),
    borderRightColor: theme.palette.grey[300],
    borderRightStyle: 'solid',
    borderRightWidth: theme.spacing(0.2),

    borderTopLeftRadius: theme.spacing(0.75),
    borderTopRightRadius: theme.spacing(0.75),
  },
  inputWrapper: {
    margin: theme.spacing(0, 0.5),
  },
  prePostResponseTextContainer: {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  prePostResponseTextGutter: {
    [theme.breakpoints.up('md')]: {
      paddingBottom: theme.spacing(5),
    },
  },
  preResponseTextContainer: {
    [theme.breakpoints.up('md')]: {
      justifyContent: 'flex-end',
      paddingRight: theme.spacing(1),
    },
  },
  postResponseTextContainer: {
    [theme.breakpoints.up('md')]: {
      justifyContent: 'flex-start',
      paddingLeft: theme.spacing(1),
    },
  },
  modeContainer: {
    display: 'flex',
    alignItems: 'center',
    minHeight: theme.spacing(14),
  },
  hiddenMode: {
    display: 'none',
  },
  feedbackContainer: {
    height: '100%',
    borderColor: theme.palette.grey[300],
    borderStyle: 'solid',
    borderWidth: theme.spacing(0.2),
    borderBottomLeftRadius: theme.spacing(0.75),
    borderBottomRightRadius: theme.spacing(0.75),
    borderTop: 'none',
    [theme.breakpoints.up('sm')]: {
      minHeight: theme.spacing(10),
    },
  },
  feedback: {
    margin: theme.spacing(0, 1),
    marginBottom: theme.spacing(0.5),
  },
  feedbackGrid: {
    height: '100%',
  },
  preSubmissionContainer: {
    [theme.breakpoints.up('md')]: {
      borderRightWidth: '0.5px',
      borderRightColor: theme.palette.grey[300],
      borderRightStyle: 'solid',
    },
  },
  postSubmissionContainer: {
    [theme.breakpoints.up('md')]: {
      borderLeftWidth: '0.5px',
      borderLeftColor: theme.palette.grey[300],
      borderLeftStyle: 'solid',
    },
  },
  preSubmissionFeedback: {},
  postSubmissionFeedback: {},
  prePostResponseText: {
    alignSelf: 'center',
    textAlign: 'center',
  },
  expressionMenuContainer: {
    borderColor: theme.palette.grey[300],
    borderStyle: 'solid',
    borderWidth: theme.spacing(0.2),
    borderTop: 'none',
    borderBottom: 'none',
  },
  expressionMenu: {
    margin: theme.spacing(0, 0.5),
  },
}))
