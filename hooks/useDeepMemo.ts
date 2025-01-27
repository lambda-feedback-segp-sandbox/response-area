import _ from 'lodash'
import { useRef } from 'react'

export const useDeepMemo = <T extends any>(
  callback: () => T,
  deps: Array<unknown>,
): T => {
  const prevDeps = useRef(deps)
  const prevValue = useRef<T>()

  if (_.isEqual(prevDeps.current, deps)) {
    return prevValue.current ?? callback()
  }

  prevDeps.current = deps
  prevValue.current = callback()
  return prevValue.current
}
