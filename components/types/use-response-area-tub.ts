import { RefObject, useRef } from 'react'

import usePrevious from '../../hooks/usePrevious'

import { ResponseAreaTub } from './response-area-tub'

import { createReponseAreaTub } from '.'

// returns a ref to an instance of a ResponseAreaTub. The instance is kept as
// a ref to avoid re-mounting components unnecessarily. The instance is
// re-created if the type changes.
export const useResponseAreaTub = (
  type?: string,
): RefObject<ResponseAreaTub | undefined> => {
  const prevType = usePrevious(type)
  const tubRef = useRef<ResponseAreaTub>()

  if (!type) return tubRef

  if (!tubRef.current || prevType !== type) {
    tubRef.current = createReponseAreaTub(type)
  }

  return tubRef
}
