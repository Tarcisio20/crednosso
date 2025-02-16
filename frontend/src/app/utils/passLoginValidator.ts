export const passLoginValidator = (senha: string): string | null => {
  if (senha.length < 6) {
    return "A senha deve ter pelo menos 6 caracteres";
  }

  return null; // Retorna `null` se estiver tudo certo
};
