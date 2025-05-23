import React, { useEffect, useRef, useState } from 'react'
import Message from '../Components/Message'
import { handleAIResponse, handleCalculator, handleDictionarySearch, handleWeather } from '../Services/service'

const Screen = () => {
    const [loading,setLoading] = useState()
    const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')

  const messagesEndRef = useRef(null)
  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages))
  }, [messages])

  useEffect(() => {
    const savedMessages = localStorage.getItem('chatMessages')
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages))
    }
  }, [])

  const addMessage = (content, sender, type = 'text', pluginName = null, pluginData = null) => {
    const newMessage = {
      id: Date.now().toString(),
      sender,
      content,
      type,
      pluginName,
      pluginData,
      timestamp: new Date().toISOString()
    }
    setMessages(prev => [...prev, newMessage])
  }

  const handlePlugin = async (command) => {
    const parts = command.split(' ')
    const pluginName = parts[0].substring(1)
    const args = parts.slice(1).join(' ')

    switch (pluginName) {
      case 'weather':
        await handleWeather(args,addMessage)
        break
      case 'calc':
        await handleCalculator(args,addMessage)
        break
      case 'define':
        await handleDictionarySearch(args,addMessage)
        break
      default:
        addMessage('Check Prompt')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    addMessage(input, 'user')
    setLoading(true)

    try {
      if (input.startsWith('/')) {
        await handlePlugin(input)
      } else {
        await handleAIResponse(input)
      }
    } catch (error) {
    console.log(error)
    }

    setInput('')
    setLoading(false)
  }
  return (
    <div className="chat-container">
    <div className="chat-header">
      <h1>AI Chat</h1>
    </div>
    
    <div className="messages-container">
      {messages.map(message => (
        <Message key={message.id} message={message} />
      ))}
      {loading && <div className="loading"></div>}
      <div ref={messagesEndRef} />
    </div>

    <form onSubmit={handleSubmit} className="input-form">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask me"
        disabled={loading}
      />
      <button className='btn-send' type="submit" disabled={loading}>Send</button>
    </form>
  </div>
  )
}

export default Screen