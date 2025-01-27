import useMediaQuery from '@mui/material/useMediaQuery'
import useTheme from '@mui/system/useTheme'

export const useViewPort = () => {
  const theme = useTheme()

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'), { noSsr: true })
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'), {
    noSsr: true,
  })
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'), { noSsr: true })

  return { isMobile, isTablet, isDesktop }
}
