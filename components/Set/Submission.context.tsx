import {
  StandardResponseAreaFragment,
  StandardTeacherResponseAreaFragment,
  SubmitResponseMutation,
  SubmitResponseMutationVariables,
  TeacherSubmitTestMutation,
  TeacherSubmitTestMutationVariables,
  useSubmitResponseMutation,
  useTeacherSubmitTestMutation,
  StudentUpsertSubmissionDraftMutation,
  useStudentUpsertSubmissionDraftMutation,
  StudentUpsertSubmissionDraftMutationVariables,
} from '@lambda-feedback/graphql-api/api/graphql'
import { createContext, useContext } from 'react'

import {
  IModularResponseSchema,
  IResponseAreaSchema,
} from '../../schemas/question-form.schema'
import { PickedDraftFeedback, PickedFeedback } from '../useResponseAreaForm'

export type GetSubmissionPayloadFunction = (
  area:
    | StandardTeacherResponseAreaFragment
    | StandardResponseAreaFragment
    | IResponseAreaSchema,
  answer: IModularResponseSchema['answer'],
  additionalParams?: Record<string, any>,
) => TeacherSubmitTestMutationVariables | SubmitResponseMutationVariables

export type GetSubmissionDraftPayloadFunction = (
  area:
    | StandardTeacherResponseAreaFragment
    | StandardResponseAreaFragment
    | IResponseAreaSchema,
  answer: IModularResponseSchema['answer'],
  additionalParams?: Record<string, any>,
) => StudentUpsertSubmissionDraftMutationVariables | undefined

export type ExtractFeedbackFunction = (
  data?: TeacherSubmitTestMutation | SubmitResponseMutation,
) => PickedFeedback | undefined

export type ExtractDraftFeedbackFunction = (
  data?: StudentUpsertSubmissionDraftMutation,
) => PickedDraftFeedback | undefined

export type SubmissionContextValue = {
  useSubmissionMutation: () => ReturnType<
    typeof useTeacherSubmitTestMutation | typeof useSubmitResponseMutation
  >
  getSubmissionPayload: GetSubmissionPayloadFunction
  extractFeedback: ExtractFeedbackFunction
  useSubmissionDraftMutation: () =>
    | ReturnType<typeof useStudentUpsertSubmissionDraftMutation>
    | undefined
  getSubmissionDraftPayload: GetSubmissionDraftPayloadFunction
  extractDraftFeedback: ExtractDraftFeedbackFunction
  isTeacherMode: boolean
}

export const SubmissionContext = createContext<
  SubmissionContextValue | undefined
>(undefined)

export const useSubmissionContext = () => {
  const submissionContext = useContext(SubmissionContext)

  if (!submissionContext) {
    throw new Error(
      'useSubmissionContext has to be used within <SubmissionContext.Provider>',
    )
  }

  return submissionContext as SubmissionContextValue
}

export const useOptionalSubmissionContext = () => {
  return useContext(SubmissionContext)
}
