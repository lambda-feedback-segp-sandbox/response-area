import {
  TeacherModularResponseFragment,
  StudentModularResponseFragment,
} from '@lambda-feedback-segp-sandbox/graphql-api/api/graphql'
import { createContext, useContext } from 'react'

import {
  IModularResponseSchema,
  IResponseAreaAnswerSchema,
} from '../schemas/question-form.schema'

import { InputSymbolForDisplay } from './InputSymbols'
import { PickedFeedback } from './useResponseAreaForm'

export type ResponseAreaContextValue = {
  responseAreaId?: string
  universalResponseAreaId?: string
  inputType: string
  response?:
    | TeacherModularResponseFragment
    | StudentModularResponseFragment
    | IModularResponseSchema
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
}

export const ResponseAreaContext = createContext<
  ResponseAreaContextValue | undefined
>(undefined)

export const useResponseAreaContext = () => {
  const questionContext = useContext(ResponseAreaContext)

  if (!questionContext) {
    throw new Error(
      'useResponseAreaContext has to be used within <ResponseAreaContext.Provider>',
    )
  }

  return questionContext as ResponseAreaContextValue
}

export const useOptionalResponseAreaContext = () => {
  return useContext(ResponseAreaContext)
}
