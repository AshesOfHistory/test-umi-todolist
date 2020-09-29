import { Reducer, Effect, Subscription } from 'umi';
import {
  getRemoteList,
  editRecord,
  deleteRecord,
  addRecord,
} from '@/pages/users/service';
import { message } from 'antd';
import { SingleUserState, Meta } from './data';

export interface UserState {
  data: SingleUserState[];
  meta: Meta;
}

interface UserModelType {
  namespace: 'users';
  state: UserState;
  reducers: {
    getList: Reducer<UserState>;
  };
  effects: {
    getRemote: Effect;
    edit: Effect;
    delete: Effect;
    add: Effect;
  };
  subscriptions: {
    setup: Subscription;
  };
}

const UserModel: UserModelType = {
  namespace: 'users',
  state: { data: [], meta: { total: 0, per_page: 10, page: 1 } },
  reducers: {
    getList(state, { payload }) {
      // 接收上一次的数据，返回新数据
      return payload;
    },
  },
  effects: {
    *getRemote({ payload: { page, per_page } }, { put, call }) {
      // 无返回值 返回到页面的数据只能通过reducer来传递
      const data = yield call(getRemoteList, { page, per_page });
      if (data) {
        yield put({
          type: 'getList',
          payload: data,
        });
      }
    },
    *edit({ payload }, { put, call, select }) {
      const data = yield call(editRecord, payload);
      const { page, per_page } = yield select(state => state.users.meta);
      if (data) {
        message.success('编辑成功');
        yield put({
          type: 'getRemote',
          payload: {
            page,
            per_page,
          },
        });
      }
    },
    *delete({ payload }, { put, call, select }) {
      const data = yield call(deleteRecord, payload);
      const { page, per_page } = yield select(state => state.users.meta);
      if (data) {
        message.success('删除成功');
        yield put({
          type: 'getRemote',
          payload: {
            page,
            per_page,
          },
        });
      }
    },
    *add({ payload }, { put, call, select }) {
      const data = yield call(addRecord, payload.values);
      const { page, per_page } = yield select(state => state.users.meta);
      if (data) {
        message.success('新增成功');
        yield put({
          type: 'getRemote',
          payload: {
            page,
            per_page,
          },
        });
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/users') {
          dispatch({
            type: 'getRemote',
            payload: {
              page: 1,
              per_page: 5,
            },
          });
        }
      });
    },
  },
};
export default UserModel;
