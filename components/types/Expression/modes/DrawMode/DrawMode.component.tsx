import { PreviewFeedback } from '@lambda-feedback-segp-sandbox/graphql-api/api/requests/preview'
import { makeStyles } from '@lambda-feedback-segp-sandbox/styles'
import {
  Done as DoneIcon,
  OpenInFull as OpenInFullIcon,
} from '@mui/icons-material'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box from '@mui/system/Box'
import { memo, RefObject, StrictMode, useEffect, useRef, useState } from 'react'
import {
  Point,
  ReactSketchCanvas,
  ReactSketchCanvasRef,
} from 'react-sketch-canvas'

import { Stylable } from '../../../../../types/react'
import { useGetEquationFromImage } from '../../../../useGetEquationFromImage'
import {
  ResponsePreviewFormParams,
  useResponsePreviewForm,
} from '../../../../useResponsePreviewForm'
import { DialogPreview, DialogToolbar } from '../../dialog'
import { ExpressionDialog } from '../../dialog/ExpressionDialog.component'
import { ExpressionMenu } from '../../ExpressionMenu.component'
import { InputMode } from '../types'

import { DrawDialogButtons, DrawInlineButtons } from './DrawButtons.component'
import {
  getInlineOffsetAndScale,
  transformStrokes,
  unTransformStrokes,
} from './utils'

const PENCIL = ['input', 'erase'] as const
export type PencilState = (typeof PENCIL)[number]

export interface DrawModeProps extends Stylable {
  setResponse: (answer?: PreviewFeedback) => void
  setPreviewLatex?: (latex: string) => void
  mode: InputMode
  setMode: (mode: InputMode) => void
  responseParams: ResponsePreviewFormParams | null
  disableScan?: boolean
  allowPreview?: boolean
}

