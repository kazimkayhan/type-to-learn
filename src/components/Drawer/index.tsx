import { Sheet, SheetContent } from '@/components/ui/sheet'
import classNames from 'classnames'

export type Placement = 'left' | 'top' | 'right' | 'bottom'

interface DrawerProps {
  open?: boolean
  placement?: Placement
  onClose?: () => void
  children?: React.ReactNode
  classNames?: string
}

export default function Drawer(props: DrawerProps) {
  const { open = false, placement = 'left', onClose, children } = props

  const sideMap: Record<Placement, 'left' | 'right' | 'top' | 'bottom'> = {
    left: 'left',
    right: 'right',
    top: 'top',
    bottom: 'bottom',
  }

  return (
    <Sheet open={open} onOpenChange={(open) => !open && onClose?.()}>
      <SheetContent
        side={sideMap[placement]}
        className={classNames(props.classNames || '', 'flex h-full w-full max-w-full flex-col sm:w-[35rem]')}
      >
        {children}
      </SheetContent>
    </Sheet>
  )
}
