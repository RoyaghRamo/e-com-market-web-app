export interface User {
  email: string;
  password: string;
}

export interface IRegister {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ILogin {
  email: string;
  password: string;
}

export const passwordRegex: string =
  '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,}';

export const passwordPatternError = `
Password must clear the following conditions:\n
\t* at least 1 lower character\n
\t* at least 1 upper character\n
\t* at least 1 number\n
\t* at least 1 special character\n
\t* Minimum length is 8\n
`;
