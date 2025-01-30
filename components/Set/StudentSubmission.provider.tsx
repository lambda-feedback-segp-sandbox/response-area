import {
  useGetSetQuery,
  useSubmitResponseMutation,
  useStudentUpsertSubmissionDraftMutation,
} from '@lambda-feedback-segp-sandbox/graphql-api'
import _ from 'lodash'
import { useQueryClient } from 'react-query'

import {
  ExtractFeedbackFunction,
  ExtractDraftFeedbackFunction,
  GetSubmissionPayloadFunction,
  GetSubmissionDraftPayloadFunction,
  SubmissionContext,
} from './Submission.context'

type StudentSubmissionProviderProps = React.PropsWithChildren<{
  setId: string
}>

export const StudentSubmissionProvider: React.FC<
  StudentSubmissionProviderProps
> = ({ setId, children }) => {
  const getSubmissionPayload: GetSubmissionPayloadFunction = (
    area,
    answer,
    additionalParams,
  ) => {
    // the StudentSubmissionProvider can only be used on the student side with
    // a `StandardResponseAreaFragment`. However the provider accepts all types
    // of area so it's compatibly with TeacherSubmutationProvider, so we enforce
    // type by chekcing the properties of the area
    if ('evaluationFunction' in area) {
      throw new Error(
        'StudentSubmissionProvider can only be used with `StandardResponseAreaFragment` but `StandardTeacherResponseAreaFragment` was provided',
      )
    }

    if ('evaluationFunctionName' in area) {
      throw new Error(
        'StudentSubmissionProvider can only be used with `StandardResponseAreaFragment` but `IResponseAreaSchema` was provided',
      )
    }

    return {
      submission: answer,
      additionalParams: additionalParams,
      responseAreaId: area.id,
      universalResponseAreaId: area.universalResponseAreaId,
    }
  }

  const getSubmissionDraftPayload: GetSubmissionDraftPayloadFunction = (
    area,
    answer,
    additionalParams,
  ) => {
    if ('evaluationFunction' in area) {
      throw new Error(
        'StudentSubmissionProvider can only be used with `StandardResponseAreaFragment` but `StandardTeacherResponseAreaFragment` was provided',
      )
    }

    if ('evaluationFunctionName' in area) {
      throw new Error(
        'StudentSubmissionProvider can only be used with `StandardResponseAreaFragment` but `IResponseAreaSchema` was provided',
      )
    }

    return {
      input: {
        universalResponseAreaId: area.universalResponseAreaId,
        snapshot: answer,
      },
    }
  }

  const extractFeedback: ExtractFeedbackFunction = data => {
    if (data === undefined) return undefined

    if ('teacher_submitTest' in data) {
      throw new Error(
        'StudentSubmissionProvider can only be used in student submission context',
      )
    }

    return data?.submitResponse
  }

  const extractDraftFeedback: ExtractDraftFeedbackFunction = data => {
    if (data === undefined) return undefined

    if ('teacher_submitTest' in data) {
      throw new Error(
        'StudentSubmissionProvider can only be used in student submission context',
      )
    }

    return data?.upsertSubmissionDraft
  }

  return (
    <SubmissionContext.Provider
      value={{
        useSubmissionMutation: () =>
          useWrappedSubmitResponseMutation({ setId }),
        getSubmissionPayload,
        useSubmissionDraftMutation: () =>
          useWrappedSubmitDraftResponseMutation({ setId }),
        getSubmissionDraftPayload,
        extractFeedback,
        extractDraftFeedback,
        isTeacherMode: false,
      }}>
      {children}
    </SubmissionContext.Provider>
  )
}

export const useWrappedSubmitResponseMutation = (params: { setId: string }) => {
  const queryClient = useQueryClient()

  return useSubmitResponseMutation({
    onSettled: () => {
      queryClient.invalidateQueries({
        predicate: query => {
          const [key, vars] = useGetSetQuery.getKey({ id: params.setId })
          const isSetQuery =
            query.queryKey[0] === key && _.isEqual(vars, query.queryKey[1])

          return isSetQuery
        },
        exact: false,
      })
    },
  })
}

export const useWrappedSubmitDraftResponseMutation = (params: {
  setId: string
}) => {
  const queryClient = useQueryClient()

  return useStudentUpsertSubmissionDraftMutation({
    onSettled: () => {
      queryClient.invalidateQueries({
        predicate: query => {
          const [key, vars] = useGetSetQuery.getKey({ id: params.setId })
          const isSetQuery =
            query.queryKey[0] === key && _.isEqual(vars, query.queryKey[1])

          return isSetQuery
        },
        exact: false,
      })
    },
  })
}
