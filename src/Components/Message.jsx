function Message({ message }) {
    const formatTime = (timestamp) => {
      return new Date(timestamp).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    }
  
    const renderPluginContent = () => {
      switch (message.pluginName) {
        case 'calc':
          return (
            <div className="calc-card">
              <div className="expression">{message.pluginData.expression}</div>
              <div className="result">= {message.pluginData.result}</div>
            </div>
          )
          case 'weather':
            return (
              <div className="weather-card">
                <h3>{message.pluginData.city}</h3>
                <div className="weather-main">
                  <span className="temperature">{message.pluginData.temperature}°C</span>
                  <span className="description">{message.pluginData.condition}</span>
                </div>
                <div className="weather-details">
                  <span>Humidity: {message.pluginData.humidity}%</span>
                  <span>Wind: {message.pluginData.wind_speed} m/s</span>
                </div>
              </div>
            )
            case 'define':
                return (
                  <div className="define-card">
                    <h3>{message.pluginData.word}</h3>
                    <span className="part-of-speech">{message.pluginData.part_of_speech}</span>
                    <p>{message.pluginData.meaning}</p>
                  </div>
                )
        default:
          return <div>{message.content}</div>
      }
    }
    return (
      <div className={`message ${message.sender}`}>
        <div className="message-content">
          {message.type === 'plugin' ? renderPluginContent() : message.content}
        </div>
        <div className="message-time">{formatTime(message.timestamp)}</div>
      </div>
    )
  }
  
  export default Message
  