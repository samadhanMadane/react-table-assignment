import React from 'react';
import { Modal } from 'antd';
import 'antd/dist/antd.css';

const AddPostModal = ({
  addNewPostModalOpen, handleAddNewPostSubmit, handleAddNewPostCancel
}) => {
  return (
    <Modal
      title="Add New Post"
      visible={addNewPostModalOpen}
      onOk={handleAddNewPostSubmit}
      onCancel={handleAddNewPostCancel}
    >
      <p>Add new post form</p>
    </Modal>
  )
}

export default AddPostModal;
