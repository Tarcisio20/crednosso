export const passValidator =  (senha: string, confirmarSenha: string): string | null => {
    if (senha !== confirmarSenha) {
      return 'As senhas não coincidem';
    }
  
    if (senha.length < 6) {
      return 'A senha deve ter pelo menos 6 caracteres';
    }
  
    return null; // Retorna `null` se estiver tudo certo
  };
  