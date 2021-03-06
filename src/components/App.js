import '../assets/css/App.scss'
import React, {Component} from 'react'
import axios from 'axios'

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      keyWords: [],
      matches: [],
      loadingPosts: false,
    }
    this.onNewWordSubmit = this.onNewWordSubmit.bind(this)
  }

  componentDidMount() {
    let wordsOnDisk = window.localStorage.getItem('keywords')
    if (wordsOnDisk) {
      wordsOnDisk = JSON.parse(wordsOnDisk)
      this.setState({keyWords: wordsOnDisk})
      this.pollAll()
    }

    setInterval(() => {
      this.pollAll()
    }, 300000) // 300000 = 5 minutes.
  }

  pollAll() {
    const url = 'https://www.reddit.com/r/all.json'
    this.setState({loadingPosts: true})
    axios.get(url)
      .then(response => {
        this.setState({loadingPosts: false})
        const matches = []
        response.data.data.children.map(child => child.data).forEach(post => {
          this.state.keyWords.forEach(word => {
            if (post.title.toLowerCase().includes(word.toLowerCase())) {
              post.matchingWord = word
              matches.push(post)
            }
          })
        })
        this.setState({matches})
      })
      .catch(console.log)
  }

  onNewWordSubmit(e) {
    e.preventDefault()
    const form = e.currentTarget
    const field = form.querySelector('input')
    const newWord = field.value.trim()
    field.value = ''
    if (newWord === '') {
      return
    }
    this.setState(state => {
      const keyWords = [...state.keyWords, newWord]
      return {
        keyWords,
        value: '',
      }
    })
    setTimeout(() => {
      window.localStorage.setItem('keywords', JSON.stringify(this.state.keyWords))
      this.pollAll()
    }, 10)
  }

  deleteKeyWord(word) {
    this.setState(state => {
      const keyWords = [...state.keyWords].filter(kw => kw !== word)
      return {
        keyWords,
        value: '',
      }
    })
    this.pollAll()
  }

  highLightWordsInString(word, string) {
    const replace = word;
    new RegExp(replace, 'g');
    const html = {__html: string.replace(replace, `<span class="highlight">${word}</span>`)}
    return (
      <span dangerouslySetInnerHTML={html}/>
    )
  }

  getResultListItems() {
    if (this.state.matches.length < 1 && !this.state.loadingPosts) {
      return (
        <span className="no-results hide-for-fade-out">No results.</span>
      )
    }
    return (
      <ul className="matches-list">
        {this.state.matches.map(post => {
          return (
            <li key={post.title} onClick={() => {
              require('electron').shell.openExternal('https://www.reddit.com' + post.permalink)
            }}>
              <h4>{post.matchingWord}</h4>
              <span className="subreddit-badge">/r/{post.subreddit}</span>
              <h3>{this.highLightWordsInString(post.matchingWord, post.title)}</h3>
            </li>
          )
        })}
      </ul>
    )
  }

  render() {
    return (
      <div className="app">
        <div className="col">
          <h2>Your words</h2>
          <form action="#" onSubmit={this.onNewWordSubmit}>
            <input type="text" placeholder="Add a word... (press enter)"/>
          </form>
          <ul>
            {this.state.keyWords.map(word => {
              return (
                <li key={word}>
                  {word}
                  <button onClick={() => {
                    this.deleteKeyWord(word)
                  }}>×
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
        <div className="col">
          <h2>Results</h2>
          {this.getResultListItems()}
          <div className={'loading-indicator' + (this.state.loadingPosts ? ' show' : ' hide')}>Fetching data...</div>
        </div>
      </div>
    )
  }
}

export default App
