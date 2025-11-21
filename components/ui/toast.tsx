"use client"

import { cn } from "@/lib/utils"
import { X } from "lucide-react"
import * as React from "react"

import { ToastAction } from "./toast-action"

export interface ToastProps {
  id?: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
}

export const Toast = React.forwardRef<
  HTMLDivElement,
  ToastProps
>(({ title, description, action, className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "bg-white border shadow-lg rounded-md p-4 flex flex-col gap-2 max-w-xs",
      className
    )}
    {...props}
  >
    <div className="font-semibold">{title}</div>
    {description && <div className="text-sm text-gray-600">{description}</div>}
    {action}
  </div>
))
Toast.displayName = "Toast"
