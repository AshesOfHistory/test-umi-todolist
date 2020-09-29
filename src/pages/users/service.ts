import request, { extend } from 'umi-request';
import { message } from 'antd';
import { SingleUserState, FormValues } from './data';

const errorHandler = function(error: any) {
  if (error.response) {
    // 请求已发送但服务端返回状态码非 2xx 的响应
    if (error.response.status > 400) {
      const getMsg = () => {
        if (error.data) {
          if (error.data.message) {
            return error.data.message;
          }
          if (error.data.msg) {
            return error.data.msg;
          }
          return '';
        } else {
          return '';
        }
      };
      const msg = getMsg();
      if (msg) {
        message.error(msg);
      }
      throw new Error(msg);
    }
  } else {
    // 请求初始化时出错或者没有响应返回的异常
    message.error('网络出错啦！');
  }
};
// 作为统一错误处理
const extendRequest = extend({ errorHandler });

export const getRemoteList = async ({
  page,
  per_page,
}: {
  page: number;
  per_page: number;
}) => {
  return extendRequest(`/api/users?page=${page}&per_page=${per_page}`, {
    method: 'get',
  })
    .then(response => {
      return response;
    })
    .catch(err => {
      return false;
    });
};

export const editRecord = async ({
  id,
  values,
}: {
  id: number;
  values: FormValues;
}) => {
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

export const deleteRecord = async (id: number) => {
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

export const addRecord = async (values: FormValues) => {
  return extendRequest(`/api/users`, {
    method: 'post',
    data: values,
  })
    .then(res => {
      return true;
    })
    .catch(err => {
      return false;
    });
};
