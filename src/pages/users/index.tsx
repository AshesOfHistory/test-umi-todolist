import React, { useState, FC, useRef } from 'react';
import { Table, Popconfirm, Button, Pagination, message } from 'antd';
import ProTable, {
  ProColumns,
  TableDropdown,
  ActionType,
} from '@ant-design/pro-table';
import UserModal from './components/UserModal';
import { addRecord, editRecord } from './service';
import { connect, Dispatch, Loading, UserState } from 'umi';
import { SingleUserState, FormValues } from './data.d';
import { OptionsType } from '@ant-design/pro-table/lib/component/ToolBar';

interface UserPageProps {
  users: UserState;
  dispatch: Dispatch;
  userListLoading: boolean;
}

const UserListPage: FC<UserPageProps> = ({
  users,
  dispatch,
  userListLoading,
}) => {
  // 接受到返回到users值
  const [modalVisible, setModalVisible] = useState(false);
  const [record, setRecord] = useState<SingleUserState | undefined>(undefined);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const handleEdit = (record: SingleUserState) => {
    setRecord(record);
    setModalVisible(true);
  };
  const ref = useRef<ActionType>();
  const onReload = () => {
    dispatch({
      type: 'users/getRemote',
      payload: {
        page: users.meta.page,
        per_page: users.meta.per_page,
      },
    });
  };
  const handlePagination = (page: number, pageSize?: number) => {
    console.log(page, pageSize);
    dispatch({
      type: 'users/getRemote',
      payload: {
        page,
        per_page: pageSize ? pageSize : users.meta.per_page,
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
  const onFinish = async (values: FormValues) => {
    setConfirmLoading(true);
    const id = record ? record.id : 0;
    let serviceFn;
    if (id) {
      serviceFn = editRecord;
    } else {
      serviceFn = addRecord;
    }
    const result = await serviceFn({ id, values });
    if (result) {
      message.success(id ? '编辑成功！' : '新增成功！');
      setModalVisible(false);
      onReload();
      setConfirmLoading(false);
    } else {
      setConfirmLoading(false);
      message.error(id ? '编辑失败！' : '新增失败！');
    }
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
  const columns: ProColumns<SingleUserState>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      valueType: 'digit',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      valueType: 'text',
      key: 'name',
      render: (text: any) => <a>{text}</a>,
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: any, record: SingleUserState) => (
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
      valueType: 'dateTime',
      key: 'create_time',
    },
  ];

  return (
    <div className="list-table">
      <ProTable
        actionRef={ref}
        columns={columns}
        dataSource={users.data.length ? users.data : []}
        rowKey="id"
        loading={userListLoading}
        search={false}
        pagination={false}
        options={{
          density: true,
          fullScreen: true,
          reload: () => {
            onReload();
          },
          setting: true,
        }}
        headerTitle="用户列表"
        toolBarRender={() => [
          <Button type="primary" onClick={onAdd}>
            添加
          </Button>,
          <Button onClick={onReload}>刷新</Button>,
        ]}
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
        confirmLoading={confirmLoading}
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
