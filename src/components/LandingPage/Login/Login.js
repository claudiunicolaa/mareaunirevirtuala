import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import Button from '../../Button';

import './Login.css';

import Constants from '../../../constants/Constants';

export default class Login extends React.Component {

  static propTypes = {
    onLogin: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      loading: false,
      error: null
    };

    this.submit = this.submit.bind(this);
  }

  submit() {
    this.switchLoading();
    axios.post(`${Constants.API_URL}/users/login`, { ...this.state })
      .then(res => {
        this.switchLoading();
        if (res.status === 200) {
          this.props.onLogin(res.data);
        }
      })
      .catch(e => {
        if (e.response) {
          this.switchLoading();
          this.setState({
            error: e.response ? e.response.data.message : "Aparent ne lovim de o problema interna, ne pare rau",
          });
        }
      });
  }

  switchLoading() {
    this.setState({
      loading: !this.state.loading,
      error: ''
    });
  }

  render() {
    const { loading, error } = this.state;
    return (
      <div className="login">
        {error && <div class="error alert-danger">{error}</div>}
        <input className="input" type="email" placeholder="Email" value={this.state.email} onChange={({ target: { value } }) => {
          this.setState({ email: value })
        }} />
        <input className="input" type="password" placeholder="Parola" value={this.state.password} onChange={({ target: { value } }) => {
          this.setState({ password: value })
        }} />

        {loading &&
          <div class="loader-container">
            <div class="loader"></div>
          </div>}
        {!loading && < Button handleClick={this.submit} buttonText="AUTENTIFICARE" />}

      </div>
    )
  }
}
