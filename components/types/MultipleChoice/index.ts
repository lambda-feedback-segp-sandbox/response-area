import {
  BaseResponseAreaProps,
  BaseResponseAreaWizardProps,
  ResponseAreaTub,
} from '@lambda-feedback-segp-sandbox/response-area-base'

import { padAnswersFromOptions } from './helpers'
import { MultipleChoice } from './MultipleChoice.component'
import {
  MultipleChoiceAnswerSchema,
  multipleChoiceAnswerSchema,
  MultipleChoiceConfigSchema,
  multipleChoiceConfigSchema,
} from './MultipleChoice.schema'
import { MultipleChoiceWizard } from './MultipleChoiceWizard.component'

export { MultipleChoice } from './MultipleChoice.component'

export class MultipleChoiceResponseAreaTub extends ResponseAreaTub {
  public readonly responseType = 'MULTIPLE_CHOICE'

  readonly configSchema = multipleChoiceConfigSchema

  protected _config?: MultipleChoiceConfigSchema
  get config(): MultipleChoiceConfigSchema | undefined {
    return this._config
  }

  readonly answerSchema = multipleChoiceAnswerSchema

  protected _answer?: MultipleChoiceAnswerSchema
  get answer(): MultipleChoiceAnswerSchema | undefined {
    return this._answer
  }

  initWithDefault = () => {
    this._config = {
      options: ['Option One', 'Option Two'],
      randomise: false,
      single: false,
    }
    this._answer = padAnswersFromOptions({
      options: this.config?.options ?? [],
    })
  }

  InputComponent = (props: BaseResponseAreaProps) => {
    if (!this.config) throw new Error('Config missing')
    const config = this.config
    const parsedAnswer = this.answerSchema.safeParse(props.answer)

    return MultipleChoice({
      handleChange: answer => {
        props.handleChange(
          padAnswersFromOptions({
            options: config.options,
            answers: answer,
          }),
        )
      },
      single: this.config.single,
      options: this.config.options,
      randomise: this.config.randomise,
      answers: padAnswersFromOptions({
        options: this.config.options,
        answers: parsedAnswer.success ? parsedAnswer.data : undefined,
      }),
    })
  }

  WizardComponent = (props: BaseResponseAreaWizardProps) => {
    if (!this.config) throw new Error('Config missing')
    if (this.answer === undefined) throw new Error('Answer missing')

    return MultipleChoiceWizard({
      options: this.config.options,
      answers: this.answer,
      randomise: this.config.randomise,
      single: this.config.single,
      onChange: args => {
        props.handleChange({
          responseType: this.responseType,
          config: {
            options: args.options,
            randomise: args.randomise,
            single: args.single,
          },
          answer: args.answers,
        })
      },
    })
  }
}
