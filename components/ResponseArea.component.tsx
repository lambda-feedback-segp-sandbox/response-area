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
import { ResponseAreaView } from './ResponseAreaView.component'
import { useResponseAreaTub } from './types/use-response-area-tub'
import { PickedFeedback, useResponseAreaForm } from './useResponseAreaForm'

export type ResponseAreaDisplayMode = 'normal' | 'peek'

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

  if (!area.response || displayMode === 'peek') {
    tubRef.current.initWithDefault()
  } else if (
    '__typename' in area.response &&
    area.response.__typename === 'TeacherModularResponse'
  ) {
    tubRef.current.initWithTeacherFragment(area.response)
  } else if (
    '__typename' in area.response &&
    area.response.__typename === 'StudentModularResponse'
  ) {
    tubRef.current.initWithStudentFragment(area.response)
  } else {
    tubRef.current.initWithResponse(area.response)
  }

  return <ResponseAreaView tub={tubRef.current} {...viewProps} />
}
