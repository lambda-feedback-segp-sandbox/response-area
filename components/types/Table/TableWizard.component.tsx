import { TextInput } from '@lambda-feedback/form-components'
import { BaseResponseAreaWizardProps } from '@lambda-feedback/response-area-base'
import { makeStyles } from '@lambda-feedback/styles'
import { noop } from 'lodash'
import React from 'react'

import { Stylable } from '../../../types/react'
import { IMatrixResponse } from '../Matrix/helpers'

import { Table } from './Table.component'

interface TableWizardProps extends Stylable {
  rows: number
  cols: number
  rowNames: Array<string>
  colNames: Array<string>
  answer: IMatrixResponse
  handleChange: BaseResponseAreaWizardProps['handleChange']
}

export const TableWizard: React.FC<TableWizardProps> = props => {
  const { rows, cols, rowNames, colNames, answer, handleChange } = props
  const { classes } = useStyles()

  return (
    <div className={classes.container}>
      <div className={classes.rowcolContainer}>
        <TextInput
          label={'rows'}
          placeholder={'rows'}
          type={'number'}
          value={rows}
          onChange={event => {
            const newVal = Math.max(Number(event.target.value), 1)
            handleChange({
              responseType: 'TABLE',
              config: {
                rows: newVal,
                cols,
                rowNames,
                colNames,
              },
              answer: answer,
            })
          }}
        />
        <div className={classes.timesSymbol}>X</div>
        <TextInput
          label={'cols'}
          placeholder={'cols'}
          type={'number'}
          value={cols}
          onChange={event => {
            const newVal = Math.max(Number(event.target.value), 1)
            handleChange({
              responseType: 'TABLE',
              config: {
                rows,
                cols: newVal,
                rowNames,
                colNames,
              },
              answer: answer,
            })
          }}
        />
      </div>
      <div className={classes.table}>
        <Table
          previewSubmit={noop}
          namesEditable
          rows={rows}
          cols={cols}
          matrix={answer}
          colNames={colNames}
          rowNames={rowNames}
          handleChange={val => {
            handleChange({
              responseType: 'TABLE',
              config: {
                rows,
                cols,
                rowNames: val.rowNames,
                colNames: val.colNames,
              },
              answer: val.matrix,
            })
          }}
        />
      </div>
    </div>
  )
}

const useStyles = makeStyles()(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  rowcolContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing(3),
  },
  timesSymbol: {
    margin: theme.spacing(0, 2),
  },
  table: {
    width: '100%',
  },
}))
