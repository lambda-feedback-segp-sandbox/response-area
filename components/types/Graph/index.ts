import {
  BaseResponseAreaProps,
  BaseResponseAreaWizardProps,
  ResponseAreaTub,
} from '@lambda-feedback/response-area-base'

import { Graph } from './Graph.component'
import {
  GraphAnswerSchema,
  graphAnswerSchema,
  GraphConfigSchema,
  graphConfigSchema,
} from './Graph.schema'
import { GraphWizard } from './GraphWizard.component'

export { Graph } from './Graph.component'

export class GraphResponseAreaTub extends ResponseAreaTub {
  public readonly responseType = 'GRAPH'

  protected configSchema = graphConfigSchema

  protected config?: GraphConfigSchema

  protected answerSchema = graphAnswerSchema

  protected answer?: GraphAnswerSchema

  initWithDefault = () => {
    this.config = {
      lowestX: -5,
      highestX: 5,
      lowestY: -5,
      highestY: 5,
      xScale: 1,
      yScale: 1,
      studentAxis: false,
    }
    this.answer = 'x'
  }

  InputComponent = (props: BaseResponseAreaProps) => {
    if (!this.config) throw new Error('Config missing')
    const parsedAnswer = this.answerSchema.safeParse(props.answer)

    return Graph({
      ...this.config,
      ...props,
      answer: parsedAnswer.success ? parsedAnswer.data : undefined,
    })
  }

  WizardComponent = (props: BaseResponseAreaWizardProps) => {
    if (!this.config) throw new Error('Config missing')
    if (this.answer === undefined) throw new Error('Answer missing')

    return GraphWizard({
      answer: this.answer,
      ...this.config,
      setAllowSave: props.setAllowSave,
      onChange: args => {
        props.handleChange({
          responseType: this.responseType,
          config: {
            lowestX: args.lowestX,
            highestX: args.highestX,
            lowestY: args.lowestY,
            highestY: args.highestY,
            xScale: args.xScale,
            yScale: args.yScale,
            studentAxis: args.studentAxis,
          },
          answer: args.answer,
        })
      },
    })
  }
}
