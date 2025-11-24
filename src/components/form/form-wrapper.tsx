"use client"

import * as React from "react"
import { MultiStepForm } from "./multi-step-form"

interface FormWrapperProps {
  isOpen: boolean
  onClose: () => void
}

export function FormWrapper({ isOpen, onClose }: FormWrapperProps) {
  return (
    <>
      <MultiStepForm
        isOpen={isOpen}
        onClose={onClose}
      />
    </>
  )
}

