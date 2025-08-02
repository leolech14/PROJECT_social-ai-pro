import React from 'react'

export default function ErrorNotification({ message, onClose }) {
  if (!message) return null
  return (
    <div
      role="alert"
      className="bg-red-100 text-red-800 p-4 rounded mb-4 flex justify-between items-start"
      data-testid="error-notification"
    >
      <span>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          aria-label="Close"
          className="ml-4 text-red-800"
        >
          ×
        </button>
      )}
    </div>
  )
}