export const DrawMode: React.FC<DrawModeProps> = props => {
  const {
    setResponse,
    setPreviewLatex,
    mode,
    setMode,
    responseParams,
    disableScan,
    allowPreview,
    className,
  } = props
  const { classes, cx } = useStyles()
  const [dialogOpen, setDialogOpen] = useState(false)

  const inlineCanvasRef = useRef<ReactSketchCanvasRef>(null)
  const inlineCanvasContainerRef = useRef<HTMLDivElement>(null)
  const expandedCanvasRef = useRef<ReactSketchCanvasRef>(null)

  const [pencilState, setPencilState] = useState<PencilState>('input')
  const [latexString, setLatexString] = useState<string>('')

  const [inlineScale, setInlineScale] = useState<number>(1)
  const [inlineOffset, setInlineOffset] = useState<Point>()

  const [inlineOpsCounter, setInlineOpsCounter] = useState<number>(0)
  const [inlineUndoCounter, setInlineUndoCounter] = useState<number>(0)

  const [expandedOpsCounter, setExpandedOpsCounter] = useState<number>(0)
  const [expandedUndoCounter, setExpandedUndoCounter] = useState<number>(0)

  const { previewSubmit, feedback } = useResponsePreviewForm(responseParams)
  const { postEquationImage, imageEquation } = useGetEquationFromImage()

  useEffect(() => {
    if (!imageEquation) {
      return
    }

    const latex = imageEquation?.latex ?? ''

    setLatexString(latex)
    setPreviewLatex?.(latex)
    previewSubmit(latex, { is_latex: true })
  }, [imageEquation, previewSubmit, setPreviewLatex])

  useEffect(() => {
    setResponse(feedback)
  }, [feedback, setResponse])

  const updatePreview = async (ref: RefObject<ReactSketchCanvasRef>) => {
    if (ref.current) {
      const dataUrl = await ref.current?.exportImage('png')
      postEquationImage(dataUrl)
    }
  }

  const handleOpenDialog = async () => {
    expandedCanvasRef.current?.resetCanvas()
    setDialogOpen(true)

    if (!inlineCanvasRef.current) {
      return
    }

    const strokes = await inlineCanvasRef.current.exportPaths()
    const transformedStrokes = unTransformStrokes(
      strokes,
      inlineScale,
      inlineOffset,
    )

    expandedCanvasRef.current?.loadPaths(transformedStrokes)

    setExpandedOpsCounter(inlineOpsCounter)
    setExpandedUndoCounter(inlineUndoCounter)
  }

  const handleDialogDone = async () => {
    inlineCanvasRef.current?.resetCanvas()
    setDialogOpen(false)

    if (!expandedCanvasRef.current || !inlineCanvasContainerRef.current) {
      return
    }

    const strokes = await expandedCanvasRef.current.exportPaths()
    const { offsetWidth, offsetHeight } = inlineCanvasContainerRef.current

    const { offset, scale } = getInlineOffsetAndScale(
      strokes,
      offsetWidth,
      offsetHeight,
    )

    const transformedStrokes = transformStrokes(strokes, scale, offset)
    inlineCanvasRef.current?.loadPaths(transformedStrokes)

    setInlineOffset(offset)
    setInlineScale(scale)
    setInlineOpsCounter(expandedOpsCounter)
    setInlineUndoCounter(expandedUndoCounter)
  }

  const handleClear = () => {
    setLatexString('')
    setResponse(undefined)
    setPreviewLatex?.('')

    setInlineOffset(undefined)
    setInlineScale(1)
  }

  return (
    <StrictMode>
      <ExpressionDialog
        className={classes.dialog}
        title="Handwriting Canvas"
        maxWidth="lg"
        color="info"
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onDone={handleDialogDone}>
        <Box className={classes.fullScreenContainer}>
          <DialogToolbar>
            <DrawDialogButtons
              pencilState={pencilState}
              setPencilState={setPencilState}
              handleUndo={() => {
                setExpandedOpsCounter(prev => prev - 1)
                setExpandedUndoCounter(prev => prev + 1)

                expandedCanvasRef.current?.undo()
                setTimeout(() => updatePreview(expandedCanvasRef), 100)
              }}
              handleRedo={() => {
                setExpandedOpsCounter(prev => prev + 1)
                setExpandedUndoCounter(prev => prev - 1)

                expandedCanvasRef.current?.redo()
                setTimeout(() => updatePreview(expandedCanvasRef), 100)
              }}
              handleClear={() => {
                expandedCanvasRef.current?.resetCanvas()
                handleClear()

                setExpandedOpsCounter(0)
                setExpandedUndoCounter(0)
              }}
              canUndo={expandedOpsCounter > 0}
              canRedo={expandedUndoCounter > 0}
              canClear={expandedOpsCounter > 0 || expandedUndoCounter > 0}
            />
          </DialogToolbar>
          <ReactSketchCanvas
            ref={expandedCanvasRef}
            className={classes.canvas}
            style={{ border: 'none' }}
            strokeWidth={pencilState === 'input' ? 5 : 20}
            strokeColor={pencilState === 'input' ? 'black' : 'white'}
            onStroke={async () => {
              const strokes =
                (await expandedCanvasRef.current?.exportPaths()) ?? []

              setExpandedOpsCounter(strokes.length)
              updatePreview(expandedCanvasRef)
            }}
          />
          {allowPreview && (
            <Box className={classes.previewContainer}>
              <DialogPreview
                className={classes.previewPaper}
                latex={latexString}
                feedback={feedback}
                defaultComment="Draw your expression."
                disable={!responseParams}
              />
              <Button
                className={classes.doneButton}
                variant={'contained'}
                title="Done"
                onClick={handleDialogDone}>
                <div>
                  <DoneIcon />
                  <br />
                  <br />
                  <Typography>PROCEED</Typography>
                </div>
              </Button>
            </Box>
          )}
        </Box>
      </ExpressionDialog>
      <Box className={cx(className, classes.container)}>
        <Box className={classes.inputWrapper}>
          <Box
            className={classes.inlineCanvasContainer}
            ref={inlineCanvasContainerRef}>
            <ReactSketchCanvas
              ref={inlineCanvasRef}
              className={classes.canvas}
              style={{ border: 'none' }}
              strokeWidth={(pencilState === 'input' ? 5 : 20) * inlineScale}
              strokeColor={pencilState === 'input' ? 'black' : 'white'}
              onStroke={async () => {
                const strokes =
                  (await inlineCanvasRef.current?.exportPaths()) ?? []

                setInlineOpsCounter(strokes.length)
                updatePreview(inlineCanvasRef)
              }}
            />
          </Box>
          <IconButton
            sx={theme => ({
              position: 'absolute',
              zIndex: 5,
              top: theme.spacing(1),
              right: theme.spacing(1),
            })}
            size="small"
            onClick={handleOpenDialog}>
            <OpenInFullIcon className={classes.expandIcon} />
          </IconButton>
        </Box>
        <ExpressionMenu mode={mode} setMode={setMode} disableScan={disableScan}>
          <DrawInlineButtons
            pencilState={pencilState}
            setPencilState={setPencilState}
            handleUndo={() => {
              setInlineOpsCounter(prev => prev - 1)
              setInlineUndoCounter(prev => prev + 1)

              inlineCanvasRef.current?.undo()
              setTimeout(() => updatePreview(inlineCanvasRef), 100)
            }}
            handleRedo={() => {
              setInlineOpsCounter(prev => prev + 1)
              setInlineUndoCounter(prev => prev - 1)

              inlineCanvasRef.current?.redo()
              setTimeout(() => updatePreview(inlineCanvasRef), 100)
            }}
            handleClear={() => {
              inlineCanvasRef.current?.resetCanvas()
              handleClear()

              setInlineOpsCounter(0)
              setInlineUndoCounter(0)
            }}
            canUndo={inlineOpsCounter > 0}
            canRedo={inlineUndoCounter > 0}
            canClear={inlineOpsCounter > 0 || inlineUndoCounter > 0}
          />
        </ExpressionMenu>
      </Box>
    </StrictMode>
  )
}

