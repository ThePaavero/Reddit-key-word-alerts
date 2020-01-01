import '../assets/css/App.scss'
import React, {Component} from 'react'
import axios from 'axios'

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      keyWords: [],
      matches: [],
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
  }

  pollAll() {
    const url = 'https://www.reddit.com/r/all.json'
    axios.get(url)
      .then(response => {
        const matches = []
        response.data.data.children.map(child => child.data).forEach(post => {
          this.state.keyWords.forEach(word => {
            if (post.title.includes(word)) {
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
          <ul>
            {this.state.matches.map(post => {
              return (
                <li key={post.title}>{post.title}</li>
              )
            })}
          </ul>
        </div>
      </div>
    )
  }
}

export default App
