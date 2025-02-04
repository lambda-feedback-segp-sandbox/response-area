import { LabelledContent } from '@lambda-feedback-segp-sandbox/content-components'
import { Text } from '@lambda-feedback-segp-sandbox/math-components'
import { ResponseAreaTub } from '@lambda-feedback-segp-sandbox/response-area-base'
import { makeStyles } from '@lambda-feedback-segp-sandbox/styles'
import LoadingButton from '@mui/lab/LoadingButton'
import Box from '@mui/material/Box'
import FormHelperText from '@mui/material/FormHelperText'
import { noop } from 'lodash'
import React from 'react'

import { IResponseAreaAnswerSchema } from '../schemas/question-form.schema'
import { Stylable } from '../types/react'

import { ResponseAreaFeedback } from './Feedback/ResponseAreaFeedback.component'
import { InputSymbolForDisplay, InputSymbols } from './InputSymbols'
import { PickedFeedback } from './useResponseAreaForm'

interface ResponseAreaViewProps extends Stylable {
  ActionButtons?: React.ReactNode

  tub: ResponseAreaTub

  responseAreaId?: string
  universalResponseAreaId?: string
  inputType: string
  visibleSymbols: InputSymbolForDisplay[]
  preResponseText?: string
  postResponseText?: string
  displayInputSymbols: boolean
  showLivePreview: boolean

  inputDisplayValue?: IResponseAreaAnswerSchema
  handleChange: (
    response?: IResponseAreaAnswerSchema,
    additionalParams?: Record<string, any>,
  ) => void
  handleCheck: () => void
  handleDraftSave: () => void
  inFlight: boolean
  feedback?: PickedFeedback
  validationMessage?: string
  requestError?: unknown

  displayMode?: 'normal' | 'peek'
  isTeacherMode?: boolean
  hideCheck?: boolean
  hideSave?: boolean
  wrapLabel?: string
}

export const ResponseAreaView: React.FC<ResponseAreaViewProps> = props => {
  const { classes, cx } = useStyles()

  const {
    ActionButtons,
    tub,
    responseAreaId,
    universalResponseAreaId,
    inputType,
    visibleSymbols,
    preResponseText,
    postResponseText,
    displayInputSymbols,
    showLivePreview,
    inputDisplayValue,
    handleChange,
    handleCheck,
    handleDraftSave,
    inFlight,
    feedback,
    validationMessage,
    requestError,
    displayMode,
    isTeacherMode,
    hideCheck,
    hideSave,
    wrapLabel,
  } = props

  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return wrapLabel ? (
      <LabelledContent label={wrapLabel!} className={classes.labelledContent}>
        {children}
      </LabelledContent>
    ) : (
      <Box sx={{ p: 2 }}>{children}</Box>
    )
  }

  return (
    <Wrapper>
      <div
        className={cx(
          classes.responseAreaInnerWrapper,
          'reference-response-area-inner-wrapper',
          tub?.displayAlwaysInColumn ? classes.alwaysColumn : undefined,
        )}>
        <div className={cx(classes.verticalArrangement)}>
          <div
            className={cx(
              tub?.displayInFlexContainer
                ? classes.innerContentWrapper
                : undefined,
              tub?.displayAlwaysInColumn ? classes.alwaysColumn : undefined,
            )}>
            {preResponseText && tub?.delegatePreResponseText && (
              <Text
                className={cx(
                  classes.centered,
                  classes.preText,
                  'reference-pretext',
                )}
                data={preResponseText}
              />
            )}

            <div
              className={cx(
                classes.centered,
                tub?.displayWideInput ? classes.inputContainerWide : undefined,
              )}>
              <tub.InputComponent
                key={inputType}
                handleChange={handleChange}
                handleSubmit={hideCheck ? noop : handleCheck}
                handleDraftSave={hideSave ? noop : handleDraftSave}
                answer={inputDisplayValue}
                hasPreview={showLivePreview}
                preResponseText={preResponseText}
                postResponseText={postResponseText}
                feedback={feedback}
                typesafeErrorMessage={validationMessage}
                displayMode={displayMode}
                isTeacherMode={isTeacherMode}
                checkIsLoading={!!inFlight}
                responseAreaId={responseAreaId}
                universalResponseAreaId={universalResponseAreaId}
              />

              {validationMessage && tub?.delegateErrorMessage && (
                <FormHelperText className={classes.validationMessage}>
                  {validationMessage}
                </FormHelperText>
              )}
            </div>

            {postResponseText && tub?.delegatePostResponseText && (
              <Text
                className={cx(
                  classes.centered,
                  classes.postText,
                  'reference-posttext',
                )}
                data={postResponseText}
              />
            )}

            <div className={cx(classes.centered, classes.buttons)}>
              {!hideSave && (
                <div
                  className={cx(classes.centered, 'reference-save-container')}>
                  <LoadingButton
                    size={'small'}
                    variant={'contained'}
                    onClick={handleDraftSave}
                    loading={inFlight}>
                    SAVE
                  </LoadingButton>
                </div>
              )}

              {!hideCheck && tub?.delegateCheck && (
                <div
                  className={cx(classes.centered, 'reference-check-container')}>
                  <LoadingButton
                    size={'small'}
                    variant={'contained'}
                    onClick={handleCheck}
                    loading={inFlight}>
                    CHECK
                  </LoadingButton>
                </div>
              )}
            </div>
          </div>

          {displayInputSymbols && <InputSymbols symbols={visibleSymbols} />}

          {feedback && tub?.delegateFeedback && (
            <ResponseAreaFeedback response={feedback} />
          )}

          {requestError ? (
            <div>
              <p
                className={
                  classes.requestError
                }>{`The request failed ${JSON.stringify(requestError)}`}</p>
            </div>
          ) : null}
        </div>
        {ActionButtons && (
          <div
            className={cx(
              classes.actionButtons,
              'reference-buttons',
              tub?.displayAlwaysInColumn
                ? classes.actionButtonsAlwaysColumn
                : undefined,
            )}>
            {ActionButtons}
          </div>
        )}
      </div>
    </Wrapper>
  )
}

