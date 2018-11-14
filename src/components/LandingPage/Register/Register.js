import React from 'react';
import PropTypes from 'prop-types';
import Button from '../../Button';

import './Register.css';

export default class Register extends React.Component {
  static propTypes = {
    onRegister: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.submit = this.submit.bind(this);

    this.state = {
      name: '',
      email: '',
      password: ''
    }
  }

  submit() {
    console.log(this.state);
  }

  render() {
    return(
      <div className="register">
        <input className="input" type="text" placeholder="NAME" value={this.state.name} onChange={({target : {value}}) => {
          this.setState({name : value})
        }}/>
        <input className="input" type="email" placeholder="EMAIL" value={this.state.email} onChange={({target : {value}}) => {
          this.setState({email : value})
        }}/>
        <input className="input" type="password" placeholder="PASSWORD" value={this.state.password} onChange={({target : {value}}) => {
          this.setState({password : value})
        }}/>
        <Button handleClick={this.submit} buttonText="REGISTER"/>
      </div>
    )
  }
}