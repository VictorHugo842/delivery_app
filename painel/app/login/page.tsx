'use client';

import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { useRouter } from 'next/navigation'; // Importando o useRouter
import Input from '../components/input';
import Button from '../components/button';
import Title from '../components/title';
import Paragraph from '../components/paragraph';
import CheckboxText from '../components/checkbox_text';
import LinkText from '../components/link_text';
import ContainerForm from '../components/container_form';

export default function PaginaLogin() {
  const { control, handleSubmit, formState: { errors } } = useForm({
    mode: 'onSubmit',
    defaultValues: {
      email: '',
      senha: '',
      lembrarSenha: false,
    },
  });

  const router = useRouter(); // Inicializando o hook useRouter

  const onSubmit = async (data: any) => {
    const { email, senha, lembrarSenha } = data;

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/painel/login`,
        { email, senha, lembrar_senha: lembrarSenha },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );

      console.log('Login bem-sucedido:', response.data);
      alert('Login realizado com sucesso!');

      // Redireciona para a página /delivery após o login bem-sucedido
      router.push('/delivery');
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.msg || 'Erro ao fazer login');
      } else {
        alert('Erro inesperado: ' + error.message);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <ContainerForm>
        <Title text="Seja bem-vindo!" />
        <Paragraph text="Entre com seu CNPJ e Senha" className="mb-6" />

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {/* Campo de E-mail */}
          <Controller
            name="email"
            control={control}
            rules={{
              required: 'E-mail é obrigatório',
              pattern: {
                value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                message: 'E-mail inválido',
              },
            }}
            render={({ field }) => (
              <Input
                label="E-mail"
                type="email"
                placeholder="Digite seu e-mail"
                {...field}
                error={errors.email}
              />
            )}
          />

          {/* Campo de Senha */}
          <Controller
            name="senha"
            control={control}
            rules={{ required: 'Senha é obrigatória' }}
            render={({ field }) => (
              <Input
                label="Senha"
                type="password"
                placeholder="Digite sua senha"
                {...field}
                error={errors.senha}
              />
            )}
          />

          {/* Checkbox "Lembrar-me" */}
          <div className="flex justify-between items-center">
            <Controller
              name="lembrarSenha"
              control={control}
              render={({ field }) => (
                <CheckboxText
                  checked={field.value}
                  onChange={field.onChange}
                  label="Lembrar-me"
                />
              )}
            />
            <LinkText href="/por-rota-pra-redefinir" text="Esqueceu a senha?" className='text-blue-400' />
          </div>

          <Button type="submit" text="Entrar" />

          <div className="text-center text-xs text-slate-700 mt-4">
            <Paragraph text="Não tem uma conta?" className="text-xs inline mb-6 mr-1" />
            <LinkText href="/registro" text="Registrar" className='text-blue-400' />
          </div>

        </form>
      </ContainerForm>
    </div>
  );
}
