import React, { useState, useCallback, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ScrapeForm } from './ScrapeForm'

const ScraperControl = () => {
  const [status, setStatus] = useState('idle')
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState(null)
  const [logs, setLogs] = useState([])

  const addLog = useCallback((message) => {
    setLogs(prev => [...prev, message])
  }, [])

  const handleSubmit = useCallback(async (config) => {
    setStatus('running')
    setProgress(0)
    setResult(null)
    setLogs([])

    addLog('Starting scrape operation')

    try {
      const response = await fetch('http://localhost:3000/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      })

      addLog('Received response from server')

      const reader = response.body?.getReader()
      if (!reader) throw new Error('Failed to get response reader')

      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) {
          addLog('Done')
          break
        }

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const jsonStr = line.slice(6)
            try {
              const data = JSON.parse(jsonStr)
              if (data.taskId) {
                addLog(`Received taskId: ${data.taskId}`)
              } else if (data.progress !== undefined) {
                setProgress(data.progress)
                addLog(`Progress: ${data.progress.toFixed(2)}%`)
              } else if (data.success) {
                addLog('Scrape completed successfully')
                setResult(data)
                setStatus('completed')
                setProgress(100)
              } else if (data.error) {
                throw new Error(data.error)
              }
            } catch (error) {
              addLog(`Error parsing data: ${error}`)
            }
          }
        }
      }
    } catch (error) {
      addLog(`Error scraping data: ${error}`)
      setStatus('error')
    }
  }, [addLog])

  const handleStop = useCallback(() => {
    addLog('Stopping scrape operation')
    setStatus('idle')
    setProgress(0)
  }, [addLog])

  return (
    <div className="space-y-6">
      <ScrapeForm onSubmit={handleSubmit} />
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <span className="font-semibold">Status: </span>
          <span className={`capitalize ${status === 'error' ? 'text-red-500' : ''}`}>{status}</span>
          {status === 'running' && (
            <Button onClick={handleStop} variant="destructive">Stop</Button>
          )}
        </div>
        {(status === 'running' || status === 'completed') && (
          <div>
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-gray-500 mt-1">
              Progress: {progress.toFixed(2)}%
            </p>
          </div>
        )}
        {status === 'completed' && result && (
          <div>
            <p>Scraped {result.data.length} items</p>
            <p>Inserted {result.insertedCount} items into database</p>
          </div>
        )}
        <div className="mt-4 p-4 bg-gray-100 rounded-md max-h-60 overflow-y-auto">
          <h3 className="font-semibold mb-2">Logs:</h3>
          <ul className="list-disc pl-5">
            {logs.map((log, index) => (
              <li key={index}>{log}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default ScraperControl
