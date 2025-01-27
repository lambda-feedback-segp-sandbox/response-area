import { Text } from '@lambda-feedback-segp-sandbox/math-components'
import { useDeepCompareEffect } from '@hooks/useDeepCompareEffect'
import { useViewPort } from '../../../hooks/useViewport'
import { makeStyles } from '@lambda-feedback-segp-sandbox/styles'
import _ from 'lodash'
import { useCallback, useLayoutEffect, useRef, useState } from 'react'

import { BaseResponseAreaProps } from '../base-props.type'
import { IMatrixResponse, padMatrixFromRowsAndCols } from '../Matrix/helpers'

import styles from './Table.module.css'

const MINIMUM_COLUMN_WIDTH = 5

const setupKeys = (args: {
  rows: number
  cols: number
  existingMatrix?: IMatrixResponse
  existingRowNames?: Array<string>
  existingColNames?: Array<string>
}) => {
  const {
    rows,
    cols,
    existingMatrix = [],
    existingRowNames = [],
    existingColNames = [],
  } = args
  const matrix = padMatrixFromRowsAndCols({
    rows,
    cols,
    existing: existingMatrix,
  })

  const colNames = _.assign(
    _.fill(new Array(cols), ''),
    existingColNames.slice(0, cols),
  )
  const rowNames = _.assign(
    _.fill(new Array(cols), ''),
    existingRowNames.slice(0, rows),
  )

  return { matrix, colNames, rowNames }
}

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

type TableProps = Omit<BaseResponseAreaProps, 'handleChange'> & {
  colNames: Array<string>
  rowNames: Array<string>
  rows: number
  cols: number
  namesEditable?: boolean
  matrix: IMatrixResponse
  handleChange: (args: {
    matrix: IMatrixResponse
    rowNames: Array<string>
    colNames: Array<string>
  }) => void
  previewSubmit?: (
    submission: IMatrixResponse,
    additionalParams?: Record<string, any>,
  ) => void
}

export const Table: React.FC<TableProps> = ({
  colNames,
  rowNames,
  rows,
  cols,
  matrix,
  namesEditable,
  handleChange,
  handleSubmit,
  previewSubmit,
}) => {
  const ref = useRef<HTMLDivElement>(null)

  const containsRowNames = rowNames.filter(Boolean).length > 0

  const [availableWidth, setAvailableWidth] = useState(0)

  const availableTableWidth = Math.max(200, availableWidth)

  const { classes } = useStyles()

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

      setAvailableWidth(wrapperWidth - tableWidthAdjustments)
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
      handleChange(
        setupKeys({
          rows,
          cols,
          existingMatrix: matrix,
          existingRowNames: rowNames,
          existingColNames: colNames,
        }),
      )
    },
    [rows, cols, setupKeys, matrix, rowNames, colNames],
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
      className={classes.tableContainer}
      style={{ maxWidth: availableTableWidth }}>
      <table className={classes.tableElement}>
        <thead className={styles.colNames}>
          <tr>
            <th />
            {colNames.map((colName, colIndex) => (
              <th key={`colName-${colIndex}`}>
                {namesEditable ? (
                  <input
                    className={classes.columnNameInput}
                    placeholder={'Col Name'}
                    value={colNames[colIndex]}
                    onChange={event => {
                      const newColNames = [...colNames]
                      newColNames[colIndex] = event.target.value
                      return handleChange({
                        matrix,
                        rowNames,
                        colNames: newColNames,
                      })
                    }}
                  />
                ) : (
                  <Text data={colName} className={classes.columnName} />
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {matrix.map((row, rowIndex) => {
            const rowName = rowNames?.[rowIndex]
            return (
              <tr key={`row-${rowIndex}`}>
                <th scope={'row'} className={styles.rowNames}>
                  {namesEditable ? (
                    <input
                      className={classes.rowNameInput}
                      placeholder={'Row Name'}
                      value={rowNames[rowIndex]}
                      onChange={event => {
                        const newRowNames = [...rowNames]
                        newRowNames[rowIndex] = event.target.value
                        return handleChange({
                          matrix,
                          rowNames: newRowNames,
                          colNames,
                        })
                      }}
                    />
                  ) : (
                    containsRowNames && (
                      <Text data={rowName} className={classes.rowName} />
                    )
                  )}
                </th>
                {row.map((item, columnIndex) => {
                  return (
                    <td id={`item-${item}`} key={`col-${columnIndex}`}>
                      <input
                        className={classes.input}
                        onKeyDown={submitOnEnter}
                        defaultValue={getValue({
                          row: rowIndex,
                          col: columnIndex,
                          matrix,
                        })}
                        name={`field-${item}`}
                        // Update Table response on change
                        onChange={event => {
                          event.preventDefault()

                          const newMatrix = _.cloneDeep(matrix)
                          const rowArray = newMatrix[rowIndex]

                          if (!rowArray) {
                            return
                          }

                          rowArray[columnIndex] = event.target.value

                          handleChange({
                            matrix: newMatrix,
                            rowNames,
                            colNames,
                          })
                          previewSubmit?.(newMatrix)
                        }}
                      />
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

const useStyles = makeStyles()(theme => ({
  tableContainer: {
    overflowX: 'auto',
    width: '100%',
  },
  tableElement: {
    width: '100%',
  },
  columnNameInput: {
    height: theme.spacing(5),
    textAlign: 'center',
    width: '100%',
    minWidth: theme.spacing(MINIMUM_COLUMN_WIDTH),
  },
  columnName: {
    fontWeight: 500,
    margin: theme.spacing(0.5, 1),
  },
  rowNameInput: {
    height: theme.spacing(5),
    textAlign: 'center',
    width: '100%',
    minWidth: theme.spacing(MINIMUM_COLUMN_WIDTH),
  },
  rowName: {
    fontWeight: 500,
    margin: theme.spacing(0.5, 0),
    paddingRight: theme.spacing(1),
    width: '100%',
    minWidth: theme.spacing(MINIMUM_COLUMN_WIDTH),
  },
  input: {
    height: theme.spacing(5),
    textAlign: 'center',
    border: `1px solid ${theme.palette.grey[300]}`,
    width: '100%',
    minWidth: theme.spacing(MINIMUM_COLUMN_WIDTH),
  },
}))
