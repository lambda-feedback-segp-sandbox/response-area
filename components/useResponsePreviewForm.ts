import { processPreviewResult } from '@lambda-feedback-segp-sandbox/graphql-api/api/requests/preview'
import { useCallback, useMemo } from 'react'

import { useResponsePreviewSubmission } from './useResponsePreviewSubmission'

export interface ResponsePreviewFormParams {
  responseAreaId: string
  universalResponseAreaId: string
}

// TODO: a lot of this form logic should be handled by react-hook-forms
export const useResponsePreviewForm = (
  params: ResponsePreviewFormParams | null,
) => {
  const { mutate, data, isLoading, error } = useResponsePreviewSubmission()

  // TODO: remove this once the preview type can be fully inferred from the
  // graphql mutation result
  const preview = useMemo(() => {
    if (!data) return
    return processPreviewResult(data.submitResponsePreview.rawResult)
  }, [data])

  const previewSubmit = useCallback(
    (
      submission: string | number | boolean | object | null,
      additionalParams?: Record<string, any>,
    ) => {
      if (params?.responseAreaId) {
        mutate({
          responseAreaId: params.responseAreaId,
          submission,
          additionalParams: additionalParams ?? null,
          universalResponseAreaId: params.universalResponseAreaId,
        })
      }
    },
    [mutate, params?.responseAreaId, params?.universalResponseAreaId],
  )

  return {
    previewSubmit,
    feedback: preview,
    error,
    isLoading,
  }
}
