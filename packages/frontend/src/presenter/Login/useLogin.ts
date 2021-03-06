import { useForm } from 'react-hook-form';
import { vestResolver } from '@hookform/resolvers/vest';
import vest, { test, enforce } from 'vest';
import validator from 'validator';
import { useAuth } from '../../model/providers';

import { useFormErrors } from '../../model/Hooks';
// import { useToast } from '../../model/providers';
import { useLogin as login } from '../../model/Login/commands';
import { UA } from '../../model/providers/Auth/constants';

type LoginFormInput = {
  email: string;
  password: string;
};

enforce.extend({ isEmail: validator.isEmail });

const validationSuite = vest.create(
  'login_form',
  ({ email, password }: LoginFormInput) => {
    test('email', 'Email is required', () => {
      enforce(email).isNotEmpty();
    });

    test('email', 'Please enter correct Email', () => {
      enforce(email).isEmail();
    });

    test('password', 'Password is required', () => {
      enforce(password).isNotEmpty();
    });

    test('password', 'Password must be at least 8 chars', () => {
      enforce(password).longerThanOrEquals(8);
    });

    test('password', 'Password must contain a digit', () => {
      enforce(password).matches(/[0-9]/);
    });

    test('password', 'Password must contain a symbol', () => {
      enforce(password).matches(/[^A-Za-z0-9]/);
    });
  }
);

export const useLogin = () => {
  // const { showErrorToast } = useToast();
  const { setAuth } = useAuth();
  const { handleSubmit, control, errors } = useForm<LoginFormInput>({
    reValidateMode: 'onSubmit',
    resolver: vestResolver(validationSuite),
    defaultValues: {
      email: 'admin@example.com',
      password: 'Secret123!',
    },
  });

  const handleLogin = (data: any) => {
    setAuth(data.login);
  };

  // @TODO use showErrorToast with message to show why error appeared
  const handleError = (err: any) => console.error(err);

  const { onLogin } = login({ onCompleted: handleLogin, onError: handleError });

  useFormErrors(errors);

  const onSubmit = ({ email, password }: LoginFormInput) => {
    onLogin({
      variables: {
        email,
        password,
        device: UA,
      },
    });
  };

  return {
    control,
    onSubmit: handleSubmit(onSubmit),
    errors,
  };
};
