import React, { useEffect, FC } from 'react';
import { Modal, Form, Input, message } from 'antd';
import { SingleUserState, FormValues } from '../data';

interface UserStateProps {
  visible: boolean;
  record: SingleUserState | undefined;
  handleClose: () => void;
  onFinish: (values: FormValues) => void;
  confirmLoading: boolean;
}

interface ValidateErrorEntity<Values = any> {
  values: Values;
  errorFields: {
    name: (string | number)[];
    errors: string[];
  }[];
  outOfDate: boolean;
}

const UserModalIndex: FC<UserStateProps> = props => {
  const [form] = Form.useForm();
  const { visible, record, handleClose, onFinish, confirmLoading } = props;
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
  const onFinishFailed = (errInfo: ValidateErrorEntity) => {
    console.log(errInfo);
    message.error(errInfo.errorFields[0].errors[0]);
  };

  return (
    <Modal
      title="Basic Modal"
      visible={visible}
      onOk={onOk}
      onCancel={handleClose}
      forceRender
      confirmLoading={confirmLoading}
    >
      {/*initialValues={record} 能赋值，但是无法动态改变参数*/}
      <Form
        name="basic"
        form={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: '请输入名称！' }]}
        >
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
