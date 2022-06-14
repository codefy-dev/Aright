
export default {
  languageName: 'English',
  edit: 'Edit',
  cancel: 'Cancel',
  save: 'Save',
  auth: {
    login: 'Login',
    email: 'Email',
    password: 'Password',
    newPassword: 'New Password',
    titleUserProfile: 'User Profile',
    language: 'Language',
    displayName: 'Display Name',
    passwordStrength: ctx => [
      'Password is completely insecure',
      'Password is too weak',
      'Password is moderately weak',
      'Password is fairly secure',
      'This is a strong password!'
    ][ctx.named('score')],
    passwordMinLength: ctx => `Password must be at least ${ctx.named('minLength')} characters long`,
    passwordWeak: 'Password is too weak',
    nameIsRequired: 'Name is required',
  },
}
