import { Reducer, Effect, Subscription } from 'umi';
import { getRemoteList, editRecord, deleteRecord } from '@/pages/users/service';

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
      yield put({
        type: 'getList',
        payload: data,
      });
    },
    *edit({ payload }, { put, call }) {
      const data = yield call(editRecord, payload);
      yield put({
        type: 'getRemote',
      });
    },
    *delete({ payload }, { put, call }) {
      const data = yield call(deleteRecord, payload);
      yield put({
        type: 'getRemote',
      });
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
