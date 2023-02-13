
export default {
  languageName: 'Español',
  edit: 'Editar',
  cancel: 'Cancelar',
  save: 'Guardar',
  auth: {
    login: 'Iniciar sesión',
    email: 'Correo electrónico',
    password: 'Contraseña',
    newPassword: 'Nueva contraseña',
    titleUserProfile: 'Perfil de usuario',
    language: 'Idioma',
    displayName: 'Nombre de usuario',
    passwordStrength: ctx => [
      'Contraseña insegura',
      'Contraseña muy débil',
      'Contraseña débil',
      'Contraseña moderadamente segura',
      'Contraseña fuerte'
    ][ctx.named('score')],
    passwordMinLength: ctx => `La contraseña debe tener al menos ${ctx.named('minLength')} caracteres`,
    passwordWeak: 'Contraseña muy débil',
    passwordUpdated: 'Contraseña actualizada correctamente',
    profileUpdated: 'Perfil actualizado correctamente',
    nameIsRequired: 'Nombre es requerido',
    currentPassword: 'Contraseña actual',
    changeOfPassword: 'Cambio de contraseña (Opcional)',
    currentPasswordRequiredToChangePassword: 'La contraseña actual es requerida para cambiar la contraseña',
    problemChangingPassword: 'Hubo un problema cambiando su contraseña',
    problemUpdatingProfile: 'Hubo un problema actualizando su perfil',
    problemTryingToLogin: 'Hubo un problema intentando iniciar sesión',
    newUserWhatsYourDisplayName: 'Bienvenido ¿Cuál es tu nombre?',
    newUserWhatsYourDisplayNameMessage: 'Por favor, indique su nombre a mostrar',
  },
  book: {
    title: 'Título',
    addBookSuccess: 'Libro agregado correctamente',
  }
}
