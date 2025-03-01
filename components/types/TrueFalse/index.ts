import {
  BaseResponseAreaProps,
  BaseResponseAreaWizardProps,
  ResponseAreaTub,
} from '@lambda-feedback-segp-sandbox/response-area-base'

import { IModularResponseSchema } from '../../../schemas/question-form.schema'

import { TrueFalse } from './TrueFalse.component'
import { trueFalseAnswerSchema } from './TrueFalse.schema'

export class TrueFalseResponseAreaTub extends ResponseAreaTub {
  public readonly responseType = 'BOOLEAN'

  readonly answerSchema = trueFalseAnswerSchema

  protected answer?: boolean

  toResponse = (): IModularResponseSchema => {
    if (this.answer === undefined) throw new Error('Answer missing')

    return {
      responseType: this.responseType,
      answer: this.getSerialAnswer(),
    }
  }

  InputComponent = (props: BaseResponseAreaProps) => {
    const parsedAnswer = this.answerSchema.safeParse(props.answer)
    return TrueFalse({
      ...props,
      answer: parsedAnswer.success ? parsedAnswer.data : undefined,
    })
  }

  WizardComponent = (props: BaseResponseAreaWizardProps) => {
    return TrueFalse({
      ...props,
      answer: this.answer,
      handleChange: val => {
        props.handleChange({
          responseType: this.responseType,
          answer: val,
        })
      },
    })
  }

  private getSerialAnswer = (): number => {
    return Number(this.answer ?? 0)
  }
}
