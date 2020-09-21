import request, { extend } from 'umi-request';
import { message } from 'antd';

const errorHandler = function(error) {
  if (error.response) {
    // 请求已发送但服务端返回状态码非 2xx 的响应
    console.log(error);
    if (error.response.status > 400) {
      message.error(error.data.message ? error.data.message : error.data);
    }
  } else {
    // 请求初始化时出错或者没有响应返回的异常
    message.error('网络出错啦！');
  }
};
// 作为统一错误处理
const extendRequest = extend({ errorHandler });

export const getRemoteList = async () => {
  return extendRequest('/api/users', {
    method: 'get',
  })
    .then(response => {
      return response.data;
    })
    .catch(err => {
      return false;
    });
};

export const editRecord = async ({ id, values }) => {
  return extendRequest(`/api/users/${id}`, {
    method: 'put',
    data: values,
  })
    .then(res => {
      return true;
    })
    .catch(err => {
      return false;
    });
};

export const deleteRecord = async id => {
  return extendRequest(`/api/users/${id}`, {
    method: 'delete',
  })
    .then(res => {
      return true;
    })
    .catch(err => {
      return false;
    });
};

export const addRecord = async values => {
  return extendRequest(`/api/users`, {
    method: 'post',
    data: values,
  })
    .then(() => {
      return true;
    })
    .catch(() => {
      return false;
    });
};
