import * as ActionConstants from '../actions_constants/ActionConstants';

const initialState = {
  posts : {},
}

const reducer = (state = initialState, action) => {
  switch(action.type) {
    case ActionConstants.FETCH_USER_POSTS_SUCCESS:
      return {
        ...state,
        posts : { data : action.posts }
      };
    case ActionConstants.FETCH_USER_POST_COMMENTS_SUCCESS: {
      let updatedPosts = state.posts.data;
      let updatedPost = updatedPosts.find(post => post.id === action.postId);
      updatedPost['comments'] = action.comments;
      return {
        ...state,
        posts : { data : updatedPosts },
      }
    }
    case ActionConstants.DELETE_POST_SUCCESS: {
      let updatedPosts = state.posts.data;
      updatedPosts = updatedPosts.filter(post => post.id !== action.postId);
      return {
        ...state,
        posts : { data : updatedPosts },
      }
    }
    case ActionConstants.ADD_POST_SUCCESS: {
      return {
        ...state,
        posts : { data : [...state.posts.data, action.posts] },
      }
    }
    case ActionConstants.EDIT_POST_SUCCESS: {
      let updatedPosts = [...state.posts.data];
      let updatedPost = updatedPosts.find(post => post.id === action.postId);
      updatedPost['title'] = action.updatedPost.title;
      updatedPost['body'] = action.updatedPost.body;

      return {
        ...state,
        posts : { data : updatedPosts },
      }
    }
    default:
      return state;
  }
};

export default reducer;
