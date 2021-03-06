import { useForm } from 'react-hook-form';
import { vestResolver } from '@hookform/resolvers/vest';
import vest, { test, enforce } from 'vest';
import { ROUTES, useToast } from '../../model/providers';
import { useFormErrors } from '../../model/Hooks';
import { useResetPassword as resetPassword } from '../../model/ResetPassword/commands';
import { useHistory } from 'react-router-dom';
import { getQueryData } from '../../utils/getQueryString';

type ResetPasswordFormInput = {
  password: string;
  confirmPassword: string;
};

const validationSuite = vest.create(
  'reset_password_request_form',
  ({ password, confirmPassword }: ResetPasswordFormInput) => {
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
    test('confirmPassword', 'Passwords do not match', () => {
      enforce(confirmPassword).equals(password);
    });
  }
);

export const useResetPassword = () => {
  const { showSuccessToast, showErrorToast } = useToast();
  const { push, location } = useHistory();

  const { code, email } = getQueryData(location.search);

  const { handleSubmit, control, errors } = useForm<ResetPasswordFormInput>({
    reValidateMode: 'onSubmit',
    resolver: vestResolver(validationSuite),
  });

  const { onResetPassword } = resetPassword({
    onCompleted: ({ resetPassword }: { resetPassword: boolean }) => {
      if (resetPassword) {
        showSuccessToast('Your password was changed successfully');
        push(ROUTES.LOGIN);
      } else {
        showSuccessToast('Something went wrong. Try again later, please.');
      }
    },
    onError: (error: Error): void => showErrorToast(error.message),
  });

  useFormErrors(errors);

  const onSubmit = ({ password }: ResetPasswordFormInput) => {
    onResetPassword({
      variables: {
        password,
        code,
        email,
      },
    });
  };

  return {
    control,
    onSubmit: handleSubmit(onSubmit),
    errors,
  };
};
