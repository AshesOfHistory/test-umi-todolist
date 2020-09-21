import { Reducer, Effect, Subscription } from 'umi';
import {
  getRemoteList,
  editRecord,
  deleteRecord,
  addRecord,
} from '@/pages/users/service';
import { message } from 'antd';

interface UserModelType {
  namespace: 'users';
  state: {};
  reducers: {
    getList: Reducer;
  };
  effects: {
    getRemote: Effect;
    edit: Effect;
    delete: Effect;
  };
  subscriptions: {
    setup: Subscription;
  };
}

const UserModel: UserModelType = {
  namespace: 'users',
  state: {},
  reducers: {
    getList(state, { payload }) {
      // 接收上一次的数据，返回新数据
      return payload;
    },
  },
  effects: {
    *getRemote(action, { put, call }) {
      // 无返回值 返回到页面的数据只能通过reducer来传递
      const data = yield call(getRemoteList);
      if (data) {
        yield put({
          type: 'getList',
          payload: data,
        });
      }
    },
    *edit({ payload }, { put, call }) {
      const data = yield call(editRecord, payload);
      if (data) {
        message.success('编辑成功');
        yield put({
          type: 'getRemote',
        });
      } else {
        message.error('编辑失败');
      }
    },
    *delete({ payload }, { put, call }) {
      const data = yield call(deleteRecord, payload);
      if (data) {
        message.success('删除成功');
        yield put({
          type: 'getRemote',
        });
      } else {
        message.error('删除失败');
      }
    },
    *add({ payload }, { put, call }) {
      const data = yield call(addRecord, payload.values);
      if (data) {
        message.success('新增成功');
        yield put({
          type: 'getRemote',
        });
      } else {
        message.error('新增失败');
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/users') {
          dispatch({
            type: 'getRemote',
          });
        }
      });
    },
  },
};
export default UserModel;
