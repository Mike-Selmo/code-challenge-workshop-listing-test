import React, { Component } from 'react';

import './WorkshopItem.css';

class WorkshopItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showWorkshop: true,
    };
  }
  componentWillUnmount () {
    console.log('Unmounting workshop item ');
  }

  likeClickHandler (ev) {
    if (!this.props.preferred) {
      fetch (`http://localhost:3000/api/v1/users/workshops/liked/${this.props._id}`, { headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}, method: 'POST' })
      .then ( (resp) => {
        if (resp.status === 200) {
          console.log (`Workshop ${this.props._id} added to preferred workshops !`);
          this.setState({showWorkshop:false});
        }
        else {
          console.log(`Status returned ${resp.status}`); }
        } )
      .catch( (err) => {
        console.error(err);
      } );
    }
  }

  dislikeClickHandler (ev) {
    fetch (`http://localhost:3000/api/v1/users/workshops/disliked/${this.props._id}`, { headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}, method: 'POST' })
    .then ( (resp) => {
      if (resp.status === 200) {
        console.log (`Workshop ${this.props._id} added to user's disliked workshops !`);
        this.setState({showWorkshop:false});
      }
      else {
        console.log(`Status returned ${resp.status}`); }
      } )
    .catch( (err) => {
      console.error(err);
    } );
  }

  removeClickHandler (ev) {
    if (this.props.preferred) {
      fetch (`http://localhost:3000/api/v1/users/workshops/liked/${this.props._id}`, { headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}, method: 'DELETE' })
      .then ( (resp) => {
        if (resp.status === 200) {
          console.log (`Workshop ${this.props._id} removed from preferred workshops !`);
          this.setState({showWorkshop:false});
        }
        else {
          console.log(`Status returned ${resp.status}`); }
        } )
      .catch( (err) => {
        console.error(err);
      } );
    }
  }

  render() {
    if(this.state.showWorkshop){
      return (
        <article className="workshop-item">
            <div className="up">
              <h2 className="title">{this.props.name}</h2>
            </div>
            <div className="middle">
              <img className="workshop-img" src={this.props.picture} alt="" />
            </div>
            <div className="down">
              <div className={this.props.preferred ? "hidden": ""}>
                <button className="workshop-btn dislike-btn" onClick={this.dislikeClickHandler.bind(this)}>Dislike</button>
                <button className="workshop-btn like-btn" onClick={this.likeClickHandler.bind(this)}>Like</button>
              </div>
              <div className={this.props.preferred ? "": "hidden"}>
                <button className="workshop-btn remove-btn" onClick={this.removeClickHandler.bind(this)}>Remove</button>
              </div>
            </div>
        </article>
      );
    } else {
      return null;
    }
  }
}

export default WorkshopItem;
