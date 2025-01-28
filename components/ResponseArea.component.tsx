import { useDeepMemo } from '@hooks/useDeepMemo'
import {
  StandardResponseAreaFragment,
  StandardTeacherResponseAreaFragment,
} from '@lambda-feedback-segp-sandbox/graphql-api/api/graphql'
import React from 'react'
import { Stylable } from 'types/react'

import {
  IModularResponseSchema,
  IResponseAreaSchema,
} from '../schemas/question-form.schema'

import { InputSymbolForDisplay } from './InputSymbols'
import { ResponseAreaDisplayMode } from './ResponseArea.provider'
import { ResponseAreaView } from './RespoonseAreaV2'
import { useResponseAreaTub } from './types/use-response-area-tub'
import { PickedFeedback, useResponseAreaForm } from './useResponseAreaForm'

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

// Turns into the controller component
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

  const returnValues = useDeepMemo(() => {
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

      inputDisplayValueMemo: inputDisplayValue,
      handleChangeMemo: handleChange,
      handleCheckMemo: handleCheck,
      handleDraftSaveMemo: handleDraftSave,
      inFlightMemo: inFlight,
      feedbackMemo: feedback,
      validationMessageMemo: validationMessage,
      requestErrorMemo: requestError,

      displayModeMemo: displayMode,
      isTeacherModeMemo: isTeacherMode,
      hideCheckMemo: hideCheck,
      hideSaveMemo: hideSave,
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
    hideCheck,
    hideSave,
  ])

  const {
    inputType,
    visibleSymbols,
    displayInputSymbols,
    showLivePreview,
    handleChangeMemo,
    handleCheckMemo,
    handleDraftSaveMemo,
    inFlightMemo,
    responseAreaId,
    universalResponseAreaId,
    preResponseText,
    postResponseText,
    inputDisplayValueMemo,
    feedbackMemo,
    validationMessageMemo,
    requestErrorMemo,
    displayModeMemo,
    isTeacherModeMemo,
    hideCheckMemo,
    hideSaveMemo,
  } = returnValues

  const tubRef = useResponseAreaTub(inputType)

  if (!tubRef.current) return null

  return (
    <ResponseAreaView
      responseAreaId={responseAreaId}
      universalResponseAreaId={universalResponseAreaId}
      tub={tubRef.current}
      inputType={inputType}
      preResponseText={preResponseText}
      postResponseText={postResponseText}
      visibleSymbols={visibleSymbols}
      displayInputSymbols={displayInputSymbols}
      showLivePreview={showLivePreview}
      inputDisplayValue={inputDisplayValueMemo}
      handleChange={handleChangeMemo}
      handleCheck={handleCheckMemo}
      handleDraftSave={handleDraftSaveMemo}
      inFlight={inFlightMemo}
      feedback={feedbackMemo}
      validationMessage={validationMessageMemo}
      requestError={requestErrorMemo}
      displayMode={displayModeMemo}
      isTeacherMode={isTeacherModeMemo}
      hideCheck={hideCheckMemo}
      hideSave={hideSaveMemo}
      wrapLabel={wrapLabel}
    />
  )
}
