import {
  BaseResponseAreaProps,
  BaseResponseAreaWizardProps,
  ResponseAreaTub,
} from '@lambda-feedback-segp-sandbox/response-area-base'

import { NumberInput } from './NumberInput.component'
import { numberResponseAnswerSchema } from './NumberInput.schema'

export class NumberResponseAreaTub extends ResponseAreaTub {
  public readonly responseType = 'NUMBER'

  public readonly delegateErrorMessage = false

  readonly answerSchema = numberResponseAnswerSchema

  protected _answer?: number | null
  get answer(): number | null | undefined {
    return this._answer
  }

  InputComponent = (props: BaseResponseAreaProps) => {
    const parsedAnswer = this.answerSchema.safeParse(props.answer)
    return NumberInput({
      ...props,
      answer: parsedAnswer.success ? parsedAnswer.data : undefined,
    })
  }

  WizardComponent = (props: BaseResponseAreaWizardProps) => {
    return NumberInput({
      ...props,
      handleChange: answer => {
        props.handleChange({
          responseType: this.responseType,
          answer,
        })
      },
      answer: this.answer,
    })
  }
}
