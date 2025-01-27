import {
  StudentModularResponseFragment,
  TeacherModularResponseFragment,
} from '@lambda-feedback-segp-sandbox/graphql-api/api/graphql'
import { useResponseAreaTub } from './types/use-response-area-tub'
import {
  IModularResponseSchema,
  IResponseAreaAnswerSchema,
} from '../schemas/question-form.schema'
import { noop } from 'lodash'
import React from 'react'

import { PickedFeedback } from './useResponseAreaForm'

interface ResponseAreaInputProps {
  responseAreaId?: string
  universalResponseAreaId?: string
  inputType: string
  setResponseValue: (
    val?: IResponseAreaAnswerSchema,
    additionalParams?: Record<string, any>,
  ) => void
  value?: IResponseAreaAnswerSchema
  response?:
    | TeacherModularResponseFragment
    | StudentModularResponseFragment
    | IModularResponseSchema
  onSubmit: () => void
  onDraftSave: () => void
  previewSubmit?: (val: string) => void
  preResponseText?: string
  postResponseText?: string
  submissionFeedback?: PickedFeedback
  typesafeErrorMessage?: string
  displayMode?: 'normal' | 'peek'
  isTeacherMode?: boolean
  checkIsLoading?: boolean
  showLivePreview: boolean
}

export const ResponseAreaInput: React.FC<ResponseAreaInputProps> = props => {
  const {
    responseAreaId,
    universalResponseAreaId,
    inputType,
    setResponseValue,
    response,
    value,
    previewSubmit,
    onSubmit,
    onDraftSave,
    preResponseText,
    postResponseText,
    submissionFeedback,
    typesafeErrorMessage,
    displayMode = 'normal',
    isTeacherMode,
    checkIsLoading = false,
    showLivePreview = false,
  } = props

  const tubRef = useResponseAreaTub(inputType)

  if (!tubRef.current) return null

  if (response === undefined || displayMode === 'peek') {
    tubRef.current.initWithDefault()
  } else if (
    '__typename' in response &&
    response.__typename === 'TeacherModularResponse'
  ) {
    tubRef.current.initWithTeacherFragment(response)
  } else if (
    '__typename' in response &&
    response.__typename === 'StudentModularResponse'
  ) {
    tubRef.current.initWithStudentFragment(response)
  } else {
    tubRef.current.initWithResponse(response)
  }

  return (
    <tubRef.current.InputComponent
      key={inputType}
      handleChange={setResponseValue}
      handleSubmit={onSubmit}
      handleDraftSave={onDraftSave}
      previewSubmit={previewSubmit ?? noop}
      answer={value}
      hasPreview={showLivePreview}
      preResponseText={preResponseText}
      postResponseText={postResponseText}
      feedback={submissionFeedback}
      typesafeErrorMessage={typesafeErrorMessage}
      displayMode={displayMode}
      isTeacherMode={isTeacherMode}
      checkIsLoading={checkIsLoading}
      responseAreaId={responseAreaId}
      universalResponseAreaId={universalResponseAreaId}
    />
  )
}
