import React, { useState, FC, useRef } from 'react';
import { Table, Popconfirm, Button, Pagination } from 'antd';
import ProTable, {
  ProColumns,
  TableDropdown,
  ActionType,
} from '@ant-design/pro-table';
import UserModal from './components/UserModal';
import { getRemoteList } from './service';
import { connect, Dispatch, Loading, UserState } from 'umi';
import { SingleUserState, FormValues } from './data.d';

interface UserPageProps {
  users: UserState;
  dispatch: Dispatch;
  userListLoading: boolean;
}

interface ActionType {
  reload: () => void;
  fetchMore: () => void;
  reset: () => void;
}

const UserListPage: FC<UserPageProps> = ({
  users,
  dispatch,
  userListLoading,
}) => {
  // 接受到返回到users值
  const [modalVisible, setModalVisible] = useState(false);
  const [record, setRecord] = useState<SingleUserState | undefined>(undefined);
  const handleEdit = (record: SingleUserState) => {
    setRecord(record);
    setModalVisible(true);
  };
  const ref = useRef<ActionType>();
  const onReload = () => {
    console.log('onReload', ref);
    ref.current.reload();
  };
  const handlePagination = (page: number, pageSize: number) => {
    console.log(page, pageSize);
    dispatch({
      type: 'users/getRemote',
      payload: {
        page,
        per_page: pageSize,
      },
    });
  };
  const handlePageSize = (current: number, size: number) => {
    console.log(current, size);
    dispatch({
      type: 'users/getRemote',
      payload: {
        page: current,
        per_page: size,
      },
    });
  };
  const closeModal = () => {
    setModalVisible(false);
  };
  const onFinish = (values: FormValues) => {
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
  const onConfirmDelete = (id: number) => {
    dispatch({
      type: 'users/delete',
      payload: id,
    });
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
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: string, record: SingleUserState) => (
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
              onConfirmDelete(record.id);
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
      <Button onClick={onReload}>刷新</Button>
      <ProTable
        actionRef={ref}
        columns={columns}
        dataSource={users.data.length ? users.data : []}
        rowKey="id"
        loading={userListLoading}
        search={false}
        pagination={false}
      />
      <Pagination
        className="list-page"
        total={users.meta.total}
        current={users.meta.page}
        pageSize={users.meta.per_page}
        onChange={handlePagination}
        onShowSizeChange={handlePageSize}
        showSizeChanger
        showQuickJumper
        showTotal={total => `Total ${total} items`}
      />
      <UserModal
        visible={modalVisible}
        handleClose={closeModal}
        onFinish={onFinish}
        record={record}
      ></UserModal>
    </div>
  );
};

// const mapUserStateToProps = ({ users }) => ({ // model namespace users
//   users
// })
export default connect(
  ({ users, loading }: { users: UserState; loading: Loading }) => ({
    // model namespace users
    users,
    userListLoading: loading.models.users,
  }),
)(UserListPage); // 使用connect方式 将返回数据绑定到index函数组件中
