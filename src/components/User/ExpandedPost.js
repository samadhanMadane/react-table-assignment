import React, { Component } from 'react';
import { Table } from 'antd';
import 'antd/dist/antd.css';
import { connect } from 'react-redux';
import * as UserAactions from '../../store/actions/UserActions';

class ExpandedPosts extends Component {
  constructor(props) {
    super(props);

    this.state = {
      columns : [
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Body', dataIndex: 'body', key: 'body' },
      ]
    }
  }
  componentDidMount() {
    const { data } = this.props;
    const postId = data && data.id;
    this.props.onFetchUserPostCommnets(postId);
  }

  render() {
    return (
      <Table 
        key={this.props.data.id}
        columns={this.state.columns}
        dataSource={this.props.data.comments}
        pagination={false}
      /> 
    );
  }
};

const mapStateToProps = state => {
  return {
    posts : state.userPosts.posts,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onFetchUserPostCommnets : (postId) => dispatch(UserAactions.fetchUsersPostComments(postId)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ExpandedPosts);
