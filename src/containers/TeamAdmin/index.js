// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import TeamNavbar from '../../components/TeamNavbar';
import ApplicationListItem from '../../components/ApplicationListItem';
import EnvironmentListItem from '../../components/EnvironmentListItem';
import ApplicationForm from '../../components/ApplicationForm';
import EnvironmentForm from '../../components/EnvironmentForm';
import {
  fetchTeamTable,
  connectToChannel,
  leaveChannel,
  createReservation,
  deleteReservation,
  updateTeam,
  fetchTeamEnvironments,
  createTeamEnvironment,
  deleteTeamEnvironment,
  fetchTeamApplications,
  createTeamApplication,
  updateApplication,
  updateEnvironment,
  deleteTeamApplication,
  loadApplication,
  setEditingApplication,
  setEditingEnvironment

} from '../../actions/team';
import { Application, Environment, Pagination } from '../../types';

type Props = {
  team: Object,
  params: {
    id: number
  },
  applications: Array<Application>,
  environments: Array<Environment>,
  currentUser: Object,
  pagination: Pagination,
  updateTeam: () => void
}

class TeamAdmin extends Component {
  componentWillMount() {
    this.props.fetchTeamTable(this.props.match.params.id);
  }
  componentDidMount() {
    this.props.connectToChannel(this.props.socket, this.props.match.params.id);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.id !== this.props.match.params.id) {
      this.props.leaveChannel(this.props.channel);
      this.props.connectToChannel(nextProps.socket, nextProps.match.params.id);
      this.props.fetchTeamTable(nextProps.match.params.id);
    }
    if (!this.props.socket && nextProps.socket) {
      this.props.connectToChannel(nextProps.socket, nextProps.match.params.id);
      this.props.fetchTeamTable(nextProps.match.params.id);
    }
  }

  componentWillUnmount() {
    this.props.leaveChannel(this.props.channel);
  }

  props: Props

  handleDescriptionUpdate = (data) => {
    this.props.updateTeam(this.props.match.params.id, data);
  }

  handleApplicationFormSubmit = (data) => {
    const payload = { ...data, team_id: this.props.match.params.id };

    if(payload.id) {
      this.props.updateApplication(payload);
    } else {
      this.props.createTeamApplication(this.props.match.params.id, payload);
    }
  }

  handleEnvironmentFormSubmit = (data) => {
    const payload = { ...data, team_id: this.props.match.params.id };

    if(payload.id) {
      this.props.updateEnvironment(payload);
    } else {
      this.props.createTeamEnvironment(this.props.match.params.id, payload);
    }
  }

  handleApplicationDelete = (applicationId) => {
    this.props.deleteTeamApplication(this.props.match.params.id, applicationId);
  }

  handleEnvironmentDelete = (environmentId) => {
    this.props.deleteTeamEnvironment(this.props.match.params.id, environmentId);
  }

  handleApplicationUpdate = (data) => {
    return this.props.setEditingApplication(data);
  }

  handleEnvironmentUpdate = (data) => {
    return this.props.setEditingEnvironment(data);
  }

  applicationList = () => {
    return this.props.applications.map(a => <ApplicationListItem
      key={`application-${a.id}`}
      application={a}
      onApplicationUpdate={this.handleApplicationUpdate}
      onApplicationDelete={this.handleApplicationDelete}
    />);
  }

  environmentList = () => {
    return this.props.environments.map(e => <EnvironmentListItem
      key={`environment-${e.id}`}
      environment={e}
      onEnvironmentUpdate={this.handleEnvironmentUpdate}
      onEnvironmentDelete={this.handleEnvironmentDelete}
    />);
  }

  render() {
    return (
      <div style={{ display: 'flex', flex: '1' }}>
        <div style={{ display: 'flex', flexDirection: 'column', flex: '1' }}>
          <TeamNavbar team={this.props.team} onDescriptionUpdate={this.handleDescriptionUpdate} />
          <div className='teamAdminSection' style={{ display: 'flex', justifyContent: 'space-around' }}>
            <section className='newAppEnvForms'>
              <ApplicationForm onSubmit={this.handleApplicationFormSubmit} />
              <EnvironmentForm onSubmit={this.handleEnvironmentFormSubmit} />
            </section>
            <section className='adminApplicationList'>
              <h3 className='adminSectionHeader'>Applications</h3>
              {this.applicationList()}
            </section>
            <section className='adminEnvironmentList'>
              <h3 className='adminSectionHeader'>Environments</h3>
              {this.environmentList()}
            </section>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  (state) => ({
    team: state.team.currentTeam,
    socket: state.session.socket,
    channel: state.team.channel,
    reservations: state.team.reservations,
    applications: state.team.applications,
    environments: state.team.environments,
    presentUsers: state.team.presentUsers,
    currentUser: state.session.currentUser,
    pagination: state.team.pagination,
    editingApplication: state.team.editingApplication
  }),
  { fetchTeamTable,
    connectToChannel,
    leaveChannel,
    createReservation,
    deleteReservation,
    updateTeam,
    fetchTeamApplications,
    fetchTeamEnvironments,
    createTeamApplication,
    updateApplication,
    updateEnvironment,
    deleteTeamApplication,
    createTeamEnvironment,
    deleteTeamEnvironment,
    loadApplication,
    setEditingApplication,
    setEditingEnvironment
  }
)(TeamAdmin);
