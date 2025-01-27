import {
  StandardResponseAreaFragment,
  StandardTeacherResponseAreaFragment,
} from '@lambda-feedback-segp-sandbox/graphql-api/api/graphql'
import { LabelledContent } from '@lambda-feedback-segp-sandbox/labelled-content'
import { Text } from '@lambda-feedback-segp-sandbox/math-components'
import { makeStyles } from '@lambda-feedback-segp-sandbox/styles'
import LoadingButton from '@mui/lab/LoadingButton'
import Box from '@mui/material/Box'
import FormHelperText from '@mui/material/FormHelperText'
import { noop } from 'lodash'
import React from 'react'
import { Stylable } from 'types/react'

import {
  IModularResponseSchema,
  IResponseAreaSchema,
} from '../schemas/question-form.schema'

import { ResponseAreaFeedback } from './Feedback/ResponseAreaFeedback.component'
import { InputSymbols } from './InputSymbols'
import { useResponseAreaContext } from './ResponseArea.context'
import {
  ResponseAreaDisplayMode,
  ResponseAreaProvider,
} from './ResponseArea.provider'
import { ResponseAreaInput } from './ResponseAreaInput.component'
import { useResponseAreaTub } from './types/use-response-area-tub'
import { PickedFeedback } from './useResponseAreaForm'

interface ResponseAreaProps extends Stylable {
  area:
    | StandardResponseAreaFragment
    | StandardTeacherResponseAreaFragment
    | IResponseAreaSchema

  // used as a callback to update parents when the input is changed.
  // Especially useful for Tests and Cases
  onChange?: (
    answer?: IModularResponseSchema['answer'],
    additionalParams?: Record<string, any>,
  ) => void

  // to set the initial value of the input. Used e.g. by the student side (to
  // display the previous submission) or Tests and Cases (to display their
  // current value)
  inititialAnswer?: IModularResponseSchema['answer']

  // to set the initial value of the feedback. Used by the student side to display the previous submission)
  inititialFeedback?: PickedFeedback

  // to hide the check button and disable submissions
  hideCheck?: boolean

  // to hide the save button and disable draft save
  hideSave?: boolean

  // to surround the RA with a labelled content box
  wrapLabel?: string

  // action buttons display on the side  of the RA
  ActionButtons?: React.ReactNode

  // choose to display the full response area ('normal', default) or just
  // a simpler preview ('peek')
  displayMode?: ResponseAreaDisplayMode
}

export const ResponseArea: React.FC<ResponseAreaProps> = ({
  area,
  onChange,
  inititialAnswer,
  inititialFeedback,
  hideCheck,
  hideSave,
  wrapLabel,
  ActionButtons,
  displayMode,
  className,
}) => {
  const { classes, cx } = useStyles()

  return (
    <ResponseAreaProvider
      area={area}
      onChange={onChange}
      inititialAnswer={inititialAnswer}
      inititialFeedback={inititialFeedback}
      hideCheck={hideCheck}
      hideSave={hideSave}
      displayMode={displayMode}>
      <div className={cx(className)}>
        {wrapLabel ? (
          <LabelledContent
            label={wrapLabel!}
            className={classes.labelledContent}>
            <ResponseAreaInnerWrapper ActionButtons={ActionButtons} />
          </LabelledContent>
        ) : (
          <Box sx={{ p: 2 }}>
            <ResponseAreaInnerWrapper ActionButtons={ActionButtons} />
          </Box>
        )}
      </div>
    </ResponseAreaProvider>
  )
}

const ResponseAreaInnerWrapper: React.FC<{
  ActionButtons?: React.ReactNode
}> = ({ ActionButtons }) => {
  const { classes, cx } = useStyles()

  const { inputType } = useResponseAreaContext()

  const tubRef = useResponseAreaTub(inputType)

  return (
    <div
      className={cx(
        classes.responseAreaInnerWrapper,
        'reference-response-area-inner-wrapper',
        tubRef?.current?.displayAlwaysInColumn
          ? classes.alwaysColumn
          : undefined,
      )}>
      <ResponseAreaInner />
      {ActionButtons && (
        <div
          className={cx(
            classes.actionButtons,
            'reference-buttons',
            tubRef?.current?.displayAlwaysInColumn
              ? classes.actionButtonsAlwaysColumn
              : undefined,
          )}>
          {ActionButtons}
        </div>
      )}
    </div>
  )
}

const ResponseAreaInner: React.FC = () => {
  const { classes, cx } = useStyles()

  const {
    responseAreaId,
    universalResponseAreaId,
    inputType,
    response,
    visibleSymbols,
    preResponseText,
    postResponseText,
    showLivePreview,
    displayInputSymbols,

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
  } = useResponseAreaContext()

  const tubRef = useResponseAreaTub(inputType)

  return (
    <div className={cx(classes.verticalArrangement)}>
      <div
        className={cx(
          tubRef.current?.displayInFlexContainer
            ? classes.innerContentWrapper
            : undefined,
          tubRef?.current?.displayAlwaysInColumn
            ? classes.alwaysColumn
            : undefined,
        )}>
        {preResponseText && tubRef.current?.delegatePreResponseText && (
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
            tubRef?.current?.displayWideInput
              ? classes.inputContainerWide
              : undefined,
          )}>
          <ResponseAreaInput
            setResponseValue={handleChange}
            responseAreaId={responseAreaId}
            universalResponseAreaId={universalResponseAreaId}
            inputType={inputType}
            value={inputDisplayValue}
            onSubmit={hideCheck ? noop : handleCheck}
            onDraftSave={hideSave ? noop : handleDraftSave}
            response={response}
            preResponseText={preResponseText}
            postResponseText={postResponseText}
            submissionFeedback={feedback}
            typesafeErrorMessage={validationMessage}
            checkIsLoading={!!inFlight}
            showLivePreview={showLivePreview}
            displayMode={displayMode}
            isTeacherMode={isTeacherMode}
          />

          {validationMessage && tubRef.current?.delegateErrorMessage && (
            <FormHelperText className={classes.validationMessage}>
              {validationMessage}
            </FormHelperText>
          )}
        </div>

        {postResponseText && tubRef.current?.delegatePostResponseText && (
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
            <div className={cx(classes.centered, 'reference-save-container')}>
              <LoadingButton
                size={'small'}
                variant={'contained'}
                onClick={handleDraftSave}
                loading={inFlight}>
                SAVE
              </LoadingButton>
            </div>
          )}

          {!hideCheck && tubRef.current?.delegateCheck && (
            <div className={cx(classes.centered, 'reference-check-container')}>
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

      {feedback && tubRef.current?.delegateFeedback && (
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
