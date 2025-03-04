import {
  BaseResponseAreaProps,
  BaseResponseAreaWizardProps,
  ResponseAreaTub,
} from '@lambda-feedback-segp-sandbox/response-area-base'

import { ResponsePreviewFormParams } from '../../useResponsePreviewForm'

import { ExpressionInput } from './Expression.component'
import {
  ExpressionAnswerSchema,
  expressionAnswerSchema,
  ExpressionConfigSchema,
  expressionConfigSchema,
} from './Expression.schema'
import { ExpressionWizard } from './ExpressionWizard.component'

export { ExpressionInput } from './Expression.component'

export class ExpressionResponseAreaTub extends ResponseAreaTub {
  public readonly responseType = 'EXPRESSION'

  public readonly canToggleLatexInStats = true

  public readonly delegatePreResponseText = false

  public readonly delegatePostResponseText = false

  public readonly delegateLivePreview = false

  public readonly delegateFeedback = false

  public readonly delegateCheck = false

  public readonly delegateErrorMessage = false

  public readonly displayInFlexContainer = false

  readonly configSchema = expressionConfigSchema

  protected _config?: ExpressionConfigSchema
  get config(): ExpressionConfigSchema | undefined {
    return this._config
  }

  readonly answerSchema = expressionAnswerSchema

  protected _answer?: ExpressionAnswerSchema
  get answer(): ExpressionAnswerSchema | undefined {
    return this._answer
  }

  initWithDefault = () => {
    this._config = {
      allowHandwrite: true,
      allowPhoto: true,
    }
    this._answer = ''
  }

  InputComponent = (props: BaseResponseAreaProps) => {
    if (!this.config) throw new Error('Config missing')
    const parsedAnswer = this.answerSchema.safeParse(props.answer)

    let responseParams: ResponsePreviewFormParams | undefined = undefined
    if (props.responseAreaId && props.universalResponseAreaId) {
      responseParams = {
        responseAreaId: props.responseAreaId,
        universalResponseAreaId: props.universalResponseAreaId,
      }
    }

    return ExpressionInput({
      answer: parsedAnswer.success ? parsedAnswer.data : undefined,

      allowDraw: this.config.allowHandwrite,
      allowScan: this.config.allowPhoto,
      allowPreview: props.hasPreview ?? false,
      isTeacherMode: props.isTeacherMode,

      preResponseText: props.preResponseText,
      postResponseText: props.postResponseText,
      checkIsLoading: props.checkIsLoading,
      feedback: props.feedback,
      typesafeErrorMessage: props.typesafeErrorMessage,
      showFeedbackContainer: props.displayMode !== 'peek',

      handleChange: props.handleChange,
      handleSubmit: props.handleSubmit,

      responseParams,
    })
  }

  WizardComponent = (props: BaseResponseAreaWizardProps) => {
    if (!this.config) throw new Error('Config missing')
    if (this.answer === undefined) throw new Error('Answer missing')

    return ExpressionWizard({
      answer: this.answer,
      ...this.config,
      onChange: args => {
        props.handleChange({
          responseType: this.responseType,
          config: {
            allowHandwrite: args.allowHandwrite,
            allowPhoto: args.allowPhoto,
          },
          answer: args.answer,
        })
      },
    })
  }
}
