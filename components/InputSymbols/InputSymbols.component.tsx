import { Text } from '@lambda-feedback/math-components'
import { makeStyles } from '@lambda-feedback/styles'
import React from 'react'

import { Stylable } from '../../types/react'

export type InputSymbolForDisplay = {
  symbol: string
  code?: string | null
}

interface InputSymbolsProps extends Stylable {
  symbols: InputSymbolForDisplay[]
}

export const InputSymbols: React.FC<InputSymbolsProps> = props => {
  const { className, symbols } = props
  const { classes, cx } = useStyles()

  if (symbols.length === 0) {
    return null
  }

  return (
    <div className={cx(classes.container, className)}>
      <div className={classes.innerContainer}>
        <table className={classes.table}>
          <tbody>
            <tr className={classes.row}>
              <td className={classes.cell}>Symbol</td>
              {symbols.map((symbol, i) => (
                <td key={i} className={cx(classes.cell, classes.key)}>
                  {<Text className={classes.latex} data={symbol.symbol} />}
                </td>
              ))}
            </tr>
            <tr className={cx(classes.cell, classes.title)}>
              <td className={cx(classes.cell, classes.title)}>Code</td>
              {symbols.map((symbol, i) => (
                <td key={i} className={cx(classes.cell, classes.key)}>
                  {symbol.code}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

const useStyles = makeStyles()(theme => ({
  container: {
    display: 'flex',
  },
  innerContainer: {
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: theme.palette.grey[200],
    borderRadius: theme.spacing(2),
  },
  table: {
    borderCollapse: 'collapse',
  },
  row: {
    ':first-of-type': {
      borderBottomWidth: 2,
      borderBottomStyle: 'solid',
      borderBottomColor: theme.palette.grey[200],
    },
  },
  dataRow: {
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: theme.palette.grey[200],
  },
  cell: {
    flex: 1,
    padding: theme.spacing(1.5),
    color: theme.palette.common.black,
    ':first-of-type': {
      borderRightWidth: 2,
      borderRightStyle: 'solid',
      borderRightColor: theme.palette.grey[200],
    },
  },
  title: {
    fontWeight: 500,
  },
  key: {
    fontFamily: 'Courier New',
  },
  latex: {
    margin: 0,
    textAlign: 'center',
  },
}))
