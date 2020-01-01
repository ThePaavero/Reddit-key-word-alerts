import '../assets/css/App.scss'
import React, {Component} from 'react'
import axios from 'axios'

class App extends Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.pollAll()
  }

  pollAll() {
    const url = 'https://www.reddit.com/r/all.json'
    axios.get(url)
      .then(response => {
        const posts = response.data.data.children.map(child=>child.data)
        console.log(posts)
      })
      .catch(console.log)
  }

  render() {
    return (
      <div>
        <h1>Hello, Electron!</h1>
        <p>I hope you enjoy using basic-electron-react-boilerplate to start your dev off right!</p>
      </div>
    )
  }
}

export default App
