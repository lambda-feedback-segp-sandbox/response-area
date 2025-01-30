import { BaseResponseAreaProps } from '@lambda-feedback-segp-sandbox/response-area-base'
import { makeStyles } from '@lambda-feedback-segp-sandbox/styles'
import _ from 'lodash'
import { useCallback, useLayoutEffect, useRef, useState } from 'react'

import { useDeepCompareEffect } from '../../../hooks/useDeepCompareEffect'
import { useViewPort } from '../../../hooks/useViewport'

import {
  IMatrixResponse,
  matrixFromJson,
  padMatrixFromRowsAndCols,
} from './helpers'
import styles from './Matrix.module.css'
import { MatrixConfigSchema } from './Matrix.schema'

const MINIMUM_COLUMN_WIDTH = 5
const BRACKETS_WIDTH = 8

const getValue = (args: {
  row: number
  col: number
  matrix: IMatrixResponse
}) => {
  const { row, col, matrix } = args
  const existingRow = matrix[row] ?? []
  const existingValue = existingRow[col]
  return existingValue
}

interface MatrixProps extends BaseResponseAreaProps {
  config: MatrixConfigSchema
}

export const Matrix: React.FC<MatrixProps> = ({
  handleChange,
  handleSubmit,
  previewSubmit,
  answer,
  preResponseText,
  postResponseText,
  config: { rows, cols },
}) => {
  const matrix = matrixFromJson({
    json: answer,
    rows,
    cols,
  })

  return (
    <MatrixLegacy
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      previewSubmit={previewSubmit}
      rows={rows}
      cols={cols}
      matrix={matrix}
      preResponseText={preResponseText}
      postResponseText={postResponseText}
    />
  )
}

interface MatrixLegacyProps extends BaseResponseAreaProps {
  rows: number
  cols: number
  matrix: IMatrixResponse
}

export const MatrixLegacy: React.FC<MatrixLegacyProps> = ({
  rows,
  cols,
  matrix,
  handleChange,
  handleSubmit,
  previewSubmit,
  preResponseText,
  postResponseText,
}) => {
  const ref = useRef<HTMLDivElement>(null)

  const [availableWidth, setAvailableWidth] = useState(0)

  const availableTableWidth = Math.max(200, availableWidth)

  const { classes, cx } = useStyles()

  const { isMobile, isTablet } = useViewPort()

  const resetTableWidth = useCallback(() => {
    return _.debounce(() => {
      const tableContainerElt = ref.current
      const tableWrapperElt: HTMLElement | null | undefined =
        tableContainerElt?.closest('.reference-response-area-inner-wrapper')
      if (!tableWrapperElt) return

      const preTextContainerElt: HTMLElement | null =
        tableWrapperElt.querySelector('.reference-pretext')
      const postTextContainerElt: HTMLElement | null =
        tableWrapperElt.querySelector('.reference-posttext')
      const preTextNeededWidth = preTextContainerElt?.offsetWidth ?? 0
      const postTextNeededWidth = postTextContainerElt?.offsetWidth ?? 0

      const buttonsContainerElt: HTMLElement | null =
        tableWrapperElt.querySelector('.reference-buttons')
      const buttonsWidth = buttonsContainerElt?.offsetWidth ?? 0

      const checkContainerElt: HTMLElement | null =
        tableWrapperElt.querySelector('.reference-check-container')
      const checkWidth = checkContainerElt?.offsetWidth ?? 0

      const wrapperWidth = tableWrapperElt.offsetWidth

      // columns are spaced by 16px gaps, that are not included in their
      // computed width so we need to calculate the total gaps width manually
      const numberOfSurroundingElements = [
        buttonsWidth,
        checkWidth,
        preTextNeededWidth,
        postTextNeededWidth,
      ].filter(Boolean).length
      const totalGapWidth = 16 * numberOfSurroundingElements

      const surroundingElementsWidth =
        buttonsWidth +
        checkWidth +
        preTextNeededWidth +
        postTextNeededWidth +
        totalGapWidth

      // When the browser window width is a table width or less, than whole container
      // switches to the flex column layout, so the table width does not need to be adjusted
      // by pre-text, post-text or buttons (because these are under the table)
      const tableWidthAdjustments =
        isMobile || isTablet ? 0 : surroundingElementsWidth

      setAvailableWidth(wrapperWidth - tableWidthAdjustments - BRACKETS_WIDTH)
    }, 10)()
  }, [isMobile, isTablet])

  useLayoutEffect(() => {
    function updateSize() {
      resetTableWidth()
    }
    window.addEventListener('resize', updateSize)
    resetTableWidth()
    return () => window.removeEventListener('resize', updateSize)
  }, [resetTableWidth])

  useDeepCompareEffect(
    () => {
      handleChange(padMatrixFromRowsAndCols({ rows, cols, existing: matrix }))
    },
    [rows, cols, matrix],
    { skipInitialEffect: false },
  )

  const submitOnEnter: React.KeyboardEventHandler<HTMLDivElement> = useCallback(
    event => {
      if (event.key !== 'Enter' || !handleSubmit) return
      event.preventDefault()
      return handleSubmit()
    },
    [handleSubmit],
  )

  return (
    <div
      ref={ref}
      className={cx(classes.container, styles.tableStyles)}
      style={{ maxWidth: availableTableWidth }}>
      <table className={classes.matrixElement}>
        <tbody>
          {matrix.map((row, rowIndex) => (
            <tr key={`row-${rowIndex}`}>
              {row.map((item, columnIndex) => {
                return (
                  <td id={`item-${item}`} key={`column-${columnIndex}`}>
                    <input
                      className={classes.input}
                      name={`field-${item}`}
                      value={getValue({
                        row: rowIndex,
                        col: columnIndex,
                        matrix,
                      })}
                      onKeyDown={submitOnEnter}
                      // Update Matrix response on change
                      onChange={event => {
                        event.preventDefault()

                        const newMatrix = _.cloneDeep(matrix)
                        const rowArray = newMatrix[rowIndex]

                        if (!rowArray) {
                          return
                        }

                        rowArray[columnIndex] = event.target.value

                        handleChange(newMatrix)
                        previewSubmit?.(newMatrix)
                      }}
                    />
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
const useStyles = makeStyles()(theme => ({
  container: {
    overflowX: 'auto',
    width: '100%',
    padding: BRACKETS_WIDTH,
  },
  matrixElement: {
    width: '100%',
  },
  input: {
    width: '100%',
    minWidth: theme.spacing(MINIMUM_COLUMN_WIDTH),
    height: theme.spacing(5),
    textAlign: 'center',
  },
}))
