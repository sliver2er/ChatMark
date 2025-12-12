/**
 * Detect ChatGPT's current theme (dark or light)
 * ChatGPT uses the 'dark' class on the html element
 */
export function detectChatGPTTheme(): 'dark' | 'light' {
  const htmlElement = document.documentElement

  // Check for 'dark' class on html element
  if (htmlElement.classList.contains('dark')) {
    return 'dark'
  }

  // Check for data-theme attribute
  const dataTheme = htmlElement.getAttribute('data-theme')
  if (dataTheme === 'dark') {
    return 'dark'
  }

  // Default to light
  return 'light'
}

/**
 * Setup a MutationObserver to watch for theme changes
 * @param callback Function to call when theme changes
 * @returns cleanup function to disconnect observer
 */
export function watchChatGPTTheme(callback: (theme: 'dark' | 'light') => void): () => void {
  const htmlElement = document.documentElement

  // Initial detection
  const initialTheme = detectChatGPTTheme()
  callback(initialTheme)

  // Watch for changes
  const observer = new MutationObserver(() => {
    const newTheme = detectChatGPTTheme()
    callback(newTheme)
  })

  observer.observe(htmlElement, {
    attributes: true,
    attributeFilter: ['class', 'data-theme']
  })

  // Return cleanup function
  return () => {
    observer.disconnect()
  }
}
