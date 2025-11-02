import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { UploadArea } from '@/components/upload/upload-area'

describe('UploadArea', () => {
  describe('rendering', () => {
    it('should render title and description', () => {
      render(<UploadArea onUploadClick={vi.fn()} />)

      expect(screen.getByText('Video Highlight Tool')).toBeInTheDocument()
      expect(screen.getByText('Upload your video to generate AI-powered highlights')).toBeInTheDocument()
    })

    it('should not show upload button when no file is selected', () => {
      render(<UploadArea onUploadClick={vi.fn()} />)

      expect(screen.queryByText('Process Video')).not.toBeInTheDocument()
    })

    it('should have accessible structure', () => {
      render(<UploadArea onUploadClick={vi.fn()} />)

      // Should have heading
      expect(screen.getByRole('heading', { name: 'Video Highlight Tool' })).toBeInTheDocument()

      // Upload button should not be visible without a file
      expect(screen.queryByRole('button', { name: /process video/i })).not.toBeInTheDocument()
    })
  })

  // Note: File selection, upload, and error handling tests are not included here
  // because they require testing the Dropzone component which is a complex UI component
  // with file upload interactions. The upload button and loading state logic is tested
  // in integration tests and manual testing.
})
