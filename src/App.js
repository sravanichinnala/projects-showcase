import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Header from './components/Header'
import ProjectsItem from './components/ProjectsItem'
import './App.css'

// This is the list (static data) used in the application. You can move it to any component if needed.
const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'INPROGRESS',
}

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

// Replace your code here
class App extends Component {
  state = {
    activeCategorieId: categoriesList[0].id,
    apiStatus: apiStatusConstants.initial,
    projects: [],
  }

  componentDidMount() {
    this.getProjects()
  }

  renderUnorderList = () => {
    const {projects} = this.state
    return (
      <ul className='projects-container'>
        {projects.map(projectDetails => (
          <ProjectsItem
            key={projectDetails.id}
            projectDetails={projectDetails}
          />
        ))}
      </ul>
    )
  }

  getProjects = async () => {
    const {activeCategorieId} = this.state
    console.log(activeCategorieId)
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const apiUrl = `https://apis.ccbp.in/ps/projects?category=${activeCategorieId}`

    const response = await fetch(apiUrl)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.projects.map(project => ({
        id: project.id,
        name: project.name,
        imageUrl: project.image_url,
      }))
      this.setState({
        projects: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    }
    if (response.status === 401) {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  clickTabItem = tabValue => {
    console.log(tabValue.target.value)
    this.setState({activeCategorieId: tabValue.target.value}, () =>
      this.getProjects(),
    )
  }

  renderLoadingView = () => (
    <div data-testid='loader'>
      <Loader type='ThreeDots' color='#00BFFF' height={50} width={50} />
    </div>
  )

  renderProjectsView = () => {
    const {activeCategorieId} = this.state
    return (
      <div className='project-item-container'>
        <Header />
        <div className='selector-container'>
          <select onChange={this.clickTabItem} value={activeCategorieId}>
            {categoriesList.map(item => (
              <option value={item.id}>{item.displayText}</option>
            ))}
          </select>
        </div>
        {this.renderUnorderList()}
      </div>
    )
  }

  renderFailureView = () => (
    <div className='failure-container'>
      <img
        src='https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png'
        alt='failure view'
        className='failure-image'
      />
      <h1 className='failure-heading'>Oops! Something Went Wrong</h1>
      <p className='failure-description'>
        We cannot seem to find the page you are looking for
      </p>
      <button
        className='failure-retry-button'
        onClick={() => this.getProjects()}
      >
        Retry
      </button>
    </div>
  )

  render() {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProjectsView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }
}

export default App