const useStyles = makeStyles()(theme => ({
  container: {
    borderBottomColor: theme.palette.grey[300],
    borderBottomStyle: 'solid',
    borderBottomWidth: theme.spacing(0.125),
  },
  inputWrapper: {
    position: 'relative',
    height: theme.spacing(12),
    overflow: 'hidden',
  },
  dialog: {
    '& .MuiPaper-root.MuiDialog-paper': {
      width: '100%',
      height: '100%',
    },
  },
  fullScreenContainer: {
    width: '100%',
    height: '100%',
    overflow: 'clip',
  },
  previewPaper: {
    width: 'fit-content',
    height: 'fit-content',
    minWidth: theme.spacing(25),
    minHeight: theme.spacing(7),
  },
  prePostResponseText: {
    whiteSpace: 'nowrap',
    position: 'absolute',
    transform: 'translateY(-50%)',
    pointerEvents: 'none',
    top: '50%',
    margin: 0,
  },
  expandButton: {
    '&.MuiButton-root': {
      position: 'absolute',
      zIndex: 5,
      top: theme.spacing(1),
      right: theme.spacing(1),
    },
  },
  expandIcon: {
    height: theme.spacing(2),
    width: theme.spacing(2),
  },
  preResponseText: {
    left: theme.spacing(2),
  },
  postResponseText: {
    right: theme.spacing(4),
  },
  canvas: {
    cursor: 'crosshair',
  },
  inlineCanvasContainer: {
    height: '100%',
  },
  previewContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    position: 'absolute',
    right: theme.spacing(2),
    bottom: theme.spacing(2),
  },
  doneButton: {
    minWidth: theme.spacing(1),
    maxWidth: theme.spacing(11),
    alignSelf: 'stretch',
  },
}))

export const MemoisedDrawMode = memo(DrawMode)
