
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
    passwordUpdated: 'Password updated successfully',
    profileUpdated: 'Profile updated successfully',
    nameIsRequired: 'Name is required',
    wrongPassword: 'Wrong password',
    currentPassword: 'Current Password',
    changeOfPassword: 'Change of Password (Optional)',
    currentPasswordRequiredToChangePassword: 'Current password is required to change password',
    problemChangingPassword: 'There was a problem changing your password',
    problemUpdatingProfile: 'There was a problem updating your profile',
    problemTryingToLogin: 'There was a problem trying to login',
    newUserWhatsYourDisplayName: 'Welcome! What is your name?',
    newUserWhatsYourDisplayNameMessage: 'Please set your display name',
  },
  book: {
    title: 'Title',
    addBookSuccess: 'Book added successfully',
  }
}
