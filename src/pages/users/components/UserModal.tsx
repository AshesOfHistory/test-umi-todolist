import React, { useEffect } from 'react';
import { Modal, Form, Input } from 'antd';

const UserModalIndex = props => {
  const [form] = Form.useForm();
  const { visible, record, handleCancel, handleOk, onFinish } = props;
  useEffect(() => {
    if (record) {
      form.setFieldsValue(record);
    } else {
      form.resetFields();
    }
  }, [visible]);

  const onOk = () => {
    form.submit();
  };
  const onFinishFailed = err => {
    console.log(err);
  };

  return (
    <Modal
      title="Basic Modal"
      visible={visible}
      onOk={onOk}
      onCancel={handleCancel}
      forceRender
    >
      {/*initialValues={record} 能赋值，但是无法动态改变参数*/}
      <Form
        name="basic"
        form={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item label="Name" name="name">
          <Input />
        </Form.Item>

        <Form.Item label="Email" name="email">
          <Input />
        </Form.Item>
        <Form.Item label="Create Time" name="create_time">
          <Input />
        </Form.Item>
        <Form.Item label="ID" name="id">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default UserModalIndex;
