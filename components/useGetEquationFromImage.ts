import { useGetEquationFromImageMutation } from '@lambda-feedback-segp-sandbox/graphql-api/api/graphql'
import { useCallback } from 'react'

export const useGetEquationFromImage = () => {
  const { mutate, data, isLoading } = useGetEquationFromImageMutation()

  const postEquationImage = useCallback(
    (dataUrl: string) => {
      mutate({
        dataUrl,
      })
    },
    [mutate],
  )

  return {
    postEquationImage,
    imageEquation: data?.getEquationFromImage,
    isLoading,
  }
}
