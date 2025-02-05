import { useSubmitResponsePreviewMutation } from '@lambda-feedback/graphql-api/api/graphql'

export const useResponsePreviewSubmission = () => {
  const { isLoading, error, mutate, data } = useSubmitResponsePreviewMutation()

  return {
    mutate,
    isLoading,
    error,
    data,
  }
}
