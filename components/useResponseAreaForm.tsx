import {
  StandardResponseAreaFragment,
  StandardSubmissionFragment,
  StandardSubmissionDraftFragment,
  StandardTeacherResponseAreaFragment,
} from '@lambda-feedback-segp-sandbox/graphql-api/api/graphql'
import { useCallback, useState } from 'react'

import {
  IModularResponseSchema,
  IResponseAreaSchema,
  responseAreaAnswerSchema,
} from '../schemas/question-form.schema'

import { useSubmissionContext } from './Set/Submission.context'

type UseResponseAreaProps = {
  area:
    | StandardTeacherResponseAreaFragment
    | StandardResponseAreaFragment
    | IResponseAreaSchema
  onChange?: (
    answer?: IModularResponseSchema['answer'],
    additionalParams?: Record<string, any>,
  ) => void
  inititialAnswer?: IModularResponseSchema['answer']
  inititialFeedback?: PickedFeedback
}

type AnswerAndParams = {
  answer?: IModularResponseSchema['answer']
  additionalParams?: Record<string, any>
}

export type PickedFeedback = Pick<
  StandardSubmissionFragment,
  'isCorrect' | 'isError' | 'feedback' | 'matchedCase'
> | null

export type PickedDraftFeedback = Pick<
  StandardSubmissionDraftFragment,
  'isCorrect' | 'isError' | 'feedback' | 'matchedCase'
> | null

export const useResponseAreaForm = ({
  area,
  onChange,
  inititialAnswer,
  inititialFeedback,
}: UseResponseAreaProps) => {
  const {
    useSubmissionMutation,
    getSubmissionPayload,
    useSubmissionDraftMutation,
    getSubmissionDraftPayload,
    extractFeedback,
    extractDraftFeedback,
    isTeacherMode,
  } = useSubmissionContext()

  const {
    mutate,
    data,
    error: requestError,
    isLoading: inFlight,
  } = useSubmissionMutation()

  // checking if mutation is undefined (for teachers), as no save functionalities are needed
  const submissionDraftMutation = useSubmissionDraftMutation()
  const mutateSubmissionDraft = submissionDraftMutation?.mutate
  const dataDraft = submissionDraftMutation?.data

  const [showFeedback, setShowFeedback] = useState(!!inititialFeedback)

  const [validationMessage, setValidationMessage] = useState<
    string | undefined
  >()

  const [answerAndParams, setAnswerAndParams] = useState<AnswerAndParams>({
    answer: inititialAnswer,
  })

  const [buttonHandleCase, setButtonHandleCase] = useState<boolean | undefined>(
    undefined,
  ) // true is for check, false is for draft save

  const handleChange = useCallback(
    (answer?: IModularResponseSchema['answer'], additionalParams?: object) => {
      setAnswerAndParams({
        answer,
        additionalParams,
      })
      onChange?.(answer, additionalParams)
    },
    [onChange, setAnswerAndParams],
  )

  const handleCheck = useCallback(() => {
    const submissionInput = answerAndParams?.answer

    if (
      submissionInput === undefined ||
      submissionInput === null ||
      submissionInput === ''
    ) {
      setValidationMessage('Required')
      return
    }

    const validationResult = responseAreaAnswerSchema.safeParse(submissionInput)

    if (!validationResult.success) {
      const formatted = validationResult.error.format()
      setValidationMessage(formatted._errors[0])
      return
    }

    setValidationMessage(undefined)
    setShowFeedback(true)

    mutate(
      // @ts-expect-error
      // At this point we know that both the mutate and payload come from the
      // same submission provider so they are compatible. However Typescript
      // isn't able to infer this and I know know how to fis it simply.
      getSubmissionPayload(
        area,
        submissionInput,
        answerAndParams?.additionalParams,
      ),
    )

    setButtonHandleCase(true)
  }, [mutate, answerAndParams, area, getSubmissionPayload])

  const handleDraftSave = useCallback(() => {
    const draftInput = answerAndParams?.answer

    if (draftInput === undefined || draftInput === null || draftInput === '') {
      setValidationMessage('Required')
      return
    }

    const validationResult = responseAreaAnswerSchema.safeParse(draftInput)

    if (!validationResult.success) {
      const formatted = validationResult.error.format()
      setValidationMessage(formatted._errors[0])
      return
    }

    setValidationMessage(undefined)
    setShowFeedback(true)

    const draftPayload = getSubmissionDraftPayload(
      area,
      draftInput,
      answerAndParams?.additionalParams,
    )

    if (draftPayload && mutateSubmissionDraft) {
      mutateSubmissionDraft(draftPayload)
    }

    setButtonHandleCase(false)
  }, [mutateSubmissionDraft, area, answerAndParams, getSubmissionDraftPayload])

  const feedback: PickedFeedback | PickedDraftFeedback | undefined =
    buttonHandleCase ? extractFeedback(data) : extractDraftFeedback(dataDraft)

  return {
    inputDisplayValue: answerAndParams.answer,
    handleChange,
    handleCheck,
    handleDraftSave,
    inFlight,
    feedback: showFeedback ? feedback || inititialFeedback : undefined,
    validationMessage,
    requestError,
    isTeacherMode,
  }
}
