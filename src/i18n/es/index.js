
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
    nameIsRequired: 'Nombre es requerido',
  }
}
