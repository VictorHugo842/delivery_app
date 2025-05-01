'use client';

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import Input from '../../components/input';
import Button from '../../components/button';
import Title from '../../components/title';
import Paragraph from '../../components/paragraph';
import ContainerForm from '../../components/container_form';
import CheckboxText from '../../components/checkbox_text';
import LinkText from '../../components/link_text';

export default function PaginaRegistro() {

    const [loading, setLoading] = useState(true); // Estado para controlar a tela de redirecionamento
    const [step, setStep] = useState(1);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const router = useRouter();

    useEffect(() => {
        // Função para verificar se o usuário já está logado
        const checkLogin = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/check_auth_tenant`, {
                    withCredentials: true, // precisa para enviar o cookie JWT
                });

                if (response.status === 200) {
                    // Se está logado, redireciona para /delivery
                    router.push("/admin/delivery");
                }
            } catch (error: any) {
                // Se deu 401 (não logado), não faz nada e continua na página de login
                if (error.response?.status === 401) {
                    // Usuário não autenticado, pode continuar na página
                    setLoading(false); // Para de carregar quando a verificação termina
                    return;
                } else {
                    console.error("Erro ao verificar login:", error);
                    setLoading(false); // Para de carregar se houver erro na verificação
                }
            }
        };

        checkLogin();
    }, [router]);

    const { control, handleSubmit, watch, getValues, trigger, formState: { errors } } = useForm({
        defaultValues: {
            nomeUsuario: '',
            email: '',
            documento: '',
            integrarWhatsapp: false,
            telefoneWhatsappBusiness: '',
            telefone: '',
            nomeLoja: '',
            tipoEstabelecimento: '',
            faturamentoMensal: '',
            senha: '',
            confirmarSenha: '',
            modoOperacao: [] as string[]
        },
    });
    const integrarWhatsapp = watch('integrarWhatsapp');

    const camposValidos = [
        "nomeUsuario",
        "email",
        "documento",
        "telefone",
        "telefoneWhatsappBusiness",
        "nomeLoja",
        "integrarWhatsapp",
        "tipoEstabelecimento",
        "faturamentoMensal",
        "senha",
        "confirmarSenha",
        "modoOperacao"
    ] as const;

    type CamposValidos = typeof camposValidos[number];

    const handleProximo = async () => {
        let camposParaValidar: CamposValidos[] = [];
        // VALIDAÇÕES PARA TELEFONE BUSINESS, SE TIVER CHECKADO, DEVE SER OBRIGATÓRI
        if (step === 1) {
            camposParaValidar = ["nomeUsuario", "email", "telefone", "documento"];
        } else if (step === 2) {
            camposParaValidar = ["nomeLoja", "tipoEstabelecimento", "faturamentoMensal", "modoOperacao"];
        }

        const valido = await trigger(camposParaValidar);

        if (valido) {
            setStep(step + 1);
        }
    };

    const handleVoltar = () => {
        if (step > 1) {
            setError('');
            setStep(step - 1);
        }
    };

    const handleFinalizar = async () => {
        const valido = await trigger(["senha", "confirmarSenha"]);

        if (valido) {
            onSubmit(getValues()); // Chama o onSubmit para submeter os dados
        }
    };


    const onSubmit = async (data: any) => {
        setError('');
        setSuccess('');

        try {
            const payload = {
                nome_loja: data.nomeLoja,
                telefone: data.telefone,
                telefoneWhatsappBusiness: data.telefoneWhatsappBusiness,
                nome_usuario: data.nomeUsuario,
                documento: data.documento,
                email: data.email,
                integrarWhatsapp: data.integrarWhatsapp,
                tipo_estabelecimento: data.tipoEstabelecimento,
                faturamento_mensal: data.faturamentoMensal,
                senha: data.senha,
                confirmar_senha: data.confirmarSenha,
                modo_operacao: data.modoOperacao,
            };

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/painel/registrar`,
                payload,
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                }
            );

            // Sucesso no registro
            setSuccess('Registro realizado com sucesso!');
            console.log('Registro bem-sucedido:', response.data);

            router.push('/admin/delivery');  // Redireciona após o sucesso
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                // Logar informações completas sobre o erro de Axios
                console.log('Erro de Axios:', error); // Loga o erro completo
                setError(error.response?.data?.msg || 'Erro ao registrar usuário');
                console.log('Erro ao registrar usuário:', error.response?.data);
            } else {
                console.log('Erro inesperado:', error); // Loga o erro completo
                setError('Erro inesperado: ' + error.message);
            }
        }

    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-8">
                <Title text="Redirecionando..." />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <ContainerForm>
                <Title text="Crie sua conta" />
                <Paragraph
                    text={step === 1 ? 'Fala um pouco sobre você.' : step === 2 ? 'Queremos conhecer seu negócio.' : 'Defina sua senha.'}
                    className="mb-6"
                />

                {error && <p className="text-red-600 mb-4">{error}</p>}
                {success && <p className="text-green-600 mb-4">{success}</p>}

                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    {/* Etapa 1 */}
                    {step === 1 && (
                        <>
                            <Controller
                                name="nomeUsuario"
                                control={control}
                                rules={{ required: 'Nome é obrigatório', minLength: { value: 3, message: 'Nome muito curto' } }}
                                render={({ field }) => <Input type="text" label="Nome" placeholder="Digite seu nome" {...field} error={errors.nomeUsuario} />}
                            />

                            <Controller
                                name="email"
                                control={control}
                                rules={{ required: 'E-mail é obrigatório', pattern: { value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, message: 'E-mail inválido' } }}
                                render={({ field }) => <Input label="E-mail" type="email" placeholder="Digite seu e-mail" {...field} error={errors.email} />}
                            />

                            <Controller
                                name="telefone"
                                control={control}
                                rules={{ required: 'Telefone é obrigatório' }}
                                render={({ field }) => <Input label="Telefone Pessoal" type="tel" placeholder="Digite seu telefone" {...field} error={errors.telefone} />}
                            />
                            <Controller
                                name="documento"
                                control={control}
                                rules={{ required: 'CPF ou CNPJ é obrigatório' }}
                                render={({ field }) => <Input label="CPF\CNPJ" type="tel" placeholder="Digite seu documento" {...field} error={errors.documento} />}
                            />
                            {/* <Controller
                                name="integrarWhatsapp"
                                control={control}
                                render={({ field }) => (
                                    <CheckboxText
                                        checked={field.value}
                                        onChange={field.onChange}
                                        label="Ativar integração com WhatsApp (requer WhatsApp Business)"
                                    />
                                )}
                            />

                            <div
                                className={`transition-all duration-300 ease-in-out ${integrarWhatsapp ? 'opacity-100 max-h-screen' : 'opacity-0 max-h-0 overflow-hidden'
                                    }`}
                            >
                                {integrarWhatsapp && (
                                    <Controller
                                        name="telefoneWhatsappBusiness"
                                        control={control}
                                        rules={{ required: 'Telefone para WhatsApp Business é obrigatório' }}
                                        render={({ field }) => (
                                            <Input
                                                label="Telefone WhatsApp Business"
                                                type="tel"
                                                placeholder="Digite seu WhatsApp Business"
                                                {...field}
                                                error={errors.telefone}
                                            />
                                        )}
                                    />
                                )}
                            </div> */}
                        </>
                    )}

                    {/* Etapa 2 */}
                    {step === 2 && (
                        <>
                            <Controller
                                name="nomeLoja"
                                control={control}
                                rules={{ required: 'Nome da loja é obrigatório' }}
                                render={({ field }) => <Input type="text" label="Nome da Loja" placeholder="Digite o nome da loja" {...field} error={errors.nomeLoja} />}
                            />

                            <Controller
                                name="tipoEstabelecimento"
                                control={control}
                                rules={{ required: 'Tipo de estabelecimento é obrigatório' }}
                                render={({ field }) => (
                                    <Input
                                        label="Tipo de Estabelecimento"
                                        type="select"
                                        options={[
                                            { value: 'restaurante', label: 'Restaurante' },
                                            { value: 'lanchonete', label: 'Lanchonete' },
                                            { value: 'hamburgueria', label: 'Hamburgueria' },
                                            { value: 'doceria', label: 'Doceria' },
                                            { value: 'acaiteria', label: 'Açaiteria' },
                                            { value: 'pizzaria', label: 'Pizzaria' },
                                            { value: 'bar / petiscaria', label: 'Bar / Petiscaria' },
                                            { value: 'saladeria', label: 'Saladeria' },
                                            { value: 'distribuidora de bebidas', label: 'Distribuidora de Bebidas' },
                                            { value: 'padaria', label: 'Padaria' },
                                            { value: 'cafeteria', label: 'Cafeteria' },
                                            { value: 'sorveteria', label: 'Sorveteria' },
                                            { value: 'comida oriental', label: 'Comida Oriental' },
                                        ]}
                                        {...field}
                                        error={errors.tipoEstabelecimento}
                                    />
                                )}
                            />

                            <Paragraph text="Como você trabalha hoje?" className="font-medium mb-2" />
                            <Controller
                                name="modoOperacao"
                                control={control}
                                rules={{
                                    validate: (value) => value.length > 0 || 'Selecione pelo menos uma opção',
                                }}
                                defaultValue={[]}
                                render={({ field }) => (
                                    <>
                                        {["Retirada no local", "Entregas delivery", "Emissão de nota fiscal"].map((opcao) => (
                                            <CheckboxText
                                                key={opcao}
                                                checked={field.value.includes(opcao)}
                                                onChange={() => {
                                                    const newValue = field.value.includes(opcao)
                                                        ? field.value.filter((item: string) => item !== opcao)
                                                        : [...field.value, opcao];
                                                    field.onChange(newValue);
                                                }}
                                                label={opcao}
                                                className="mb-3"
                                            />
                                        ))}
                                        {errors.modoOperacao && (
                                            <p className="text-red-600 text-xs">{errors.modoOperacao.message}</p>
                                        )}
                                    </>
                                )}
                            />

                            <Controller
                                name="faturamentoMensal"
                                control={control}
                                rules={{ required: 'Faturamento mensal é obrigatório' }}
                                render={({ field }) => (
                                    <Input
                                        label="Faturamento mensal"
                                        type="select"
                                        options={[
                                            { value: 'ate-5000', label: 'até 5 mil' },
                                            { value: '5000-15000', label: '5 a 15 mil' },
                                            { value: '15000-30000', label: '15 a 30 mil' },
                                            { value: '30000-60000', label: '30 a 60 mil' },
                                            { value: 'mais-60000', label: '+ de 60 mil' },
                                        ]}
                                        {...field}
                                        error={errors.faturamentoMensal}
                                    />
                                )}
                            />
                        </>
                    )}

                    {/* Etapa 3 */}
                    {step === 3 && (
                        <>
                            <Controller
                                name="senha"
                                control={control}
                                rules={{
                                    required: 'Senha é obrigatória',
                                    minLength: {
                                        value: 6,
                                        message: 'A senha precisa ter pelo menos 6 caracteres',
                                    },
                                }}
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

                            <Controller
                                name="confirmarSenha"
                                control={control}
                                rules={{
                                    required: 'Confirme sua senha',
                                    validate: (value) =>
                                        value === watch('senha') || 'As senhas não coincidem',
                                }}
                                render={({ field }) => (
                                    <Input
                                        label="Confirmar Senha"
                                        type="password"
                                        placeholder="Confirme sua senha"
                                        {...field}
                                        error={errors.confirmarSenha}
                                    />
                                )}
                            />
                        </>
                    )}

                    <div className="flex justify-between">
                        {step > 1 && (
                            <Button type="button" text="Voltar" onClick={handleVoltar} className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded-lg" />
                        )}

                        {step < 3 ? (
                            <Button type="button" text="Próximo" onClick={handleProximo} className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg" />
                        ) : (
                            <Button
                                type="button"
                                text="Finalizar"
                                onClick={handleFinalizar}
                                className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg"
                            />)}
                    </div>
                </form>
                <div className="text-center text-xs text-slate-700 mt-4">
                    <Paragraph text="Já tem uma conta?" className="text-xs inline mb-6 mr-1" />
                    <LinkText href="/auth/login" text="Acesse" className='text-blue-400' />
                </div>
            </ContainerForm>
        </div>
    );
}