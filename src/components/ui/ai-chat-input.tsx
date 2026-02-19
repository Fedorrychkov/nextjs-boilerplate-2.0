'use client'

import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { ArrowUp, Paperclip } from 'lucide-react'
import * as React from 'react'

import { cn } from '~/utils/cn'
import { logger } from '~/utils/logger'

// import { FileUploader } from '../File'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow hover:bg-primary/90 disabled:bg-gray-300 disabled:text-white-200',
        destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        outline: 'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button'

  return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
})
Button.displayName = 'Button'

interface PromptInputProps {
  placeholder?: string
  onSubmit?: (value: string, files?: File[]) => void
  onChange?: (value: string) => void
  disabled?: boolean
  className?: string
}

const PromptInput = React.forwardRef<HTMLDivElement, PromptInputProps>(
  ({ placeholder = 'Type your message...', onSubmit, onChange, disabled = false, className }, ref) => {
    const [value, setValue] = React.useState('')
    const [files, setFiles] = React.useState<File[] | undefined>()
    const inputRef = React.useRef<HTMLInputElement>(null)

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()

      if ((value.trim() || files?.length) && onSubmit) {
        onSubmit(value?.trim?.() ?? '', files ?? undefined)
        setValue('')
        setFiles(undefined)
      }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      setValue(newValue)

      if (onChange) {
        onChange(newValue)
      }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()

        if ((value.trim() || files?.length) && onSubmit) {
          onSubmit(value?.trim?.() ?? '', files ?? undefined)
          setValue('')
          setFiles(undefined)
        }
      }
    }

    const handleSetFiles = React.useCallback((files: File[]) => {
      setFiles(files)
    }, [])

    return (
      <div
        ref={ref}
        className={cn(
          'flex w-full max-w-2xl mx-auto items-center gap-2 rounded-lg border border-input bg-background px-3 py-2 shadow-sm focus-within:border-primary focus-within:ring-1 focus-within:ring-primary',
          className,
        )}
      >
        {/* <FileUploader files={files} handleSetFiles={handleSetFiles}>
          {(props) => (
            <>
              {!props?.hasUploadedFiles && (
                <>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={disabled}
                    className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <Paperclip size={16} />
                    <span className="sr-only">Загрузить файл</span>
                  </Button>
                  <input {...props?.inputProps} />
                </>
              )}
            </>
          )}
        </FileUploader> */}
        <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          />
          <Button type="submit" size="icon" disabled={disabled || (!value.trim() && !files?.length)} className="h-7 w-7 shrink-0 cursor-pointer">
            <ArrowUp size={16} />
            <span className="sr-only">Отправить сообщение</span>
          </Button>
        </form>
      </div>
    )
  },
)
PromptInput.displayName = 'PromptInput'

type Props = {
  disabled?: boolean
  placeholder?: string
  onSubmit?: (message: string, files?: File[]) => void
}

export const ChatInput = (props: Props) => {
  const { disabled, placeholder, onSubmit } = props

  const handleSubmit = (value: string, files?: File[]) => {
    logger.debug('Submitted:', value)
    onSubmit?.(value, files)
  }

  const handleChange = (value: string) => {
    logger.debug('Changed:', value)
  }

  return (
    <div className="flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-4">
        <PromptInput disabled={disabled} placeholder={placeholder} onSubmit={handleSubmit} onChange={handleChange} />
      </div>
    </div>
  )
}
