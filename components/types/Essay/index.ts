import {
  BaseResponseAreaProps,
  BaseResponseAreaWizardProps,
  ResponseAreaTub,
} from '@lambda-feedback-segp-sandbox/response-area-base'
import { z } from 'zod'

import { EssayInput } from './Essay.component'

export const essayResponseAnswerSchema = z.string()

export class EssayResponseAreaTub extends ResponseAreaTub {
  public readonly responseType = 'ESSAY'

  public readonly displayWideInput = true

  readonly answerSchema = essayResponseAnswerSchema

  protected _answer?: string
  get answer(): string | undefined {
    return this._answer
  }

  InputComponent = (props: BaseResponseAreaProps) => {
    const parsedAnswer = this.answerSchema.safeParse(props.answer)
    return EssayInput({
      ...props,
      answer: parsedAnswer.success ? parsedAnswer.data : undefined,
    })
  }

  WizardComponent = (props: BaseResponseAreaWizardProps) => {
    return EssayInput({
      ...props,
      answer: this.answer,
      handleChange: answer => {
        props.handleChange({
          responseType: this.responseType,
          answer,
        })
      },
    })
  }
}
