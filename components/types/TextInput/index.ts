import {
  BaseResponseAreaProps,
  BaseResponseAreaWizardProps,
  ResponseAreaTub,
} from '@lambda-feedback-segp-sandbox/response-area-base'

import { TextInput } from './TextInput.component'
import { textResponseAnswerSchema } from './TextInput.schema'

export class TextResponseAreaTub extends ResponseAreaTub {
  public readonly responseType = 'TEXT'

  public readonly canToggleLatexInStats = true

  protected answerSchema = textResponseAnswerSchema

  protected answer?: string

  InputComponent = (props: BaseResponseAreaProps) => {
    const parsedAnswer = this.answerSchema.safeParse(props.answer)
    return TextInput({
      ...props,
      answer: parsedAnswer.success ? parsedAnswer.data : undefined,
    })
  }

  WizardComponent = (props: BaseResponseAreaWizardProps) => {
    return TextInput({
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
