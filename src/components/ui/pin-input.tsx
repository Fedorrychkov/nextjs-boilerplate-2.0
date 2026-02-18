'use client'

import { PinInput } from '@ark-ui/react/pin-input'

import { cn } from '~/utils/cn'

type Props = {
  classNames?: {
    container?: string
    internalContainer?: string
    root?: string
    label?: string
    input?: string
    control?: string
    hiddenInput?: string
  }
  value?: string[]
  disabled?: boolean
  onChange?: (value: string[]) => void
  onValueComplete?: (e: { valueAsString: string }) => void
  label?: string
  size?: number
}

export const PinInputElement = (props: Props) => {
  const { classNames, value, onChange, label, size, disabled } = props

  return (
    <div className={cn('flex items-center justify-center min-h-32', classNames?.container)}>
      <div className={cn('w-80', classNames?.internalContainer)}>
        <PinInput.Root
          mask
          value={value}
          onValueChange={(e) => onChange?.(e.value)}
          className={cn('w-full flex flex-col gap-2 items-center', classNames?.root)}
        >
          {label && (
            <PinInput.Label className={cn('text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block', classNames?.label)}>{label}</PinInput.Label>
          )}
          <PinInput.Control className={cn('flex gap-2', classNames?.control)}>
            {[...Array(size)].map((id, index) => (
              <PinInput.Input
                key={[id, index, label].join('-')}
                index={index}
                disabled={disabled}
                maxLength={1}
                className={cn(
                  'w-12 h-12 text-center text-lg font-medium border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50 focus:border-blue-500 dark:focus:border-blue-400 transition-all',
                  classNames?.input,
                )}
              />
            ))}
          </PinInput.Control>
          <PinInput.HiddenInput />
        </PinInput.Root>
      </div>
    </div>
  )
}
