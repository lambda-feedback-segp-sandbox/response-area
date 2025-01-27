/* eslint-disable @next/next/no-img-element */

import { PreviewFeedback } from '@lambda-feedback-segp-sandbox/graphql-api/api/requests/preview'
import { useGetEquationFromImage } from '../../../../useGetEquationFromImage'
import {
  ResponsePreviewFormParams,
  useResponsePreviewForm,
} from '../../../../useResponsePreviewForm'
import useDebounce from '../../../../../hooks/useDebounce'
import { useViewPort } from '../../../../../hooks/useViewport'
import { Done as DoneIcon } from '@mui/icons-material'
import { OpenInFull as OpenInFullIcon } from '@mui/icons-material'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import Box from '@mui/system/Box'
import useTheme from '@mui/system/useTheme'
import { makeStyles } from '@lambda-feedback-segp-sandbox/styles'
import React, {
  memo,
  StrictMode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useDropzone } from 'react-dropzone'
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { Stylable } from 'types/react'

import { DialogPreview, ExpressionDialog } from '../../dialog'
import { ExpressionMenu } from '../../ExpressionMenu.component'
import { InputMode } from '../types'

import { ScanInlineButtons } from './ScanButtons.component'
import { canvasPreview } from './utils'

interface ScanModeProps extends Stylable {
  setResponse: (answer?: PreviewFeedback) => void
  setPreviewLatex?: (latex: string) => void
  mode: InputMode
  setMode: (mode: InputMode) => void
  responseParams: ResponsePreviewFormParams | null
  disableDraw?: boolean
  allowPreview?: boolean
}

