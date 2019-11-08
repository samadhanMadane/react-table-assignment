import React, { Component } from 'react';
import '../../styles/UserPosts.css';
import { connect } from 'react-redux';
import * as UserAactions from '../../store/actions/UserActions';
import { Table, Menu, Dropdown, Popconfirm, Input, Form, Button } from 'antd';
import ExpandedPost from './ExpandedPost';
import 'antd/dist/antd.css';
import AddPostModal from '../Modals/AddPostModal';
// import EditableCell from './EditableCell';

const EditableContext = React.createContext();

class EditableCell extends Component {
  getInput = () => {
    return <Input />;
  };

  renderCell = ({ getFieldDecorator }) => {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              rules: [
                {
                  required: true,
                  message: `Please Input ${title}!`,
                },
              ],
              initialValue: record[dataIndex],
            })(this.getInput())}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  render() {
    return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>;
  }
}

class UserPosts extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editingPost         : {},
      newPost             : {},
      userId              : 1,
      editingKey          : '',
      addNewPostModalOpen : false,
      columns             : [
        { title: 'Title', dataIndex: 'title', key: 'title', editable: true },
        { title: 'Body', dataIndex: 'body', key: 'body', editable: true },
        { title: 'Action', key: 'operation', render: (text, post) => {
          const { editingKey } = this.state;
          const editable = this.isEditing(post);
          return editable ? (
              <span>
                <EditableContext.Consumer>
                  {form => (
                    <a
                      onClick={() => this.save(form, post.key)}
                      style={{ marginRight: 8 }}
                    >
                      Save
                    </a>
                  )}
                </EditableContext.Consumer>
                <Popconfirm title="Sure to cancel?" onConfirm={() => this.cancel(post.key)}>
                  <a>Cancel</a>
                </Popconfirm>
              </span>)
            : 
              (
                <span className="table-operation">
                  <Dropdown
                    overlay={
                      <Menu>
                        { editingKey === '' && <Menu.Item onClick={() => this.edit(post.id)}>Edit</Menu.Item> }
                        <Menu.Item onClick={() => this.postDeleteHandler(post.id)}>Delete</Menu.Item>
                      </Menu>
                    }
                  >
                    <div><i className="fa fa-ellipsis-v"></i></div>
                  </Dropdown>
                </span>
              )
          }
        },
      ],
    }

    this.postDeleteHandler      = this.postDeleteHandler.bind(this);
    this.edit                   = this.edit.bind(this);
    this.isEditing              = this.isEditing.bind(this);
    this.cancel                 = this.cancel.bind(this);
    this.save                   = this.save.bind(this);
    this.toggleAddNewPost       = this.toggleAddNewPost.bind(this);
    this.handleAddNewPostSubmit = this.handleAddNewPostSubmit.bind(this);
    this.handleAddNewPostCancel = this.handleAddNewPostCancel.bind(this);
  }

  componentDidMount () {
    const userId = this.props.match.params && this.props.match.params.userId;
    this.setState({
      userId : parseInt(userId, 10),
    });
    this.props.onFetchUserPosts(parseInt(userId, 10));
  }

  isEditing(post) {
    return post.key === this.state.editingKey;
  } 

  edit(key) {
    this.setState({ editingKey: key });
  }

  cancel() {
    this.setState({ editingKey: '' });
  };

  save(form, key) { 
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      if (key > -1) {
        this.props.onEditPost(key, row);
      }
      this.setState({ editingKey: '' });
    });
  }

  postDeleteHandler(postId) {
    this.props.onDeletePost(postId);
  }

  handleAddNewPostSubmit(postId) {
    this.props.onDeletePost(postId);
    this.toggleAddNewPost();
  }

  handleAddNewPostCancel() {
    this.toggleAddNewPost();
  }

  toggleAddNewPost() {
    this.setState({
      addNewPostModalOpen : !this.state.addNewPostModalOpen,
    });
  }

  render() {
    const components = {
      body: {
        cell: EditableCell,
      },
    };

    const columns = this.state.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });

    return (
      <div className="user-posts">
        <h2 className="header">User {this.state.userId} > Posts</h2>
        <div><Button onClick={this.toggleAddNewPost}>Add New Post</Button></div>
        <div>
          <EditableContext.Provider value={this.props.form}>
            <Table
              components={components}
              bordered
              className="components-table-demo-nested"
              rowClassName="editable-row"
              columns={columns}
              expandedRowRender={record => <ExpandedPost data={record}/>}
              dataSource={this.props.posts}
              pagination={{
                onChange: this.cancel,
              }}
            />
          </EditableContext.Provider>
        </div>
        {this.state.addNewPostModalOpen &&
          <AddPostModal
            addNewPostModalOpen={this.state.addNewPostModalOpen}
            handleAddNewPostSubmit={this.handleAddNewPostSubmit}
            handleAddNewPostCancel={this.handleAddNewPostCancel}
          />
        }
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    posts   : state.userPosts.posts.data,
    loading : state.userPosts.loading,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onFetchUserPosts : (userId) => dispatch(UserAactions.fetchUsersPostData(userId)),
    onDeletePost     : (postId) => dispatch(UserAactions.deletePost(postId)),
    onEditPost       : (postId, updatedPost) => dispatch(UserAactions.editPost(postId, updatedPost)),
    onAddPost        : (newPost) => dispatch(UserAactions.addPost(newPost))
  }
}

const EditableUserPosts = Form.create()(UserPosts);

export default connect(mapStateToProps, mapDispatchToProps)(EditableUserPosts);
