import {
  BaseResponseAreaProps,
  BaseResponseAreaWizardProps,
  ResponseAreaTub,
} from '@lambda-feedback-segp-sandbox/response-area-base'
import { z } from 'zod'

import { MilkdownInput } from './Milkdown.component'

export const milkdownResponseAnswerSchema = z.string()

export class MilkdownResponseAreaTub extends ResponseAreaTub {
  public readonly responseType = 'MILKDOWN'

  public readonly displayWideInput = true

  public readonly displayAlwaysInColumn = true

  protected answerSchema = milkdownResponseAnswerSchema

  protected answer?: string

  InputComponent = (props: BaseResponseAreaProps) => {
    const parsedAnswer = this.answerSchema.safeParse(props.answer)
    return MilkdownInput({
      ...props,
      answer: parsedAnswer.success ? parsedAnswer.data : undefined,
    })
  }

  WizardComponent = (props: BaseResponseAreaWizardProps) => {
    return MilkdownInput({
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
