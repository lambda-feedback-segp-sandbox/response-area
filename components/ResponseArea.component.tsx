import {
  StandardResponseAreaFragment,
  StandardTeacherResponseAreaFragment,
} from '@lambda-feedback/graphql-api/api/graphql'
import { initialiseTub } from '@lambda-feedback/response-area-base'
import React from 'react'

import { useDeepMemo } from '../hooks/useDeepMemo'
import {
  IModularResponseSchema,
  IResponseAreaSchema,
} from '../schemas/question-form.schema'
import { Stylable } from '../types/react'

import { InputSymbolForDisplay } from './InputSymbols'
import { ResponseAreaView } from './ResponseAreaView.component'
import { useResponseAreaTub } from './types/use-response-area-tub'
import { PickedFeedback, useResponseAreaForm } from './useResponseAreaForm'

/**
 * Defines the display mode for the response area.
 *
 * - `normal`: Displays the full response area.
 * - `peek`: Shows a simplified preview of the response area.
 */
export type ResponseAreaDisplayMode = 'normal' | 'peek'

/**
 * Props for configuring a Response Area component.
 *
 * @interface ResponseAreaProps
 * @extends Stylable
 */
export interface ResponseAreaProps extends Stylable {
  /**
   * The response area data, which can be one of the following:
   * - `StandardResponseAreaFragment`
   * - `StandardTeacherResponseAreaFragment`
   * - `IResponseAreaSchema`
   *
   * These types are used to define the structure of the response area and gotten depending on the user type.
   *
   * @type {StandardResponseAreaFragment | StandardTeacherResponseAreaFragment | IResponseAreaSchema}
   */
  area:
    | StandardResponseAreaFragment
    | StandardTeacherResponseAreaFragment
    | IResponseAreaSchema

  /**
   * Callback function triggered when the input value changes.
   * Useful for updating the handleChange functions.
   *
   * @param {IModularResponseSchema['answer'] | undefined} answer - The updated answer.
   * @param {Record<string, any> | undefined} additionalParams - Additional parameters related to the change.
   * @returns {void}
   */
  onChange?: (
    answer?: IModularResponseSchema['answer'],
    additionalParams?: Record<string, any>,
  ) => void

  /**
   * The initial answer value of the response area.
   * Used to display previous submissions (e.g., in student views) or to pre-fill values.
   *
   * @type {IModularResponseSchema['answer'] | undefined}
   */
  inititialAnswer?: IModularResponseSchema['answer']

  /**
   * The initial feedback value associated with the response area.
   * Used to display previous feedback submissions, primarily on the student side.
   *
   * @type {PickedFeedback | undefined}
   */
  inititialFeedback?: PickedFeedback

  /**
   * Whether to hide the check button, disabling submission functionality.
   *
   * @type {boolean | undefined}
   */
  hideCheck?: boolean

  /**
   * Whether to hide the save button, disabling draft save functionality.
   *
   * @type {boolean | undefined}
   */
  hideSave?: boolean

  /**
   * Optional label used to wrap the response area in a labelled content box.
   *
   * @type {string | undefined}
   */
  wrapLabel?: string

  /**
   * Optional React nodes for action buttons, typically displayed on the side of the response area.
   *
   * @type {React.ReactNode | undefined}
   */
  ActionButtons?: React.ReactNode

  /**
   * Defines the display mode of the response area.
   * - `normal` (default): Displays the full response area.
   * - `peek`: Shows a simpler preview version.
   *
   * @type {ResponseAreaDisplayMode | undefined}
   */
  displayMode?: ResponseAreaDisplayMode
}

/**
 * The `ResponseArea` component is the controller responsible for retrieving the relevant {@link useResponseAreaTub | response area tub} with various configurable options.
 * It utilizes the {@link useResponseAreaForm} hook to manage the state and behavior of the response area props that get given to the view.
 * The component memoizes its props using {@link useDeepMemo} to optimize performance.
 * Depending on the type of response and display mode, which is gotten from a combination of the current user type and question selected, it initializes the response area tub accordingly.
 * Finally, it renders the {@link ResponseAreaView} component with the appropriate props.
 *
 * @component
 * @param {ResponseAreaProps} props - The properties used to configure the `ResponseArea` component.
 * @param {StandardResponseAreaFragment | StandardTeacherResponseAreaFragment | IResponseAreaSchema} props.area - The response area data gotten depending on the user type.
 * @param {(answer?: IModularResponseSchema['answer'], additionalParams?: Record<string, any>) => void} [props.onChange] - Callback function triggered when the input value changes. Useful for updating the handleChange functions.
 * @param {IModularResponseSchema['answer']} [props.inititialAnswer] - The initial answer value of the response area.
 * @param {PickedFeedback} [props.inititialFeedback] - The initial feedback value associated with the response area.
 * @param {boolean} [props.hideCheck] - Whether to hide the check button.
 * @param {boolean} [props.hideSave] - Whether to hide the save button.
 * @param {string} [props.wrapLabel] - Optional label used to wrap the response area in a labelled content box.
 * @param {React.ReactNode} [props.ActionButtons] - Optional React nodes for action buttons.
 * @param {ResponseAreaDisplayMode} [props.displayMode] - Defines the display mode of the response area.
 *
 * @returns {JSX.Element | null} The rendered `ResponseAreaView` component or null if the tub reference is not available.
 */
export const ResponseArea: React.FC<ResponseAreaProps> = props => {
  const { area, onChange, inititialAnswer, inititialFeedback } = props

  const {
    inFlight,
    handleChange,
    handleCheck,
    handleDraftSave,
    inputDisplayValue,
    feedback,
    validationMessage,
    requestError,
    isTeacherMode,
  } = useResponseAreaForm({
    area,
    onChange,
    inititialAnswer,
    inititialFeedback,
  })

  const memoProps = useDeepMemo(() => {
    const safeSymbols:
      | (InputSymbolForDisplay & { isVisible: boolean })[]
      | undefined = area.inputSymbols

    const visibleSymbols: InputSymbolForDisplay[] = safeSymbols
      ? safeSymbols.filter(symbol => symbol.isVisible)
      : []

    return {
      responseAreaId: 'id' in area ? area.id : undefined,
      universalResponseAreaId: area.universalResponseAreaId,
      inputType: area.response?.responseType!,
      response: area.response ?? undefined,
      visibleSymbols,
      preResponseText: area.preResponseText ?? undefined,
      postResponseText: area.postResponseText ?? undefined,
      displayInputSymbols:
        'displayInputSymbols' in area
          ? area.displayInputSymbols
          : area.displaySymbols,
      showLivePreview: area.livePreview,

      inputDisplayValue,
      handleChange,
      handleCheck,
      handleDraftSave,
      inFlight,
      feedback,
      validationMessage,
      requestError,

      displayMode: props.displayMode,
      isTeacherMode,
      hideCheck: props.hideCheck,
      hideSave: props.hideSave,
    }
  }, [
    area,
    feedback,
    handleChange,
    handleCheck,
    handleDraftSave,
    inFlight,
    inputDisplayValue,
    requestError,
    validationMessage,
    props.hideCheck,
    props.hideSave,
  ])

  const viewProps = { ...props, ...memoProps }

  const { displayMode, inputType } = viewProps

  const tubRef = useResponseAreaTub(inputType)

  if (!tubRef.current) return null

  initialiseTub(
    tubRef.current,
    area.response ?? undefined,
    displayMode ?? 'normal',
  )

  return <ResponseAreaView tub={tubRef.current} {...viewProps} />
}
