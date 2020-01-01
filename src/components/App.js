import '../assets/css/App.scss'
import React, {Component} from 'react'
import axios from 'axios'

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      keyWords: [
        'eric',
        'usa',
        'ea',
        'may',
      ],
      matches: [],
    }
  }

  componentDidMount() {
    this.pollAll()
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

  render() {
    return (
      <div>
        <div className="col">
          Your words:
          <ul>
            {this.state.keyWords.map(word => {
              return (
                <li key={word}>{word}</li>
              )
            })}
          </ul>
        </div>
        <div className="col">
          Results:
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
