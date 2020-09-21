import { request } from 'umi';

export const getRemoteList = async () => {
  return request('/api/users', {
    method: 'get',
  }).then((response => {
    return response.data;
  }))
    .catch(err => {
      return []
    });
};

export const editRecord = async ({ id, values }) => {
  return request(`/api/users/${id}`, {
    method: 'put',
    data: values,
  }).then(res => {
    return res.data;
  }).catch(err => {
    console.log(err);
  });
};

export const deleteRecord = async id => {
  return request(`/api/users/${id}`, {
    method: 'delete',
  }).then(res => {
    return res.data;
  }).catch(err => {
    console.log(err);
  });
};
