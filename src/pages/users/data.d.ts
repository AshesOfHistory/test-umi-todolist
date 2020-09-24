export interface SingleUserState {
  id: number;
  name: string;
  email: string;
  create_time: Date;
  update_time: Date;
  status: number;
}

export interface FormValues {
  [name: string]: any;
}

export interface Meta {
  total: number;
  per_page: number;
  page: number;
}
