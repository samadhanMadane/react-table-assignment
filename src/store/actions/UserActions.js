import * as ActionConstants from '../actions_constants/ActionConstants';
import axios from '../../axios-user-data';

export const fetchUsersPostsSuccess = (posts) => {
  return {
    type  : ActionConstants.FETCH_USER_POSTS_SUCCESS,
    posts : posts
  }
}

export const fetchUserPostsFail = (error) => {
  return {
    type  : ActionConstants.FETCH_USER_POSTS_FAIL,
    error : error
  }
}

export const fetchUsersPostData = (userId) => {
  return dispatch => {
    axios.get(`/posts?userId=${userId}`)
      .then(res => {
        const posts = res.data.map(post => ({
          ...post,
          key : post.id,
        }));
        dispatch(fetchUsersPostsSuccess(posts));
      })
      .catch(error => {
        dispatch(fetchUserPostsFail(error));
      });
  }
}

export const fetchUsersPostCommnetsSuccess = (comments, postId) => {
  return {
    type     : ActionConstants.FETCH_USER_POST_COMMENTS_SUCCESS,
    comments : comments,
    postId   : postId,
  }
}

export const fetchUserPostCommnetsFail = (error) => {
  return {
    type  : ActionConstants.FETCH_USER_POST_COMMENTS_FAIL,
    error : error
  }
}

export const fetchUsersPostComments = (postId) => {
  return dispatch => {
    axios.get(`/comments?postId=${postId}`)
      .then(res => {
        const comments = res.data.map(comment => ({
          ...comment,
          key : comment.id,
        }));
        dispatch(fetchUsersPostCommnetsSuccess(comments, postId));
      })
      .catch(error => {
        dispatch(fetchUserPostCommnetsFail(error));
      });
  }
}

export const deletePost = (postId) => {
  return dispatch => {
    axios.delete('/posts/' + postId)
      .then(res => {
        dispatch(deletePostSuccess(postId));
      })
      .catch(error => {
        dispatch(deletePostFail(error));
      });
  }
}

const deletePostSuccess = (postId) => {
  return {
    type   : ActionConstants.DELETE_POST_SUCCESS,
    postId : postId
  }
}

const deletePostFail = (error) => {
  return {
    type  : ActionConstants.DELETE_POST_FAIL,
    error : error
  }
}

export const editPost = (postId, updatedPost) => {
  return dispatch => {
    axios.patch('/posts/' + postId, updatedPost)
      .then(res => {
        dispatch(editPostSuccess(updatedPost, postId));
      })
      .catch(error => {
        dispatch(editPostFail(error));
      });
  }
}

const editPostSuccess = (updatedPost, postId) => {
  return {
    type        : ActionConstants.EDIT_POST_SUCCESS,
    updatedPost : updatedPost,
    postId      : postId
  }
}

const editPostFail = (error) => {
  return {
    type  : ActionConstants.EDIT_POST_FAIL,
    error : error
  }
}

export const addPost = (newPost) => {
  return dispatch => {
    axios.post('/posts/', newPost)
      .then(res => {
        dispatch(addPostSuccess(newPost));
      })
      .catch(error => {
        dispatch(addPostFail(error));
      });
  }
}

const addPostSuccess = (newPost) => {
  return {
    type    : ActionConstants.ADD_POST_SUCCESS,
    newPost : newPost
  }
}

const addPostFail = (error) => {
  return {
    type  : ActionConstants.ADD_POST_FAIL,
    error : error
  }
}
