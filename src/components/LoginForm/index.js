// @flow
import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Link } from 'react-router-dom';
import Input from '../Input';
import Card from '../../elements/card';
import Button from '../../elements/button';

type Props = {
  onSubmit: () => void,
  handleSubmit: () => void,
  submitting: boolean
};

class LoginForm extends Component {
  props: Props;

  handleSubmit = data => this.props.onSubmit(data);

  render() {
    const { handleSubmit, submitting } = this.props;

    return (
      <Card className='card w-50'>
        <div className="card-header">
          <h3 style={{ textAlign: 'center' }}>Login to Argonaut</h3>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit(this.handleSubmit)}>
            <label>Email</label>
            <Field
              name="email"
              type="text"
              component={Input}
              style={{ marginBottom: '1rem' }}
            />

            <label>Password</label>
            <Field
              name="password"
              type="password"
              component={Input}
              style={{ marginBottom: '1rem' }}
            />
            <Button
              type="submit"
              disabled={submitting}
              className="btn btn-block btn-primary">
              {submitting ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </div>
        <div className="card-footer">
          <div className="login-form-links">
            <Link to="/signup" className="btn btn-outline-success">
              Create a New Account
            </Link>
            <Link to="/forgot_password" className="btn btn-outline-secondary">
              Forgot Password
            </Link>
          </div>
        </div>
      </Card>
    );
  }
}

const validate = values => {
  const errors = {};
  if (!values.email) {
    errors.email = 'Required';
  }
  if (!values.password) {
    errors.password = 'Required';
  }
  return errors;
};

export default reduxForm({
  form: 'login',
  validate
})(LoginForm);
