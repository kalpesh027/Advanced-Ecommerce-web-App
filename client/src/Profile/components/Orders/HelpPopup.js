import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import * as Select from '@radix-ui/react-select'
import { ArrowLeft, ChevronDownIcon } from 'lucide-react'

const initialHelpItems = [
  { id: "payment-failed", question: "My payment failed", answer: "If your payment failed, please try again or use a different payment method. If the issue persists, contact your bank or our customer support." },
  { id: "refund-issue", question: "My amount is not refunded", answer: "Refunds typically take 5-10 business days to process. If it's been longer, please contact our support team with your order details." },
  { id: "multiple-charge", question: "My card is charged multiple times for the same order", answer: "This is unusual. Please check your bank statement and contact our support immediately with your order number and transaction details." },
  { id: "other", question: "My query is not listed here", answer: "" },
]

export default function HelpPopup({ onClose, orderNumber }) {
  const [helpItems, setHelpItems] = useState(initialHelpItems)
  const [selectedIssue, setSelectedIssue] = useState(null)
  const [customQuery, setCustomQuery] = useState('')
  const [portalElement, setPortalElement] = useState(null)

  useEffect(() => {
    const element = document.createElement('div')
    document.body.appendChild(element)
    setPortalElement(element)

    return () => {
      document.body.removeChild(element)
    }
  }, [])

  const handleIssueSelect = (value) => {
    setSelectedIssue(value)
  }

  const handleCustomQuerySubmit = () => {
    if (customQuery.trim()) {
      const newIssue = {
        id: `custom-${Date.now()}`, // Generate a unique ID for the custom issue
        question: customQuery,
        answer: "We are trying to solve your query."
      }
      setHelpItems([...helpItems, newIssue])
      setCustomQuery('') // Clear the input after submission
      setSelectedIssue(null) // Reset selection to show the list again
    }
  }

  const handleClose = () => {
    setSelectedIssue(null)
    setCustomQuery('')
    onClose()
  }

  const selectedItem = helpItems.find(item => item.id === selectedIssue)

  const content = (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Need Help?</h2>
          <div className="text-sm font-medium text-gray-500">
            Order ID: <span className="text-primary">{orderNumber}</span>
          </div>
        </div>
        
        {!selectedIssue ? (
          <>
            <p className="mb-4 text-sm text-gray-600">Choose an issue type</p>
            <Select.Root onValueChange={handleIssueSelect}>
              <Select.Trigger className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md flex justify-between items-center">
                <Select.Value placeholder="Select Issue" />
                <Select.Icon>
                  <ChevronDownIcon className="w-4 h-4" />
                </Select.Icon>
              </Select.Trigger>
              <Select.Content className="bg-white shadow-lg rounded-lg p-2">
                {helpItems.map(item => (
                  <Select.Item key={item.id} value={item.id} className="p-2 cursor-pointer hover:bg-gray-200">
                    {item.question}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </>
        ) : (
          <div className="mb-4">
            <button 
              className="flex items-center text-primary hover:text-primary-dark mb-2"
              onClick={() => setSelectedIssue(null)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </button>
            {selectedIssue === 'other' ? (
              <>
                <h3 className="font-semibold mb-2">Please describe your issue</h3>
                <textarea 
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Enter your query here"
                  value={customQuery}
                  onChange={(e) => setCustomQuery(e.target.value)}
                />
                <button
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md"
                  onClick={handleCustomQuerySubmit}
                >
                  Submit
                </button>
              </>
            ) : (
              <>
                <h3 className="font-semibold mb-2">{selectedItem?.question}</h3>
                <p className="text-sm text-gray-600">{selectedItem?.id === 'other' ? "We are trying to solve your query." : selectedItem?.answer}</p>
              </>
            )}
          </div>
        )}
        
        <div className="flex justify-end mt-6">
          <button 
            className="px-4 py-2 bg-orange-500 border text-white rounded-md text-sm font-medium hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            onClick={handleClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )

  return portalElement ? createPortal(content, portalElement) : null
}
