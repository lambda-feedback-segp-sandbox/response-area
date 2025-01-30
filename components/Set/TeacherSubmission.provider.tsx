import { useTeacherSubmitTestMutation } from '@lambda-feedback-segp-sandbox/graphql-api'
import { useCallback } from 'react'

import { getJsonOrEmptyObj } from '../../utils/json'

import {
  ExtractFeedbackFunction,
  GetSubmissionPayloadFunction,
  GetSubmissionDraftPayloadFunction,
  ExtractDraftFeedbackFunction,
  SubmissionContext,
} from './Submission.context'

type TeacherSubmissionProviderProps = React.PropsWithChildren<{}>

export const TeacherSubmissionProvider: React.FC<
  TeacherSubmissionProviderProps
> = ({ children }) => {
  const getSubmissionPayload: GetSubmissionPayloadFunction = useCallback(
    (area, answer, additionalParams) => {
      // the TeacherSubmissionProvider can only be used on the teacher side with
      // a `StandardTeacherResponseAreaFragment` or `IResponseAreaSchema`.
      // However the provider also accepts `StandardResponseAreaFragment` areas
      // so it's compatibly with StudentSubmutationProvider, so ere we check the
      // types by chekcing the properties of the area
      if ('evaluationFunction' in area) {
        return {
          input: {
            evaluationFunctionName: area.evaluationFunction.name,
            gradeParams: {
              ...getJsonOrEmptyObj(area.gradeParams),
              ...getJsonOrEmptyObj(additionalParams),
            },
            answer: area.response?.answer ?? null,
            submission: answer,
            inputSymbols: area.inputSymbols,
            cases: area.cases.map(raCase => ({
              answer: raCase.answer ?? null,
              feedback: raCase.feedback,
              mark: +raCase.isCorrect,
              color: raCase.color,
              params: getJsonOrEmptyObj(raCase.params),
            })),
            separateFeedback: area.separateFeedback,
            commonFeedbackColor: area.commonFeedbackColor,
            correctFeedbackColor: area.correctFeedbackColor,
            correctFeedbackPrefix: area.correctFeedbackPrefix,
            incorrectFeedbackColor: area.incorrectFeedbackColor,
            incorrectFeedbackPrefix: area.incorrectFeedbackPrefix,
          },
        }
      } else if ('evaluationFunctionName' in area) {
        return {
          input: {
            evaluationFunctionName: area.evaluationFunctionName,
            gradeParams: {
              ...getJsonOrEmptyObj(area.gradeParams),
              ...getJsonOrEmptyObj(additionalParams),
            },
            answer: area.response?.answer ?? null,
            submission: answer,
            inputSymbols: area.inputSymbols || [],
            cases: area.cases.map(raCase => ({
              answer: raCase.answer ?? null,
              feedback: raCase.feedback,
              mark: +raCase.isCorrect,
              color: raCase.color,
              params: getJsonOrEmptyObj(raCase.params),
            })),
            separateFeedback: area.separateFeedback,
            commonFeedbackColor: area.commonFeedbackColor,
            correctFeedbackColor: area.correctFeedbackColor,
            correctFeedbackPrefix: area.correctFeedbackPrefix,
            incorrectFeedbackColor: area.incorrectFeedbackColor,
            incorrectFeedbackPrefix: area.incorrectFeedbackPrefix,
          },
        }
      } else {
        throw new Error(
          'TeacherSubmissionProvider can only be used with `StandardTeacherResponseAreaFragment` or `IResponseAreaSchema`',
        )
      }
    },
    [],
  )

  const extractFeedback: ExtractFeedbackFunction = data => {
    if (data === undefined) return undefined

    if ('submitResponse' in data) {
      throw new Error(
        'TeacherSubmissionProvider can only be used in teacher submission context',
      )
    }

    return data?.teacher_submitTest
  }

  const getSubmissionDraftPayload: GetSubmissionDraftPayloadFunction =
    useCallback((area, answer, additionalParams) => {
      return undefined
    }, [])

  const extractDraftFeedback: ExtractDraftFeedbackFunction = data => {
    return undefined
  }

  return (
    <SubmissionContext.Provider
      value={{
        useSubmissionMutation: useTeacherSubmitTestMutation,
        getSubmissionPayload,
        useSubmissionDraftMutation: () => undefined,
        getSubmissionDraftPayload,
        extractFeedback,
        extractDraftFeedback,
        isTeacherMode: true,
      }}>
      {children}
    </SubmissionContext.Provider>
  )
}
