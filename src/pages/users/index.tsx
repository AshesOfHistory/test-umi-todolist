import React, { useState } from 'react';
import { Table, Popconfirm, Button } from 'antd';
import UserModal from './components/UserModal';
import { connect } from 'umi';

const index = ({ users, dispatch, userListLoading }) => {
  // 接受到返回到users值
  const [modalVisible, setModalVisible] = useState(false);
  const [record, setRecord] = useState(undefined);
  const handleEdit = record => {
    setRecord(record);
    setModalVisible(true);
  };
  const closeModal = () => {
    setModalVisible(false);
  };
  const onFinish = values => {
    const id = record?.id;
    if (id) {
      dispatch({
        type: 'users/edit', // dispatch的时候需要加上命名空间
        payload: {
          id,
          values,
        },
      });
    } else {
      dispatch({
        type: 'users/add', // dispatch的时候需要加上命名空间
        payload: {
          values,
        },
      });
    }

    setModalVisible(false);
  };
  const onConfirmDelete = record => {
    setRecord(record);
    dispatch({
      type: 'users/delete',
      payload: record.id,
    });
    setRecord(undefined);
  };
  const onAdd = () => {
    setRecord(undefined);
    setModalVisible(true);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: text => <a>{text}</a>,
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <div>
          <Button
            style={{ marginRight: '10px' }}
            onClick={() => {
              handleEdit(record);
            }}
          >
            编辑
          </Button>
          <Popconfirm
            placement="top"
            title="确认删除么？"
            onConfirm={() => {
              onConfirmDelete(record);
            }}
            okText="确定"
            cancelText="取消"
          >
            <Button danger type="primary">
              删除
            </Button>
          </Popconfirm>
        </div>
      ),
    },
    {
      title: 'create_time',
      dataIndex: 'create_time',
      key: 'create_time',
    },
  ];

  return (
    <div className="list-table">
      <Button type="primary" onClick={onAdd}>
        添加
      </Button>
      <Table
        columns={columns}
        dataSource={users.length ? users : []}
        rowKey="id"
        loading={userListLoading}
      />
      <UserModal
        visible={modalVisible}
        handleCancel={closeModal}
        handleOk={closeModal}
        onFinish={onFinish}
        record={record}
      ></UserModal>
    </div>
  );
};

// const mapUserStateToProps = ({ users }) => ({ // model namespace users
//   users
// })
export default connect(({ users, loading }) => ({
  // model namespace users
  users,
  userListLoading: loading.models.users,
}))(index); // 使用connect方式 将返回数据绑定到index函数组件中
