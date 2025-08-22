type TypeMetaData = {
  data: {
    _id: string;
    name: string;
    email: string;
    password: string;
    role: string;
    avatar: string;
  };
  token: {
    access_token: string;
    refresh_token: string;
  };
};
export interface LoginResType {
  statusCode: number;
  message: string;
  metaData: TypeMetaData;
}
