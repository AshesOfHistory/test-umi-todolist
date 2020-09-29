import React, { useEffect, FC } from 'react';
import { Modal, Form, Input, message, DatePicker, Switch } from 'antd';
import { SingleUserState, FormValues } from '../data';
import moment from 'moment';

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

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};

const UserModalIndex: FC<UserStateProps> = props => {
  const [form] = Form.useForm();
  const { visible, record, handleClose, onFinish, confirmLoading } = props;
  useEffect(() => {
    if (record) {
      form.setFieldsValue({
        ...record,
        create_time: moment(record.create_time),
        status: record.status === 1,
      });
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
      title={record ? '编辑 ID:' + record.id : '新增'}
      visible={visible}
      onOk={onOk}
      onCancel={handleClose}
      forceRender
      confirmLoading={confirmLoading}
    >
      {/*initialValues={record} 能赋值，但是无法动态改变参数*/}
      <Form
        {...layout}
        name="basic"
        form={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        initialValues={{
          status: true,
        }}
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
          <DatePicker showTime />
        </Form.Item>
        <Form.Item label="status" name="status" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default UserModalIndex;
