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

/**
 * Props for the ResponseAreaView component.
 *
 * @interface ResponseAreaViewProps
 * @extends Stylable
 */
export interface ResponseAreaViewProps extends Stylable {
  /**
   * The action buttons to be displayed in the response area border (optional).
   *
   * @type {React.ReactNode}
   */
  ActionButtons?: React.ReactNode

  /**
   * The response area tub containing the input and wizard components to be rendered in the response area.
   *
   * @type {ResponseAreaTub}
   */
  tub: ResponseAreaTub

  /**
   * ID of the response area which can be used in the tub (optional).
   * @see {@link ResponseAreaViewProps.tub}
   *
   * @type {string | undefined}
   */
  responseAreaId?: string

  /**
   * Universal ID of the response area which can be used in the tub (optional).
   * @see {@link ResponseAreaViewProps.tub}
   * @type {string | undefined}
   */
  universalResponseAreaId?: string

  /**
   * The type of the response area tub input component as a string.
   * Each new response area tub should have a unique input type.
   *
   * @type {string}
   */
  inputType: string

  /**
   * Symbols visible in the input field.
   *
   * @type {InputSymbolForDisplay[]}
   */
  visibleSymbols: InputSymbolForDisplay[]

  /**
   * Text displayed before the response input (optional).
   *
   * @type {string | undefined}
   */
  preResponseText?: string

  /**
   * Text displayed after the response input (optional).
   *
   * @type {string | undefined}
   */
  postResponseText?: string

  /**
   * Whether to display input symbols in response area input component.
   *
   * @type {boolean}
   */
  displayInputSymbols: boolean

  /**
   * Whether to show a live preview of the input in the response area input component.
   *
   * @type {boolean}
   */
  showLivePreview: boolean

  /**
   * The current input value of the response area (optional).
   *
   * @type {IResponseAreaAnswerSchema | undefined}
   */
  inputDisplayValue?: IResponseAreaAnswerSchema

  /**
   * Handles input change in the response area.
   *
   * @param {IResponseAreaAnswerSchema | undefined} response - The updated response data.
   * @param {Record<string, any> | undefined} additionalParams - Optional additional parameters.
   * @returns {void}
   */
  handleChange: (
    response?: IResponseAreaAnswerSchema,
    additionalParams?: Record<string, any>,
  ) => void

  /**
   * Function to handle input response validation in the response area component.
   *
   * @returns {void}
   */
  handleCheck: () => void

  /**
   * Function to handle saving a draft response.
   *
   * @returns {void}
   */
  handleDraftSave: () => void

  /**
   * Indicates if a response submission or save is in progress.
   *
   * @type {boolean}
   */
  inFlight: boolean

  /**
   * Feedback information from a submission (optional).
   *
   * @type {PickedFeedback | undefined}
   */
  feedback?: PickedFeedback

  /**
   * Validation message of submission, if any (optional).
   *
   * @type {string | undefined}
   */
  validationMessage?: string

  /**
   * Error encountered during a request (optional).
   *
   * @type {unknown}
   */
  requestError?: unknown

  /**
   * Display mode of the response area (default: 'normal').
   *
   * @type {'normal' | 'peek' | undefined}
   */
  displayMode?: 'normal' | 'peek'

  /**
   * Whether the response area is in teacher mode allowing for additional features in the input component being exposed (optional).
   *
   * @type {boolean | undefined}
   */
  isTeacherMode?: boolean

  /**
   * Whether to hide the check button (optional).
   *
   * @type {boolean | undefined}
   */
  hideCheck?: boolean

  /**
   * Whether to hide the save button (optional).
   *
   * @type {boolean | undefined}
   */
  hideSave?: boolean

  /**
   * Optional label wrapping setting around the response area.
   *
   * @type {string | undefined}
   */
  wrapLabel?: string
}

/**
 * The ResponseAreaView component renders a response area with various configurable options.
 * It includes input components, pre and post response texts, validation messages, feedback, and action buttons.
 *
 * @component
 * @param {ResponseAreaViewProps} props - The properties used to render the ResponseAreaView component.
 * @param {React.ReactNode} [props.ActionButtons] - Optional action buttons to be displayed in the response area.
 * @param {ResponseAreaTub} props.tub - The response area tub containing the input and wizard components to be rendered in the response area.
 * @param {string} [props.responseAreaId] - Optional ID for the response area component to use.
 * @param {string} [props.universalResponseAreaId] - Optional universal ID for the response area to use.
 * @param {string} props.inputType - The input type of the response area. Every response area tub should have a unique input type. This can be used by the response area tub.
 * @param {InputSymbolForDisplay[]} props.visibleSymbols - Symbols visible in the input area.
 * @param {string} [props.preResponseText] - Optional text to display before the response area.
 * @param {string} [props.postResponseText] - Optional text to display after the response area.
 * @param {boolean} props.displayInputSymbols - Flag to display input symbols.
 * @param {boolean} props.showLivePreview - Flag to determine when to show a live preview of the response (if defined).
 * @param {IResponseAreaAnswerSchema} [props.inputDisplayValue] - Optional value to display in the input area.
 * @param {(response?: IResponseAreaAnswerSchema, additionalParams?: Record<string, any>) => void} props.handleChange - Function to handle changes in the response area. Typically defines how the data is processed and sent to the evaluatiion function or server.
 * @param {() => void} props.handleCheck - Function to handle the check action for the underlying response area input component's response.
 * @param {() => void} props.handleDraftSave - Function to handle saving a draft for the underlying response area input component's response.
 * @param {boolean} props.inFlight - Flag indicating if a request is in progress. This can be used to show a loading spinner in the response area.
 * @param {PickedFeedback} [props.feedback] - Optional feedback for the response.
 * @param {string} [props.validationMessage] - Optional validation message.
 * @param {unknown} [props.requestError] - Optional error from a request.
 * @param {'normal' | 'peek'} [props.displayMode] - Optional display mode for the response area, either 'normal' or 'peek'.
 * @param {boolean} [props.isTeacherMode] - Optional flag indicating if the component is in teacher mode. Typically used to expose additional features in the input component.
 * @param {boolean} [props.hideCheck] - Optional flag to hide the check button.
 * @param {boolean} [props.hideSave] - Optional flag to hide the save button.
 * @param {string} [props.wrapLabel] - Optional label for wrapping the response area with a label and border.
 *
 * @returns {JSX.Element} The rendered ResponseAreaView component.
 */
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

  /**
   * Wrapper component that conditionally applies a label if `wrapLabel` is provided.
   *
   * @component
   * @param {Object} props - The props for the wrapper.
   * @param {React.ReactNode} props.children - The child elements to be wrapped.
   * @returns {JSX.Element} The wrapped content.
   */
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