const useStyles = makeStyles()(theme => ({
  //
  // LAYOUTS
  //

  // optional wrapper around the 'inner wrapper' for the labelled content box.
  // Needs padding to prevent the inner elements from touching the borders
  labelledContent: {
    padding: theme.spacing(2),
  },

  // wrapper around the buttons column (when displayed) and the 'vertical arrangement'
  // displayed in a row on larger screens, in a column on smaller screens
  responseAreaInnerWrapper: {
    display: 'flex',
    flexDirection: 'row',
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
    },
    gap: theme.spacing(2),
  },

  // wrapper around the 'vertical arrangement': 'inner content', symbols, feedback, request error
  // always displayed in a column
  verticalArrangement: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    justifyContent: 'center',
  },

  // wrapper around the 'inner content': pre/post text, input, check button, live preview
  // displayed in a row on larger screens, in a column on smaller screens
  innerContentWrapper: {
    display: 'flex',
    flexDirection: 'row',
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
    },
    gap: theme.spacing(2),
    justifyContent: 'center',
  },

  actionButtons: {
    display: 'flex',
    justifyContent: 'start',
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: theme.spacing(1),
    [theme.breakpoints.down('md')]: {
      maxWidth: theme.spacing(18),
      alignSelf: 'end',
    },
  },

  actionButtonsAlwaysColumn: {
    flexDirection: 'row',
    alignSelf: 'end',
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
    },
  },

  //
  // UTILITIES
  //
  centered: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttons: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    gap: theme.spacing(1),
    alignItems: 'stretch',
  },

  //
  // ELEMENTS
  //
  validationMessage: {
    color: 'red',
    fontSize: 16,
  },
  requestError: {
    padding: theme.spacing(2),
    backgroundColor: '#58aed6',
  },
  preText: {
    margin: 0,
    maxWidth: '100%',
  },
  postText: {
    margin: 0,
    maxWidth: '100%',
  },
  inputContainerWide: {
    flexGrow: 1,
  },
  alwaysColumn: {
    flexDirection: 'column',
  },
}))
