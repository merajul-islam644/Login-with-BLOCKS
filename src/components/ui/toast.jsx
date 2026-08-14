"use client"

import { Toaster as SonnerToaster, toast } from "sonner"

function ToastProvider({ children }) {
  return (
    <>
      {children}
      <SonnerToaster position="bottom-right" richColors closeButton />
    </>
  )
}

export { ToastProvider, toast }
