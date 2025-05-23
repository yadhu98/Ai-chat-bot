import { GoogleGenAI } from "@google/genai";
const geminiApi = import.meta.env.VITE_GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: geminiApi });


const handleAIResponse = async (message)=>{
    console.log(message)
    try{
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: message,
          });
          console.log(response.text)
    }
    catch(e){
        console.log(e)
    }
}

const  parseWeatherMessage = (message) => {
    const cityMatch = message.match(/\*\*City:\*\*\s*([A-Za-z\s]+)/)
    const tempMatch = message.match(/\*\*Temperature:\*\*\s*([0-9]+)°C/)
    const feelsLikeMatch = message.match(/\*\*Feels Like:\*\*\s*([0-9]+)°C/)
    const conditionMatch = message.match(/\*\*Condition:\*\*\s*([A-Za-z\s]+)/)
    const windSpeedMatch = message.match(/\*\*Wind Speed:\*\*\s*([0-9]+)\s*km\/h/)
    const humidityMatch = message.match(/\*\*Humidity:\*\*\s*([0-9]+)%/)
  
    return {
      city: cityMatch ? cityMatch[1].trim() : null,
      temperature: tempMatch ? parseInt(tempMatch[1]) : null,
      feels_like: feelsLikeMatch ? parseInt(feelsLikeMatch[1]) : null,
      condition: conditionMatch ? conditionMatch[1].trim() : null,
      wind_speed: windSpeedMatch ? parseInt(windSpeedMatch[1]) : null,
      humidity: humidityMatch ? parseInt(humidityMatch[1]) : null
    }
  }

const handleWeather= async (city,addMessage)=>{
        if (!city) {
          addMessage('Need to add city name','assistant')
          return
        }
    
        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.0-flash",
                contents: `Find current weather in ${city} , I need the response with city,condition,feels like,wind speed,humidity,temperature,`,
              });
              const content = response['candidates'][0]['content']['parts'][0]['text'];
              const responseMain = parseWeatherMessage(content)
              addMessage('', 'assistant', 'plugin', 'weather', responseMain)

        } catch (e) {
            console.log(e)
          addMessage(`Error ${e}`, 'assistant')
        }
}

const simpleCalculator = (expression)=>{
    const expr = expression.replace(/\s+/g, '')
    if (expr.includes('+')) {
      const parts = expr.split('+')
      return parts.reduce((sum, val) => sum + parseFloat(val), 0)
    }
  
    if (expr.includes('-')) {
      const parts = expr.split('-')
      return parts.slice(1).reduce((result, val) => result - parseFloat(val), parseFloat(parts[0]))
    }
  
    if (expr.includes('*')) {
      const parts = expr.split('*')
      return parts.reduce((product, val) => product * parseFloat(val), 1)
    }
  
    if (expr.includes('/')) {
      const parts = expr.split('/')
      return parts.slice(1).reduce((result, val) => result / parseFloat(val), parseFloat(parts[0]))
    }
  
    if (!isNaN(parseFloat(expr))) {
      return parseFloat(expr)
    }
  
    return 'Expression not possible'
  }
const handleCalculator = async (expression,addMessage) => {
  if (!expression) {
    addMessage('Need expressions','assistant')
    return
  }

  const result = simpleCalculator(expression)
  if (!result) {
    addMessage('Error','assistant')
    return
  }

  const calcData = {
    expression: expression,
    result: result
  }
  addMessage('', 'assistant', 'plugin', 'calc', calcData)
}

function parseDictionaryEntry(message) {
    const wordMatch = message.match(/\*\*(.+?)\*\*/);
    const partOfSpeechMatch = message.match(/\*\*Part of Speech:\*\*\s*([A-Za-z]+)/);
    const meaningMatch = message.match(/\*\*Meaning:\*\*\s*([^\n]+)/);
  
    return {
      word: wordMatch ? wordMatch[1].trim() : null,
      part_of_speech: partOfSpeechMatch ? partOfSpeechMatch[1].trim() : null,
      meaning: meaningMatch ? meaningMatch[1].trim() : null
    };
  }

const handleDictionarySearch=async(word,addMessage)=>{
        if (!word) {
          addMessage('Please provide a word to define. Example: /define hello', 'assistant')
          return
        }
    
        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.0-flash",
                contents: `You are dictionary , and you have to find the meaning of ${word} , and should give response with meaning,part of speech`,
              });
              const content = response['candidates'][0]['content']['parts'][0]['text'];
              const responseMain = parseDictionaryEntry(content)
              console.log(parseDictionaryEntry(content))
              addMessage('', 'assistant', 'plugin', 'define', responseMain)

        } catch (error) {
            console.log(error)
          addMessage('Dictionary service unavailable.', 'assistant')
        }
      }

export {handleAIResponse,handleWeather,handleCalculator,handleDictionarySearch}
