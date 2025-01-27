import _ from 'lodash'

export const padAnswersFromOptions = (args: {
  options: Array<string>
  answers?: Array<boolean>
}) => {
  const { options, answers = [] } = args
  const paddedAnswers = _.fill<boolean>(Array(options.length), false)

  for (const [index, answer] of answers.entries()) {
    paddedAnswers[index] = answer
  }
  return paddedAnswers
}
