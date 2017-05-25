// @flow
import React, { Component } from 'react';

type Props = {
  onSubmit: () => void,
  submitting: boolean,
  onVacationMode: () => void
}

class UserPreferences extends Component {
  props: Props

  constructor(props) {
    super(props);
    this.state = { submitting: false }
  }

  handleVacationMode = () => {
    this.setState({ submitting: true });

    this.props.onVacationMode().then(() => {
      this.setState({ submitting: false });
    });
  }

  render() {
    const { submitting } = this.state;

    return (<div style={{width: '640px' }}>
      <div className='alert alert-warning'>
        Use vacation mode to release all your reservations across all the teams.
      </div>
      <button className={submitting ? 'btn btn-primary' : 'btn'} disabled={submitting} onClick={this.handleVacationMode}>
        { submitting ? 'Working...' : 'Vacation Mode' }
      </button>
    </div>);
  }
}

export default UserPreferences;
