import { z } from 'zod'

import {
  BaseResponseAreaProps,
  BaseResponseAreaWizardProps,
} from '../base-props.type'
import { ResponseAreaTub } from '../response-area-tub'

import { EssayInput } from './Essay.component'

export const essayResponseAnswerSchema = z.string()

export class EssayResponseAreaTub extends ResponseAreaTub {
  public readonly responseType = 'ESSAY'

  public readonly displayWideInput = true

  protected answerSchema = essayResponseAnswerSchema

  protected answer?: string

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
