import {
  BaseResponseAreaProps,
  BaseResponseAreaWizardProps,
  ResponseAreaTub,
} from '@lambda-feedback-segp-sandbox/response-area-base'
import { z } from 'zod'

import { CodeInput } from './Code.component'
import { CodeInputWizzard } from './CodeWizzard.component'

export const codeResponseAnswerSchema = z.string()

export const codeConfigSchema = z.object({
  language: z.string().default('python'),
})

export type CodeConfigSchema = z.infer<typeof codeConfigSchema>

export class CodeResponseAreaTub extends ResponseAreaTub {
  public readonly responseType = 'CODE'

  public readonly displayWideInput = true

  readonly answerSchema = codeResponseAnswerSchema

  protected answer?: string

  readonly configSchema = codeConfigSchema

  protected _config?: z.infer<typeof codeConfigSchema>
  get config(): z.infer<typeof codeConfigSchema> | undefined {
    return this._config
  }

  initWithDefault = () => {
    this._config = {
      language: 'python',
    }
  }

  InputComponent = (props: BaseResponseAreaProps) => {
    const parsedAnswer = this.answerSchema.safeParse(props.answer)
    if (!this.config) throw new Error('Config missing')

    return CodeInput({
      ...props,
      answer: parsedAnswer.success ? parsedAnswer.data : undefined,
      config: this.config,
    })
  }

  WizardComponent = (props: BaseResponseAreaWizardProps) => {
    if (!this.config) throw new Error('Config missing')

    return CodeInputWizzard({
      ...props,
      answer: this.answer,
      handleChange: (answer, config) => {
        props.handleChange({
          responseType: this.responseType,
          answer,
          config,
        })
      },
      config: this.config,
    })
  }
}
