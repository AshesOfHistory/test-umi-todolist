import { request } from 'umi';
import { message } from 'antd';

export const getRemoteList = async () => {
  return await request('/api/users', {
    method: 'get',
  })
    .then(response => {
      return response.data;
    })
    .catch(err => {
      return [];
    });
};

export const editRecord = async ({ id, values }) => {
  return request(`/api/users/${id}`, {
    method: 'put',
    data: values,
  })
    .then(res => {
      message.success('编辑成功！');
      return res.data;
    })
    .catch(err => {
      message.error('编辑失败！');
      console.log(err);
    });
};

export const deleteRecord = async id => {
  return request(`/api/users/${id}`, {
    method: 'delete',
  })
    .then(res => {
      message.success('删除成功！');
      return res.data;
    })
    .catch(err => {
      message.error('删除失败！');
      console.log(err);
    });
};
