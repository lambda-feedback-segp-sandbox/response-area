import { BaseResponseAreaProps } from '../base-props.type'

import styles from './TrueFalse.module.css'

type TrueFalseProps = Omit<BaseResponseAreaProps, 'handleChange' | 'answer'> & {
  handleChange: (val: number) => void
  answer?: boolean
}

// Stateless TrueFalse Response Area
export const TrueFalse: React.FC<TrueFalseProps> = ({
  handleChange,
  answer,
}) => {
  return (
    <form autoComplete="off" onSubmit={e => e.preventDefault()}>
      <ul className={styles.listContainerStyles}>
        <li className={styles.listStyles}>
          <label>
            <input
              defaultChecked={answer === true}
              type="radio"
              onChange={event => {
                // Update ResponseArea state
                handleChange(event.target.value === 'true' ? 1 : 0)
              }}
              value="true"
              name="true-false"
            />
            <span className={styles.optionTextStyle}>True</span>
          </label>
        </li>
        <li className={styles.listStyles}>
          <label>
            <input
              defaultChecked={answer === false}
              type="radio"
              onChange={event => {
                // Update ResponseArea state
                handleChange(event.target.value === 'true' ? 1 : 0)
              }}
              value="false"
              name="true-false"
            />
            <span className={styles.optionTextStyle}>False</span>
          </label>
        </li>
      </ul>
    </form>
  )
}
