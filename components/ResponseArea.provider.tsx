import {
  StandardResponseAreaFragment,
  StandardTeacherResponseAreaFragment,
} from '@lambda-feedback-segp-sandbox/graphql-api/api/graphql'
import { InputSymbolForDisplay } from './InputSymbols'
import { useDeepMemo } from '../hooks/useDeepMemo'
import {
  IModularResponseSchema,
  IResponseAreaSchema,
} from '../schemas/question-form.schema'

import {
  ResponseAreaContext,
  ResponseAreaContextValue,
} from './ResponseArea.context'
import { PickedFeedback, useResponseAreaForm } from './useResponseAreaForm'

export type ResponseAreaDisplayMode = 'normal' | 'peek'

type ResponseAreaProviderProps = React.PropsWithChildren<{
  area:
    | StandardResponseAreaFragment
    | StandardTeacherResponseAreaFragment
    | IResponseAreaSchema
  onChange?: (
    answer?: IModularResponseSchema['answer'],
    additionalParams?: Record<string, any>,
  ) => void
  inititialAnswer?: IModularResponseSchema['answer']
  inititialFeedback?: PickedFeedback

  displayMode?: ResponseAreaDisplayMode
  hideCheck?: boolean
  hideSave?: boolean
}>

export const ResponseAreaProvider: React.FC<ResponseAreaProviderProps> = ({
  area,
  onChange,
  inititialAnswer,
  inititialFeedback,
  displayMode,
  hideCheck,
  hideSave,
  children,
}) => {
  const {
    inFlight,
    handleChange,
    handleCheck,
    handleDraftSave,
    inputDisplayValue,
    feedback,
    validationMessage,
    requestError,
    isTeacherMode,
  } = useResponseAreaForm({
    area,
    onChange,
    inititialAnswer,
    inititialFeedback,
  })

  const returnValues: ResponseAreaContextValue = useDeepMemo(() => {
    const safeSymbols:
      | (InputSymbolForDisplay & { isVisible: boolean })[]
      | undefined = area.inputSymbols

    const visibleSymbols: InputSymbolForDisplay[] = safeSymbols
      ? safeSymbols.filter(symbol => symbol.isVisible)
      : []

    return {
      responseAreaId: 'id' in area ? area.id : undefined,
      universalResponseAreaId: area.universalResponseAreaId,
      inputType: area.response?.responseType!,
      response: area.response ?? undefined,
      visibleSymbols,
      preResponseText: area.preResponseText ?? undefined,
      postResponseText: area.postResponseText ?? undefined,
      displayInputSymbols:
        'displayInputSymbols' in area
          ? area.displayInputSymbols
          : area.displaySymbols,
      showLivePreview: area.livePreview,

      inputDisplayValue,
      handleChange,
      handleCheck,
      handleDraftSave,
      inFlight,
      feedback,
      validationMessage,
      requestError,

      displayMode,
      isTeacherMode,
      hideCheck,
      hideSave,
    }
  }, [
    area,
    feedback,
    handleChange,
    handleCheck,
    handleDraftSave,
    inFlight,
    inputDisplayValue,
    requestError,
    validationMessage,
    hideCheck,
    hideSave,
  ])

  return (
    <ResponseAreaContext.Provider value={returnValues}>
      {children}
    </ResponseAreaContext.Provider>
  )
}