export const ScanMode: React.FC<ScanModeProps> = ({
  setResponse,
  setPreviewLatex,
  mode,
  setMode,
  responseParams,
  disableDraw,
  allowPreview,
  className,
}) => {
  const imageRef = useRef<HTMLImageElement>(null)
  const dialogImageRef = useRef<HTMLImageElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [imageSource, setImageSource] = useState<string>()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [cropHidden, setCropHidden] = useState(true)
  const [currentCrop, setCurrentCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const [inlineCrop, setInlineCrop] = useState<PixelCrop>()
  const [rotate, setRotate] = useState<number>(0)

  const [aspectRatio, setAspectRatio] = useState<number>(1)
  const [cropAspectRatio] = useState<number>()
  const [dataUrl, setDataUrl] = useState<string | undefined>()

  const deboundedDataUrl = useDebounce(dataUrl, 200)

  const [latexString, setLatexString] = useState<string>('')

  const [isHovering, setIsHovering] = useState(false)

  const theme = useTheme()
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'))
  const { isDesktop } = useViewPort()

  const { previewSubmit, feedback } = useResponsePreviewForm(responseParams)
  const { postEquationImage, imageEquation } = useGetEquationFromImage()

  const isMac = navigator.userAgent.toUpperCase().indexOf('MAC') >= 0

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const onSelectFile = (files: File[] | FileList | null) => {
    if (!files || !files[0]) {
      window.alert('No files selected.')
      return
    } else if (files[0].size >= 1e7) {
      window.alert('Files must be less than 10 MB in size.')
      return
    }

    const reader = new FileReader()
    reader.addEventListener('load', () => {
      setImageSource(reader.result?.toString())
      setIsHovering(false)
    })

    reader.readAsDataURL(files[0] as File)
  }

  const parsePicture = useCallback(
    (pixelCrop: PixelCrop | undefined) => {
      if ((imageRef.current || dialogImageRef.current) && canvasRef.current) {
        if (dialogImageRef.current) {
          canvasPreview(
            dialogImageRef.current,
            canvasRef.current,
            rotate,
            pixelCrop,
          )
        } else {
          canvasPreview(imageRef.current!, canvasRef.current, rotate, pixelCrop)
        }
        setDataUrl(canvasRef.current.toDataURL())
      }
    },
    [rotate],
  )

  const handleDone = () => {
    setInlineCrop(completedCrop)
    parsePicture(completedCrop)
    switchCrop()
  }

  const handleDialogDone = () => {
    setInlineCrop(completedCrop)
    parsePicture(completedCrop)
    setDialogOpen(false)
  }

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (!currentCrop) {
      const { width, height } = e.currentTarget
      setAspectRatio(width / height)
      setRotate(0)
      parsePicture(undefined)
    }
  }

  const { getRootProps, getInputProps, open, isDragActive } = useDropzone({
    onDrop: onSelectFile,
  })

  const handleFileClick = (captureMode: string | null) => {
    if (fileInputRef.current) {
      if (captureMode) {
        fileInputRef.current.setAttribute('capture', captureMode)
      } else {
        fileInputRef.current.removeAttribute('capture')
      }
      fileInputRef.current.click() // Trigger the hidden file input on mobile or tablet
    }
  }

  const { classes, cx } = useStyles()

  useEffect(() => {
    if (!!imageSource) {
      setCurrentCrop(undefined)
      setInlineCrop(undefined)
    }
  }, [imageSource])

  useEffect(() => {
    parsePicture(completedCrop)
  }, [completedCrop, parsePicture])

  useEffect(() => {
    if (deboundedDataUrl) {
      postEquationImage(deboundedDataUrl)
    }
  }, [deboundedDataUrl, postEquationImage])

  useEffect(() => {
    const latex = imageEquation?.latex ?? ''
    setLatexString(latex)
    setPreviewLatex?.(latex)
    previewSubmit(latex, { is_latex: true })
  }, [imageEquation, previewSubmit, setPreviewLatex])

  useEffect(() => {
    setResponse(feedback)
  }, [feedback, setResponse])

  const handleClear = () => {
    setImageSource(undefined)
    setLatexString('')
    setResponse(undefined)
    setPreviewLatex?.('')
    setCurrentCrop(undefined)
    setCompletedCrop(undefined)
    setCropHidden(true)
  }

  const switchCrop = () => {
    setCropHidden(!cropHidden)
  }

  const handleOpenDialog = () => {
    if (!cropHidden) {
      switchCrop()
    }
    setDialogOpen(true)
  }

  const handleUndo = () => {
    setCurrentCrop(inlineCrop)
    setCompletedCrop(inlineCrop)
    setDialogOpen(false)
    switchCrop()
  }

  // Copy and paste
  useEffect(() => {
    if (!isHovering) return
    const handlePasteFile = async (event: ClipboardEvent) => {
      if (event.clipboardData?.files && event.clipboardData?.files.length > 0) {
        onSelectFile(event.clipboardData.files)
        setIsHovering(false)
      }
    }
    document.addEventListener('paste', handlePasteFile)
    return () => document?.removeEventListener('paste', handlePasteFile)
  }, [isHovering])

  return (
    <StrictMode>
      <Box className={cx(className, classes.container)}>
        {imageSource ? (
          <Box className={classes.contentWrapper}>
            <Box
              hidden={!cropHidden}
              className={classes.canvasWrapper}
              onMouseEnter={() => setIsHovering(isDesktop)}
              onMouseLeave={() => setIsHovering(false)}>
              <Box
                {...getRootProps({ onClick: e => e.stopPropagation() })}
                className={cx(
                  isHovering
                    ? classes.inputWrapperWithHover
                    : classes.inputWrapper,
                  isDragActive && classes.dropzone,
                )}>
                <Box className={classes.emptyArea}>
                  <canvas ref={canvasRef} className={classes.preview} />
                </Box>
              </Box>
            </Box>

            {
              <Box hidden={cropHidden} className={cx(classes.cropperContainer)}>
                <Box
                  className={classes.innerCropperContainer}
                  sx={{
                    maxWidth:
                      !isMediumScreen && aspectRatio > 1.2
                        ? `${80 * aspectRatio}vh`
                        : undefined,
                  }}>
                  <ReactCrop
                    crop={currentCrop}
                    onChange={(_, percentCrop) => setCurrentCrop(percentCrop)}
                    onComplete={c => {
                      setCompletedCrop(c)
                    }}
                    aspect={cropAspectRatio}>
                    <img
                      className={classes.image}
                      style={{
                        transform: `rotate(${rotate}deg)`,
                      }}
                      alt="Uploaded photo"
                      src={imageSource}
                      ref={imageRef}
                      onLoad={onImageLoad}
                    />
                  </ReactCrop>
                </Box>
              </Box>
            }
            {isHovering && !isDragActive && (
              <Typography className={classes.paste}>
                Press {isMac ? 'Cmd+V' : 'Ctrl+V'}
              </Typography>
            )}
            <IconButton
              sx={theme => ({
                position: 'absolute',
                zIndex: 100,
                top: theme.spacing(1),
                right: theme.spacing(1),
              })}
              size="small"
              onClick={() => handleOpenDialog()}>
              <OpenInFullIcon className={classes.expandIcon} />
            </IconButton>
          </Box>
        ) : (
          <Box
            {...getRootProps({ onClick: e => e.stopPropagation() })}
            className={cx(
              isHovering ? classes.inputWrapperWithHover : classes.inputWrapper,
              isDragActive && classes.dropzone,
            )}
            onMouseEnter={() => setIsHovering(isDesktop)}
            onMouseLeave={() => setIsHovering(false)}>
            {isHovering && !isDragActive && (
              <Typography className={classes.paste}>
                Press {isMac ? 'Cmd+V' : 'Ctrl+V'}
              </Typography>
            )}
            <Box className={classes.emptyArea}>
              {isDesktop ? (
                <Typography className={classes.placeholder} variant="subtitle2">
                  drag here, paste an image or file, or{' '}
                  <span className={classes.clickMe} onClick={open}>
                    select from computer
                  </span>
                </Typography>
              ) : (
                <Typography className={classes.placeholder} variant="subtitle2">
                  <span
                    className={classes.clickMe}
                    onClick={() => handleFileClick('environment')}>
                    take a picture
                  </span>{' '}
                  or{' '}
                  <span
                    className={classes.clickMe}
                    onClick={() => handleFileClick(null)}>
                    select from device
                  </span>
                </Typography>
              )}
            </Box>
            {/* Hidden file input for mobile/tablet to take a photo */}
            <input
              {...getInputProps()}
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment" // Use "user" for front camera or "environment" for back camera
              style={{ display: 'none' }} // Keep it hidden
              onChange={e => onSelectFile(e.target.files)}
            />
          </Box>
        )}
        <ExpressionMenu mode={mode} setMode={setMode} disableDraw={disableDraw}>
          <ScanInlineButtons
            handlePaste={open}
            switchCrop={switchCrop}
            handleClear={handleClear}
            handleUndo={handleUndo}
            handleDone={handleDone}
            canCrop={!!imageSource}
            cropMode={!cropHidden}
            canClear={!!imageSource}
          />
        </ExpressionMenu>
      </Box>
      {cropHidden && (
        <ExpressionDialog
          className={classes.dialog}
          title="Photo Cropper"
          color="info"
          maxWidth={aspectRatio <= 1.2 ? 'md' : 'lg'}
          open={dialogOpen}
          onClose={() => {
            setCurrentCrop(inlineCrop)
            setCompletedCrop(inlineCrop)
            setDialogOpen(false)
          }}>
          <>
            {!!imageSource && (
              <ReactCrop
                crop={currentCrop}
                onChange={(_, percentCrop) => setCurrentCrop(percentCrop)}
                onComplete={c => {
                  setCompletedCrop(c)
                }}
                aspect={cropAspectRatio}>
                <img
                  className={classes.image}
                  style={{
                    transform: `rotate(${rotate}deg)`,
                  }}
                  alt="Uploaded photo"
                  src={imageSource}
                  ref={dialogImageRef}
                  onLoad={onImageLoad}
                />
              </ReactCrop>
            )}
            {allowPreview && (
              <Box className={classes.previewContainer}>
                <DialogPreview
                  className={classes.previewPaper}
                  latex={latexString}
                  feedback={feedback}
                  defaultComment="Crop the image."
                  disable={!!!responseParams}
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
          </>
        </ExpressionDialog>
      )}
    </StrictMode>
  )
}

const useStyles = makeStyles()(theme => ({
  container: {
    borderBottomColor: theme.palette.grey[300],
    borderBottomStyle: 'solid',
    borderBottomWidth: theme.spacing(0.125),
  },
  dialog: {
    '& .MuiPaper-root.MuiDialog-paper': {
      minWidth: '60vw',
      minHeight: '80vh',
      alignItems: 'center',
      backgroundImage:
        'repeating-linear-gradient(-45deg, white 0 5px, lightgrey 5px 7px)',
      [theme.breakpoints.up('md')]: {
        maxInlineSize: 'min-content',
      },
    },
  },
  image: {
    width: '100%',
    background: theme.palette.common.white,
  },
  contentWrapper: {
    position: 'relative',
    width: '100%',
    height: theme.spacing(12),
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
  },
  paste: {
    position: 'absolute',
    left: '10px',
    top: '2px',
    color: theme.palette.primary.light,
    backgroundColor: 'white',
  },
  inputWrapper: {
    position: 'relative',
    width: '100%',
    height: theme.spacing(12),
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
  },
  inputWrapperWithHover: {
    position: 'relative',
    width: '100%',
    height: theme.spacing(12),
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    ':hover': {
      borderColor: theme.palette.primary.light,
      borderWidth: theme.spacing(0.25),
      borderTopLeftRadius: theme.spacing(0.5),
      borderTopRightRadius: theme.spacing(0.5),
      borderStyle: 'dashed',
    },
  },
  dropzone: {
    padding: theme.spacing(0.75),
    borderColor: theme.palette.primary.light,
    borderWidth: theme.spacing(0.25),
    borderTopLeftRadius: theme.spacing(0.5),
    borderTopRightRadius: theme.spacing(0.5),
    borderStyle: 'dashed',
  },
  response: {
    display: 'inline-flex',
    alignItems: 'center',
  },
  preview: {
    objectFit: 'contain',
    width: 'inherit',
    height: 'inherit',
  },
  canvasWrapper: {
    position: 'relative',
    width: '100%',
    height: theme.spacing(12),
    overflow: 'hidden',
    alignItems: 'center',
  },
  cropperContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
    padding: theme.spacing(2, 0),
    overflow: 'scroll',
    backgroundImage:
      'repeating-linear-gradient(-45deg, white 0 5px, lightgrey 5px 7px)',
  },
  outerCropperContainer: {
    overflow: 'scroll',
    padding: theme.spacing(2, 0),
  },
  innerCropperContainer: {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyArea: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  openButton: {
    padding: theme.spacing(2, 3),
    margin: theme.spacing(1),
  },
  previewContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    position: 'absolute',
    right: theme.spacing(2),
    bottom: theme.spacing(2),
  },
  previewPaper: {
    width: 'fit-content',
    height: 'fit-content',
    minWidth: theme.spacing(25),
    minHeight: theme.spacing(7),
  },
  doneButton: {
    minWidth: theme.spacing(1),
    maxWidth: theme.spacing(11),
    alignSelf: 'stretch',
  },
  buttonsContainer: {
    display: 'flex',
    marginRight: theme.spacing(2),
  },
  selectButton: {
    color: theme.palette.common.white,
  },
  expandButton: {
    position: 'absolute',
    top: theme.spacing(1),
    right: theme.spacing(1),
  },
  expandIcon: {
    height: theme.spacing(2),
    width: theme.spacing(2),
  },
  placeholder: {
    fontSize: 15,
    fontFamily: 'monospace',
    color: theme.palette.grey['400'],
  },
  clickMe: {
    color: theme.palette.primary.main,
    cursor: 'pointer',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
}))

export const MemoisedScanMode = memo(ScanMode)
