import './index.css'
import {Component} from 'react'

class ProjectsItem extends Component {
  state = {
    projectDetails: this.props.projectDetails,
  }

  render() {
    const {projectDetails} = this.state

    const {name, imageUrl} = projectDetails
    return (
      <>
        <li className="project-list-container">
          <img src={imageUrl} alt={name} className="project-img" />
          <p className="project-heading">{name}</p>
        </li>
      </>
    )
  }
}
export default ProjectsItem
